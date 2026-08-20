# Automatic deployment to Lightsail

`lightsail-autodeploy.sh` redeploys www.ktdoctor.com whenever new commits
appear on `origin/main`. Cron runs it every two minutes on the Lightsail box
at `3.19.170.142` as the `ubuntu` user.

Design rationale lives in
`docs/superpowers/specs/2026-08-20-lightsail-autodeploy-design.md`.

## What it does

Fetches `origin/main`. If everything upstream is already merged, it logs one
line and exits. Otherwise it pulls, builds, swaps the container, health checks
it at `http://localhost:8161/`, and prunes old images and build cache.

Every failure before the swap exits without touching the running container, so
a broken commit leaves the site on the previous version rather than breaking
it. The health check runs after the swap and only reports: it never gates the
deploy and never rolls anything back.

A run that cannot take its lock (`~/.ktdoctor-autodeploy.lock`) exits
immediately and silently, because the run already holding it is doing the same
work. This is normal on a tick that lands during a long build.

### Failed deploys are not retried

The pull happens before the build, so a failed build or a failed swap leaves
the checkout on the new commit while the container stays on the old one. The
script does not retry that commit: one that failed to build will fail again,
and retrying it every two minutes would just burn the box. Instead it records
the unbuilt commit in `~/.ktdoctor-autodeploy-unbuilt`, and while the gap
stands, every later run logs

```
WARN   HEAD <sha> has never been built, container is behind
```

rather than `ok     up to date`. See "Reading the logs" for what to do about
it. A successful deploy clears the marker.

### Pruning is host-wide

After every deploy, and also after a failed build or a failed swap, the script
runs both of these:

```
docker image prune   -f --filter "until=72h"
docker builder prune -f --filter "until=72h"
```

They run on the failure paths too, because a run of failing builds still
leaves layers and cache behind, and they run last on every path so they never
delay the container swap.

Both are host-wide, not scoped to this project. They look at every image and
all build cache on the box, including that of the other applications it also
runs (one of which is an EHR system with real patient data).

The image prune is safe: Docker will only ever remove an image that no
container, running or stopped, references, so an image any application still
needs cannot be pruned by this or any other `docker image prune` call.

The builder cache prune has a real cost rather than a risk: it can discard
BuildKit cache belonging to another application on the box, which makes that
application's next build slower. Build cache is regenerable, so nothing is
lost except time. It is worth that cost, because BuildKit cache for `npm ci`
plus `next build` runs to several GB and grows with every deploy, and
`docker image prune` does not touch it. Filling this box's root filesystem
would stop writes for every container on the host at once, patient records
included.

### Build priority, and what it does not do

The build runs as `nice -n 10 ionice -c3 docker compose ... build`, so it
yields CPU and disk IO to everything else on the box. Deploys now fire at any
hour with nobody watching, where previously a human picked the moment.

This does not bound memory. `next build` on this project peaks well over 1 GB,
and under memory pressure the kernel OOM killer scores processes by footprint
rather than by culpability, so the process it kills may belong to a
neighbouring container rather than to the build. An unattended build competing
for RAM with the other applications is an accepted risk of automatic
deployment. Weigh it against this instance's actual free memory before
enabling cron.

### The pull mode is deliberate

The pull always runs as `git pull --no-rebase`, regardless of the box's
ambient git config. A rebase-mode pull that hits a conflict leaves the
checkout mid-rebase, and `git merge --abort` is a no-op against that state, so
the script's cleanup would fail and every later cron tick would fail with it
until someone repairs the checkout by hand over SSH. Do not drop `--no-rebase`
to simplify this line.

## Install

The script runs from `~/bin`, deliberately outside the checkout, so that a
deploy which updates the script cannot rewrite the file mid-run. That means
installation is a copy, and updating the script later means copying again.

The branch carrying this script must already be merged to `main` and pulled
onto the box before it can be copied out of the checkout. Do that first:

```bash
cd ~/ktdoctor
git pull --no-edit --no-rebase origin main
```

Then install:

```bash
mkdir -p ~/bin ~/logs
cp ~/ktdoctor/deploy/lightsail-autodeploy.sh ~/bin/ktdoctor-autodeploy.sh
chmod +x ~/bin/ktdoctor-autodeploy.sh
```

## Verify before enabling cron

Run these in order. Do not add the cron entry until all six behave as
described.

**1. Disk headroom.** Establish where the box stands before handing it an
unattended job that builds images.

```bash
df -h /
docker system df
```

Write down the `Avail` figure for `/` and the `RECLAIMABLE` column. Both
prunes above are host-wide, so this is also the baseline for judging whether
they are keeping up. If `/` is already above about 80% used, fix that before
enabling unattended deploys: a full root filesystem stops writes for every
container on this box at the same time, including the EHR database.

**2. No new commits.** Should log one up-to-date line, build nothing, and
restart nothing. Capture the container's state before running, so there is
something to compare against:

```bash
docker compose -p ktdoctor-root --env-file .env.root ps
```

Note the STATUS/uptime shown, then run the script and check the same thing
again:

```bash
~/bin/ktdoctor-autodeploy.sh
tail -3 ~/logs/ktdoctor-deploy.log
docker compose -p ktdoctor-root --env-file .env.root ps
```

The STATUS/uptime from the second `ps` must be unchanged from the first. If
the container looks freshly started, something rebuilt it and this step has
failed.

**3. A real new commit.** Push a trivial change to `main` from your machine,
then:

```bash
~/bin/ktdoctor-autodeploy.sh
tail -3 ~/logs/ktdoctor-deploy.log
curl -sI https://www.ktdoctor.com/ | head -1
```

Expect a `200`, and a deploy log line starting with `ok     deployed <sha>`.
A line starting with `WARN   deployed <sha>` also contains the word
"deployed" but means something different: the container was swapped in but
did not answer at `http://localhost:8161/`, which is a failure worth chasing
down even though the site may still be serving.

**4. Nothing new again.** Immediately re-run. It must log up-to-date and do
nothing, which confirms change detection settles after a deploy rather than
looping.

```bash
~/bin/ktdoctor-autodeploy.sh
tail -2 ~/logs/ktdoctor-deploy.log
```

**5. The lock.** Hold the lock with an unrelated command, then try to run the
script against it. Note the log length first, so there is a number to compare:

```bash
wc -l ~/logs/ktdoctor-deploy.log
flock -n ~/.ktdoctor-autodeploy.lock sleep 60 &
~/bin/ktdoctor-autodeploy.sh; echo "exit=$?"
wc -l ~/logs/ktdoctor-deploy.log
kill %1
```

Expect `exit=1` immediately, no other output at all, and exactly the same line
count from both `wc -l` calls.

The total silence is by design, not a crash. `flock` refuses to start the
script before the script can log anything, and the run that holds the lock is
already doing the work, so there is nothing worth reporting. Under cron this
happens on any tick that lands during a build.

`kill %1` releases the lock so the next step is not blocked by the remaining
`sleep`.

**6. Cron's environment.** Every step so far ran in your interactive login
shell. Cron does not: it has `PATH=/usr/bin:/bin`, no ssh-agent, and none of
your profile. Check the two things that differ most:

```bash
env -i PATH=/usr/bin:/bin sh -c 'command -v git; command -v docker'
env -i HOME=/home/ubuntu PATH=/usr/bin:/bin SHELL=/bin/sh /home/ubuntu/bin/ktdoctor-autodeploy.sh; echo "exit=$?"
tail -2 ~/logs/ktdoctor-deploy.log
```

Expect both a `git` and a `docker` path from the first command, then `exit=0`
and one up-to-date line from the second.

A failure here means the script would pass every step above and then fail on
its first unattended run. The two likely causes:

- **`docker` prints no path.** It came from snap and lives at
  `/snap/bin/docker`, which is not on cron's `PATH`. Note that the second
  command cannot catch this on its own: with nothing new upstream the script
  exits before it ever calls docker, which is exactly why the first command is
  there. Fix it by putting `PATH=/usr/bin:/bin:/snap/bin` on its own line in
  the crontab, above the entry.
- **The script logs `fetch failed` and `Permission denied (publickey)`.**
  `origin` is an SSH remote and cron has no agent to unlock the key. Either
  give the box a passphrase-less deploy key that ssh picks up without an
  agent, or switch `origin` to HTTPS for this read-only fetch.

## Enable cron

Check what is already there before touching anything:

```bash
crontab -l
```

Add the new line alongside whatever already exists, do not replace it. This
box also runs other scheduled jobs (for example an nginx certificate reload)
that may already be entries in this same `ubuntu` crontab; coexisting cron
lines do not interact with each other, so leave existing entries as they are:

```bash
crontab -e
```

Add:

```
*/2 * * * * $HOME/bin/ktdoctor-autodeploy.sh
```

Confirm it is live, then push a trivial commit and watch it deploy unattended:

```bash
crontab -l
tail -f ~/logs/ktdoctor-deploy.log
```

## Reading the logs

```bash
tail -20 ~/logs/ktdoctor-deploy.log        # one line per run
grep -E 'ERROR|WARN' ~/logs/ktdoctor-deploy.log   # only the interesting ones
cat ~/logs/ktdoctor-deploy-build.log       # full output of the last build
```

The build log is truncated on every deploy, so it always holds the most
recent build and nothing older.

Captured git output is logged one physical line at a time, each with its own
timestamp and prefix, so a multi-line failure (an SSH rejection is three or
four lines) shows up in full under the `grep` above rather than only its first
line.

What the lines mean:

- `ok     up to date` Nothing new upstream, nothing done.
- `info   new commits upstream, deploying` A deploy has started.
- `ok     deployed <sha>` Built, swapped, and answering at
  `http://localhost:8161/`.
- `WARN   deployed <sha> but health check failed at ...` The new container is
  in place but did not answer within the timeout. Nothing was rolled back.
  Check the container itself.
- `ERROR  ...` The run stopped and the site is still on the previous version.
  The following lines carry git's or docker's own reason.
- `WARN   HEAD <sha> has never been built, container is behind` See below.

### Recovering from "has never been built"

That line means an earlier run pulled this commit and then failed to build or
swap it, so the checkout is ahead of the running container. The script will
not retry on its own, so this needs a human. Find out why first:

```bash
grep -E 'ERROR|WARN' ~/logs/ktdoctor-deploy.log | tail -20
cat ~/logs/ktdoctor-deploy-build.log
```

If the commit itself is broken, push a fix to `main`. The next tick deploys it
normally and clears the marker.

If the cause was transient (an npm registry blip, the docker daemon
restarting, a reboot mid-run), build the same commit by hand and clear the
marker yourself:

```bash
cd ~/ktdoctor
docker compose -p ktdoctor-root --env-file .env.root build
docker compose -p ktdoctor-root --env-file .env.root up -d
curl -sI http://localhost:8161/ | head -1
rm -f ~/.ktdoctor-autodeploy-unbuilt
```

## Roll back a bad deploy

Automatic deployment has no approval gate, so a commit that builds cleanly but
is wrong reaches production within two minutes. Roll back in this order and do
not skip ahead.

**1. Stop cron from redeploying it.**

```bash
crontab -e     # comment out the ktdoctor-autodeploy line
crontab -l     # confirm the line is commented out
cd ~/ktdoctor
```

Leave cron off until `main` itself is fixed. A rollback moves this checkout
behind `origin/main`, which is exactly the condition the script deploys on, so
re-enabling cron too early re-merges the bad commit within two minutes.

**2. Understand what must not be destroyed.**

This checkout carries commit `d2e21e5`, which exists only here. It is a
regenerated `package-lock.json`, and it is not on GitHub and not on any
developer machine. If a `git reset --hard` leaves it unreachable it is gone
for good, every later `docker compose build` fails at `npm ci`, and the site
can no longer be rebuilt at all: you are then stuck with whichever container
happens to be running.

So the rollback has two requirements at once. Go back to a previous good
state, **and** keep `d2e21e5` reachable from the commit you land on.

**3. Choose a target.**

Every deploy merges `origin/main` into this checkout, so the history is a
chain of merge commits and the bad code arrived in the newest of them. You
want the state this checkout was on before that merge:

```bash
git log --oneline --first-parent -10
```

That lists one entry per deploy, newest first. The top entry is the current,
bad state. The entry directly below it is the state this checkout was on
before the bad deploy, and that is your target when one bad deploy landed. If
two bad deploys landed, go one entry further down, and so on. Everything below
the `d2e21e5` line is out of bounds.

Usually that target is simply the first parent of the current merge, so this
prints it:

```bash
git rev-parse --short HEAD^
```

Cross-check against the reflog if you want to see the moves themselves:

```bash
git reflog -10
```

The top line is the `pull` that brought in the bad code, and the SHA shown on
it is where that pull landed, not where it came from. The line directly below
it is the state before the pull. Do not reuse the top line's SHA as the
target: it is the current HEAD, and resetting to it changes nothing.

**4. Prove the target is safe, before resetting.**

```bash
git merge-base --is-ancestor d2e21e5 <target> && echo "safe: local-only commit survives"
```

Run this and read the output. Only continue if it prints
`safe: local-only commit survives`.

If it prints nothing, the target you picked sits below `d2e21e5` in history
and resetting to it destroys the `package-lock.json` commit permanently. Pick
a newer target and check again. Do not run the reset until this command prints
`safe`.

**5. Reset and rebuild.**

```bash
git reset --hard <target>
docker compose -p ktdoctor-root --env-file .env.root build
docker compose -p ktdoctor-root --env-file .env.root up -d
curl -sI http://localhost:8161/ | head -1
curl -sI https://www.ktdoctor.com/ | head -1
```

**6. Fix `main`, then re-enable cron.** Once the fix is on `origin/main`,
uncomment the crontab line. The next tick pulls the fix, merges it over the
rollback, and deploys normally.

## Disable temporarily

```bash
crontab -e     # comment out the line
```

## Tests

The script has a bash test suite that runs on a developer machine against a
throwaway git fixture with stubbed `docker`, `curl`, `nice`, and `ionice`. It
never touches a real host.

```bash
bash deploy/lightsail-autodeploy.test.sh
```
