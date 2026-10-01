---
title: "Optics playground"
summary: "An interactive 2D ray tracer for exploring how camera lenses work. Drag elements, scroll to change curvature and watch focus, aberrations and depth of field respond."
date: "2026-05-19"
tags:
  - Photography
  - Education
  - Simulation
# demoUrl:                                           (not deployed yet)
# repoUrl: https://github.com/ThomasVanRiel/optics   (private for now)
ai:
  level: vibecoded
  usage:
    architecture: human
    code: ai
    docs: ai
---

A teaching applet that traces real rays through real lens designs. Refraction uses the vector form of Snell's law at spherical surfaces. Focal length, principal planes and f-number come from the paraxial ray-transfer matrix. All dimensions are in millimetres and the view is the meridional plane.

The presets run from a single biconvex lens to a Double Gauss, a Tessar, a retrofocus wide angle, a telephoto and two zoom lenses.

## Tips and tricks

- **Scroll on a lens surface** to change its radius of curvature. Scroll on empty space to zoom around the cursor, drag empty space to pan.
- **Drag the glass** to move a whole cemented group along the axis. Drag the blue handle at the edge of a surface to resize its aperture, and the orange bar to move the stop.
- **Start with the biconvex lens** to see spherical aberration cleanly, then compare it with the plano-convex lens.
- **Switch on dispersion with the achromatic doublet** to see what the second element is for. The colour shift is synthetic and not computed from glass data.
- **Use the sensor perspective** to trace rays backwards from the sensor. It draws the focus plane and the depth of field in object space.
- **"Snap to focal plane"** puts the sensor at the back focal point, which is focus at infinity. Enter a focus distance to let the app place the sensor.
- **Locked elements are there for a reason.** In the Tessar the front three elements are locked, so only the rear group moves to refocus. In the zoom presets you solve the cam by hand.
- **Rays aim at the physical stop,** not at the entrance pupil. For fast lenses with glass in front of the stop the ray bundle is therefore slightly off.
