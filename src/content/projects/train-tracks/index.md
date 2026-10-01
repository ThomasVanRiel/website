---
title: "Train tracks"
summary: "An editor for wooden train track layouts that shows which pieces a randomly wandering train visits most."
date: "2026-05-28"
tags:
  - Math
  - Simulation
  - Web app
demoUrl: https://brio.thomasvanriel.com
# repoUrl: https://github.com/ThomasVanRiel/train-tracks   (private for now)
ai:
  level: vibecoded
  usage:
    architecture: human
    code: ai
---

A layout editor for wooden train tracks of the Brio and Ikea kind, with real piece dimensions in millimetres. Build a track from straights, curves, switches and crossings, then let a train loose on it. At every switch the train picks a random exit. The coloured bulge along each piece shows how much traffic it sees in the long run: wider means more often.

I built it to make the figures for an article on what makes a good train track.

## Tips and tricks

- **White circles are free ends.** Click one to make it the active end, then pick a piece from the palette at the bottom. It snaps on.
- **Shift-click selects a chain.** Click a piece, shift-click another, and everything in between is selected. `Del` removes it.
- **Use the magic connector** when two ends do not line up. Activate a free end, click "Magic" in the palette and click the other end. It bridges any gap with a smooth curve, which real pieces cannot do.
- **Mind the polarity.** Wooden track has a peg and a hole, and only opposite ends mate. "Show adapters" in the sidebar marks the places where a magic connector joins two equal ends.
- **Draw freehand.** Click the pencil and sketch a path. On release it is approximated with real pieces. Start and end near a free end to bridge the two.
- **Drag the speed slider to the maximum** for the converged result at once, instead of waiting for the train.
- **Save your layout as JSON** to continue later, and export an SVG for a clean figure.
