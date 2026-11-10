---
description: Take the linked RobinRun Sites site offline.
argument-hint: "[site id]"
skills: site-deploy
---

Use the `site-deploy` skill for this request:

$ARGUMENTS

Confirm with the user which site will go offline (name and URL from `robinrun-site status`), then run `robinrun-site offline` (with `--site <id>` if the arguments name a site). Visitors see an offline page; the domain and deployment records are kept and `/site-online` brings it back.
