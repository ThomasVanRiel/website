---
title: "JoveWorks"
summary: "A node editor for dimensioning machine parts. Wire inputs, formulas and checks together on a canvas, sweep any input over a range and hand in the result as a report."
date: "2026-08-14"
highlight: "Used in a course at KU Leuven campus Group T"
tags:
  - Engineering
  - Education
  - Web app
demoUrl: https://joveworks.thomasvanriel.com
repoUrl: https://github.com/JoveWorks/joveworks
ai:
  level: vibecoded
  usage:
    architecture: ai
    code: ai
    tests: ai
    docs: ai
---

JoveWorks is a browser tool for machine-design calculations. A calculation is a graph: inputs, formulas and outputs are nodes, and the wires between them are the calculation. Formulas come from a catalogue and each one keeps its citation, its units and its valid range. The ports are typed by dimension, so a force will not connect to a length.

The point is not to compute one number. Set an input to a range and the whole graph becomes a study, plotted against the acceptance threshold. Section frames on the canvas become the sections of a report, a *NodeBook*, which is what a student hands in.

It is a static web app. There is nothing to install and no account. The name is a nod to Jupyter: Jove is another name for Jupiter.

The full manual lives at [joveworks.thomasvanriel.com/docs](https://joveworks.thomasvanriel.com/docs/).

## Tips and tricks

- **Always type the unit.** `250 kW` and `1450 rpm` are values, `250` is an error. Units are converted at the boundary and never guessed.
- **Sweep instead of solving.** JoveWorks does not rearrange formulas or iterate to a target. To find the input that gives a wanted output, set that input to a range and read where the curve crosses the threshold.
- **Use a list of standard sizes** as a range when the design has to end up on a catalogue value. Sweep two inputs to get a contour or heatmap.
- **Drag a wire onto empty canvas** and release. A search menu offers every formula and node with a compatible port.
- **Search the palette by what a formula computes.** Equation numbers, symbols and port names are all searched at once.
- **Right-click everything.** Empty canvas offers auto-arrange, which is a good first move on a tangled graph.
- **A refused connection tells you why.** Watch the status message near the edge of the canvas: dimension mismatch, or the wire would close a loop.
- **Sections end up in the report, groups do not.** Use section frames for the headings of the NodeBook and group frames to tidy the canvas.
- `Ctrl + F` finds a node on the canvas, `Ctrl + D` duplicates the selection, `Ctrl + S` saves to a file.
- **The Roloff/Matek catalogue is not part of the public site.** Students load it once from the course platform, after which it stays in the browser.
