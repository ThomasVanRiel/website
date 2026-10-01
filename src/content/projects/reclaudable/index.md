---
title: "reclaudable"
summary: "Chat with Claude by handwriting on a reMarkable Paper Pro. Write a page, sync, and a typed reply appears as the next page."
date: "2026-06-23"
tags:
  - reMarkable
  - LLM
  - Python
repoUrl: https://github.com/ThomasVanRiel/reclaudable
ai:
  level: vibecoded
  usage:
    architecture: human
    code: ai
---

reclaudable turns a notebook on a reMarkable into a conversation with Claude. You write a page by hand. After the tablet syncs, a watcher on a server renders the page to an image, sends it to Claude and appends the reply as a new page. Claude reads the whole page as an image, so notes scribbled on top of its previous answer are part of the next message.

Nothing is installed on the tablet. It syncs to a self-hosted rmfakecloud, and the watcher runs Claude Code headless on a Pro subscription.

## Tips and tricks

- **Only the `Claude` folder is touched.** Put chat notebooks in a folder with that name on the tablet. The rest of the library is never read or written.
- **End with a question mark.** The tablet also syncs while you are still writing, so a page without a clear request is left alone. If no reply comes, add "?" or "go".
- **Annotate the reply.** Underline, strike through and write in the margin, then sync again. The reply column is narrow on purpose to leave room.
- **Ask for a drawing.** "Sketch this as boxes and arrows" gives a text answer plus a simple figure in real pen strokes.
- **"Email me the report"** compiles the whole conversation into a structured document and mails it to you.
- **Go the other way with `/reclaudable`.** The skill sends a summary of a Claude Code conversation to a new notebook, ready to continue on paper.
- **Expect 20 to 30 seconds per page,** more when the reply needs a web search.
- **It runs on a subscription,** so heavy use can hit the session limit. The watcher waits and finishes the turn when the limit resets.
- **You need the sync15 protocol** on both rmfakecloud and rmapi.
