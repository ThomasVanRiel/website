---
title: "AI Manifesto"
date: "10/01/2026"
---

It is evident that AI tools are here to stay, at least in programming and dev environments.
It is nonetheless very frustrating to find fully AI generated ~~slop~~ websites at the top of search engines instead of trustworthy expert written articles.
Although I'm not an expert in anything (except for wire ECM), the visible content of this website is fully written by me, although the code behind it might not be.

## What I write myself

Unless explicitly stated, AI is not used, was never used, nor will it ever be used to generate main content (i.e. information presented to the reader) for this website. The content of this website is hence guaranteed to be free of (AI-)slop.

## What I let AI build

For writing code, AI is an insanely powerful tool and I use it a lot. Large parts of the back-end of this website, the algorithms and interactive figures in the articles (such as the [cartographic projections tool](/articles/14-projections/)) and several of my [projects](/projects) are built with Claude Code as an AI agent.

I use it to implement, not to think. It is strongly steered: the idea, the decisions and the judgement of the result are mine, the typing often is not. Some tools would never have existed otherwise, because I would not have found the time to write them.

In practice I describe what I want, try what comes back and send it back until it does what I had in mind. How closely I read the code differs per project, which is what the badge below is for. A vibecoded tool does what I use it for, but I do not vouch for every line of it.

The reasoning stays with me: which question to ask, which method to use and what to conclude from the result.

## The badge on a project

Every project carries a badge that says how much AI went into it.

- **Human-written.** Architecture and code are typed by hand. AI was at most autocomplete, or helped with the documentation.
- **AI-assisted.** Written by me with an AI as pair programmer. I wrote or reviewed every part.
- **AI-built, human-directed.** I set the architecture and made the decisions. An AI agent wrote the code.
- **Vibecoded.** Built by prompting an AI agent. I judged the result, not the code.

Where it is known, the project page splits this up into architecture, code, tests and documentation.

## Models

I use the latest model of Anthropic that my subscription gives me, through Claude Code. At the time of writing (October 2026) that is **Claude Opus 5.5**.
When I run out of Claude tokens, I continue with **Codex** if I really cannot wait.

The agent does not get the run of my computer. On Linux it runs inside a [bubblewrap](https://github.com/containers/bubblewrap) sandbox: it sees the one project it is working on and nothing else of my home folder, has no SSH keys or tokens, and cannot become root.
