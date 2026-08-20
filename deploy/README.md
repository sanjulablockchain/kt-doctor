# Automatic deployment to Lightsail

`lightsail-autodeploy.sh` redeploys www.ktdoctor.com whenever new commits
appear on `origin/main`. Cron runs it every two minutes on the Lightsail box
at `3.19.170.142` as the `ubuntu` user.

Design rationale lives in
`docs/superpowers/specs/2026-08-20-lightsail-autodeploy-design.md`.

## What it does

Fetches `origin/main`. If everything upstream is already merged, it logs one
line and exits. Otherwise it pulls, builds, swaps the container, health checks
it, and prunes unreferenced images older than 72 hours.

Every failure before the swap exits without touching the running container, so
a broken commit leaves the site on the previous version rather than breaking
it.

The image prune is host-wide, not scoped to this project. `docker image
prune -f --filter "until=72h"` looks at every image on the box, including
those belonging to the other applications it also runs (one of which is an
EHR system with real patient data). This is safe because Docker itself will
only ever remove an image that no container, running or stopped, references;
an image any application still needs cannot be pruned by this or any other
`docker image prune` call. The design doc names this host-wide scope as a
deliberate, accepted tradeoff rather than an oversight.

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
git pull --no-edit origin main
```

Then install:

```bash
mkdir -p ~/bin ~/logs
cp ~/ktdoctor/deploy/lightsail-autodeploy.sh ~/bin/ktdoctor-autodeploy.sh
chmod +x ~/bin/ktdoctor-autodeploy.sh
```

## Verify before enabling cron

Run these in order. Do not add the cron entry until all four behave as
described.

**1. No new commits.** Should log one up-to-date line, build nothing, and
restart nothing. Capture the container's state before running, so there is
something to compare against:

```bash
docker compose -p ktdoctor-root ps
```

Note the STATUS/uptime shown, then run the script and check the same thing
again:

```bash
~/bin/ktdoctor-autodeploy.sh
tail -3 ~/logs/ktdoctor-deploy.log
docker compose -p ktdoctor-root ps
```

The STATUS/uptime from the second `ps` must be unchanged from the first. If
the container looks freshly started, something rebuilt it and this step has
failed.

**2. A real new commit.** Push a trivial change to `main` from your machine,
then:

```bash
~/bin/ktdoctor-autodeploy.sh
tail -3 ~/logs/ktdoctor-deploy.log
curl -sI https://www.ktdoctor.com/ | head -1
```

Expect a `200`, and a deploy log line starting with `ok     deployed <sha>`.
A line starting with `WARN   deployed <sha>` also contains the word
"deployed" but means something different: the container was swapped in but
did not answer the health check, which is a failure worth chasing down even
though the site may still be serving.

**3. Nothing new again.** Immediately re-run. It must log up-to-date and do
nothing, which confirms change detection settles after a deploy rather than
looping.

```bash
~/bin/ktdoctor-autodeploy.sh
tail -2 ~/logs/ktdoctor-deploy.log
```

**4. The lock.** Start a run, and while it is building, start a second in
another PuTTY window. The second must exit immediately without building.

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

## Roll back a bad deploy

Automatic deployment has no approval gate, so a commit that builds cleanly but
is wrong will reach production within two minutes. To roll back, first stop
cron from immediately redeploying it:

```bash
crontab -e     # comment out the ktdoctor-autodeploy line
cd ~/ktdoctor
git log --oneline origin/main..HEAD
```

That last command lists every commit this checkout carries that `origin/main`
does not have. Do not pick a reset target without looking at this list first:
this box's checkout is known to carry at least one local-only commit,
`d2e21e5`, a regenerated `package-lock.json` that exists nowhere else, and
possibly more above it. Whatever `git log --oneline origin/main..HEAD` shows
must all survive the reset, so choose `<last-good-sha>` at or above the
newest commit in that list, never below it:

```bash
git reset --hard <last-good-sha>
docker compose -p ktdoctor-root --env-file .env.root build
docker compose -p ktdoctor-root --env-file .env.root up -d
```

Then fix the problem on `main`, and re-enable cron.

## Disable temporarily

```bash
crontab -e     # comment out the line
```

## Tests

The script has a bash test suite that runs on a developer machine against a
throwaway git fixture with stubbed `docker` and `curl`. It never touches a real
host.

```bash
bash deploy/lightsail-autodeploy.test.sh
```
