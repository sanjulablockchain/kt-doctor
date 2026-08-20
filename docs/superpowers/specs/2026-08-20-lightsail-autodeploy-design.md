# Automatic deployment to Lightsail on push to main

Date: 2026-08-20
Status: Approved, ready for implementation planning

## Problem

Deploying the site to production is currently a manual sequence run over PuTTY:

```
cd ~/ktdoctor
git pull --no-edit origin main
docker compose -p ktdoctor-root --env-file .env.root build
docker compose -p ktdoctor-root --env-file .env.root up -d
```

This works, but every deploy requires an SSH session and four remembered
commands. The goal is for a push to `main` on GitHub to update
www.ktdoctor.com without any manual step.

## Context

The target is the Lightsail instance at `3.19.170.142` (us-east-2), which
hosts eight applications across 27 containers. One of them is an EHR
system holding real patient data. That shared tenancy is the dominant
constraint on this design: any new mechanism must not widen the box's
attack surface.

The live site is served by the Compose project `ktdoctor-root` on port
8161, reverse-proxied by the `newsletter_nginx` container. A second
instance, project `ktdoctor` on port 8160, still serves the legacy
`/ktdoctor/` subpath and is out of scope here.

The server's checkout carries two commits that do not exist on GitHub:
`d2e21e5` (a regenerated `package-lock.json`) and the merge `7f6b586`.
Server `main` is therefore permanently ahead of `origin/main`. This is
load-bearing for the change-detection logic below.

## Decisions

Four decisions were settled before design, and the rest of the document
follows from them.

**Trigger: every push to `main`, with no test gate.** The user wants a
push to be sufficient. A commit that builds locally but fails on the
server will simply fail to deploy, leaving the previous version live.
Adding a test gate later is a small change to one script.

**Mechanism: the box polls GitHub.** Rejected alternatives were GitHub
Actions over SSH, and a self-hosted Actions runner. Both create an
execution path from GitHub into a box that hosts patient data, and the
first also requires storing a production SSH key in GitHub secrets.
Polling creates no inbound path and stores no credential anywhere: the
box only makes the outbound `git fetch` it already makes. The cost is up
to two minutes of latency and no build status in the GitHub UI, both
acceptable for a clinic marketing site.

**Failure reporting: a log file on the box.** No email, so the SMTP
credential in the app's `.env` does not spread into a second consumer.
Failure is largely self-evident anyway, because a failed deploy leaves
the site on the old version and the expected change does not appear.

**Pruning: enabled, narrowly filtered.** Repeated builds accumulate
untagged images. Pruning is the only box-wide operation in the design, so
it is filtered to unreferenced images older than 72 hours.

## Design

### Component

One shell script, invoked by cron every two minutes as the `ubuntu` user.
`ubuntu` is already in the `docker` group, so no `sudo` is required.

The canonical copy is version-controlled in this repo at
`deploy/lightsail-autodeploy.sh`. The copy cron actually runs lives at
`~/bin/ktdoctor-autodeploy.sh`, deliberately outside the checkout, so that
a deploy which updates the script cannot rewrite the file mid-execution.
Updating the script is therefore a manual copy, which is acceptable given
how rarely it should change.

### Sequence

1. Acquire an exclusive `flock`. A build takes roughly 60 seconds and the
   poll interval is 120, so overlap is unlikely but not impossible; the
   lock makes concurrent runs impossible rather than merely improbable.
2. `git fetch origin main`.
3. Determine whether upstream has new work via
   `git merge-base --is-ancestor origin/main HEAD`. If `origin/main` is
   already an ancestor of `HEAD`, there is nothing to do; log and exit.
4. `git pull --no-edit origin main`. The repo already has
   `pull.rebase=false` set locally, so no strategy flag is needed.
5. `docker compose -p ktdoctor-root --env-file .env.root build`.
6. `docker compose -p ktdoctor-root --env-file .env.root up -d`.
7. Poll `http://localhost:8161/` for HTTP 200, retrying for up to 30
   seconds to allow for container startup.
8. `docker image prune -f --filter "until=72h"`.
9. Append the outcome and the deployed SHA to the log.

### Change detection

The ancestor test in step 3 is the correct check specifically because
server `main` is ahead of `origin/main`. A direct
`HEAD != origin/main` comparison would evaluate true on every run and
trigger an endless rebuild loop. The ancestor test asks the question that
actually matters, "has upstream produced anything I have not merged," and
stays correct whether or not the local-only commits are ever pushed.

### Failure handling

Every failure that can be detected before the swap exits at step 5 or
earlier, so the running container is never touched and the site continues
serving the previous version. Only the health check runs after the swap,
and it is a report, not a gate.

- **Fetch fails** (network, GitHub outage): log and exit. The next tick
  retries.
- **Pull conflicts:** log, run `git merge --abort`, exit. The abort is
  the most important line in the script. A checkout left in a conflicted
  merge state would fail every subsequent run and require manual repair.
- **Build fails:** log and exit. The previous image is still tagged and
  the previous container is still running.
- **Health check fails after swap:** log a prominent warning. The script
  does not roll back automatically; automatic rollback needs an image tag
  scheme this design does not have, and a wrong automatic rollback is
  worse than a loud log line.

### Logging

Appended to `~/logs/ktdoctor-deploy.log`, one timestamped line per run,
including the resulting SHA on success. "Nothing to do" runs log at most
one short line so that two years of two-minute polling does not bury the
interesting entries.

### Out of scope

The `/ktdoctor` subpath instance (project `ktdoctor`, port 8160), the
nginx configuration, log rotation, and the other seven applications on the
box are all untouched.

## Testing

Verification is manual and staged, because the failure modes involve a
production host that cannot be exercised from CI.

1. Run the script by hand with nothing new upstream. Expect an
   "already up to date" log line, no build, and no container restart.
2. Run it by hand with a real new commit on `origin/main`. Expect a full
   deploy, a 200 from the health check, and a success line naming the SHA.
3. Verify the build-failure path leaves the running container alone.
4. Verify the lock by starting a second run while the first is building.
5. Only after 1 to 4 pass, install the cron entry, then push a trivial
   commit and confirm it deploys unattended within two minutes.

## Risks

**Automatic deployment with no gate.** Accepted deliberately. The
mitigating property is that failure is fail-safe: the old version keeps
serving. The unmitigated case is a commit that builds cleanly but is
wrong, which reaches production within two minutes. Rollback remains the
documented `git reset --hard` plus rebuild.

**The unpushed server commits.** `d2e21e5` exists only on this box. The
design tolerates this correctly, but the commits remain a single point of
failure for the checkout. Getting them onto GitHub is tracked separately
and is not a dependency of this work.

**Pruning is box-wide.** Filtered to unreferenced images older than 72
hours, which cannot include an image any running container depends on.
