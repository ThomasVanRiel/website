---
title: "Chipmunk"
summary: "Open source CAM for people who own a machine and want to cut parts. A short YAML job file goes in, NC code for a Heidenhain control comes out."
date: "2026-03-20"
tags:
  - Machining
  - CLI
  - Rust
repoUrl: https://github.com/ThomasVanRiel/Chipmunk
ai:
  level: human
  usage:
    architecture: human
    code: human
    docs: assisted
---

Chipmunk is a CAM kernel with a command line as its main interface. A job file in YAML describes the tools and the operations, and Chipmunk compiles it to an NC program. Post-processors are small Lua scripts. Heidenhain conversational is the main target, with a Haas example to show how to add your own.

It is early work. Manual drilling from explicit points works from job file to NC output. Canned drill cycles, SVG and DXF import and 2.5D milling are planned. There is no simulation and no collision check, and the output has not been validated on a machine yet.

## Tips and tricks

- **Stdout is always the NC code,** diagnostics go to stderr. That makes pipes work: `chipmunk job.yaml | less` to preview, `chipmunk job.yaml | diff previous/part.H -` to see what changed.
- **Send it straight to the machine** over FTP, or over a serial port for older controls: `chipmunk job.yaml | socat - /dev/ttyUSB0,b9600,raw`.
- **Switch controller without touching the job** with `--postprocessor haas`.
- **The `manual` drill strategy** only positions in XY. Enable single block mode on the control, press cycle start for every hole and drill with the quill.
- **Leave out `name`** and the file name becomes the program name.
- **Nothing is guessed.** A missing parameter or an unknown tool is a hard error, not a silent default.
- **Stay with the machine on the first run.** The program does exactly what you asked for and nothing checks whether that was wise.
