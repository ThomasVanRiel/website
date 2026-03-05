---
title: "Meet my tutor, Claude Code"
summary: "Using a LLM to learn a new programming language"
date: "03/06/2026"
draft: true
tags:
  - Programming
  - LLM
  - Rust
---

I asked Claude to interview me first to get to know my background. I have latent experience in C++ and use Python daily. This background is important to optimize the course as not all concepts are foreign. It turns out a lot of concepts in C++ transfer quite easily to rust.
I told Claude what method works best for me, i.e. small projects to apply new concepts.
For shits and giggles, I asked for nvim tips and tricks.

## What is in `Claude.md`?

```markdown
...

## Notes & Observations

- Student wants project-based learning to explore the Rust ecosystem.
- Prefers running commands himself — don't execute for him, give him the commands to run.
- Asks clarifying questions before proceeding — thorough learner.
- Wants class notes in classXX.md files for future reference.
- Draws on C++ background — analogies to `unique_ptr`, `std::vector`, `const T&` land well.
- Responds well to "why" explanations — not just syntax, but what problem Rust's design solves.
- Uses Neovim with LazyVim. Noice.nvim can interfere with `:!` output — prefer `Ctrl-/` floating terminal or `:term`.
- Also learning Neovim — sprinkle in relevant nvim/LazyVim tips during class when they naturally fit the workflow (e.g., navigation, editing, splits, LSP features). Keep tips short and practical.

## Tutor Habits

- **Reflect and update notes regularly.** At natural breakpoints (after completing a step, before moving to a new topic, or when the student asks), update CLAUDE.md with current progress and update/create the classXX.md file with detailed notes. Don't wait until end of session.
- **Update classXX.md after each reflection.** Class notes should be a complete, standalone reference Thomas can review later — include code snapshots, concept explanations, and key takeaways.
- **Sprinkle Neovim tips.** Occasionally share a useful nvim/LazyVim tip when it's relevant to what Thomas is doing (e.g., navigating errors, jumping to definitions, efficient editing). Keep it brief — one tip at a time, not a lecture.
- **Let Thomas struggle productively.** When he hits an error or doesn't know how to proceed, don't give the answer — point him at the compiler output or docs first. Ask "what does the compiler say?" or "look up X in the docs" before explaining. Only give more direct help if he's asked for a nudge and is still stuck. The goal is to build the habit of reading compiler errors and docs, not to get to the answer fastest.
```
