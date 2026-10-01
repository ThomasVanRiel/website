---
title: "mekasim"
summary: "Explore planar mechanisms in the browser. Describe linkages, cranks, gears and cams in YAML or draw them, then watch the exact motion and measure it."
date: "2026-10-01"
tags:
  - Engineering
  - Simulation
  - Web app
demoUrl: https://mekasim.netlify.app
# repoUrl: https://github.com/ThomasVanRiel/mekasim   (private for now)
ai:
  level: vibecoded
  usage:
    architecture: ai
    code: ai
    tests: ai
    docs: ai
---

mekasim solves the motion of planar mechanisms: four-bars, slider-cranks, walking linkages, valve gear. A model is one YAML file with bodies, joints and a driver. The app shows it moving in 2D and 3D next to its source, and computes what you ask for: a stroke, a swing angle, the speed of a point over the cycle.

The text and the drawing are two views of the same model. Edit the YAML and the drawing follows. Work on the drawing and the change is written into the text in place, with its comments and layout intact.

## Tips and tricks

- **Start from an example.** The menu in the header loads working models, from a four-bar to a Strandbeest leg.
- **Learn the tool keys:** `V` select, `L` link, `C` crank, `O` rod, `P` pin, `S` slot, `G` gear, `A` cam, `M` motor, `T` trace, `R` reshape, `D` measure.
- `Space` plays and pauses, the arrow keys step through the cycle, `Ctrl + Z` undoes.
- **Share a model with "Copy link".** The whole model is packed into the link, so there is nothing to upload.
- **Rename by typing.** Put the cursor on a name where it is defined. Every use is marked, and what you type goes into all of them.
- **Plot a point or a link** by selecting it: position, speed, acceleration or angle over the cycle. "Export CSV" saves the motion as a table.
- **"Compare values" on a parameter** solves the model for several values and draws them together.
- **"Trace over a picture"** lays an image under the drawing, which helps to rebuild a mechanism from a photo or a figure in a book.
- **"Parts to make"** turns the links into flat pieces: a DXF to laser cut or an STL to print.
- **A typo is an error.** Unknown keys in the YAML are reported instead of ignored.
