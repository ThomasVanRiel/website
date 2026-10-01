---
title: "Inky dashboard"
summary: "A playful e-ink dashboard for a Raspberry Pi. Home energy and water use drawn with lightning and waves, next to the indoor climate."
date: "2026-04-16"
tags:
  - Home automation
  - Raspberry Pi
  - Python
# repoUrl: https://github.com/ThomasVanRiel/inky-dashboard   (private for now)
ai:
  level: vibecoded
  usage:
    architecture: human
    code: ai
    docs: ai
---

A dashboard for the Pimoroni Inky Impression 13.3", a six-colour e-ink panel of 1600 by 1200 pixels. It shows the electricity and water use of the last 24 hours with a hand-drawn look: lightning tendrils around the energy curve and sketched waves filling the water chart. A BME280 sensor adds temperature, humidity and pressure. A gesture sensor controls it without touching anything. For now there is one screen, the home screen.

The meter data comes from [dsmrs](/projects/dsmrs).

## Tips and tricks

- **Develop without the display.** Set `hardware = false` under `[display]` and every render is written to a PNG instead.
- **Correct the temperature.** `bme280_temperature_offset_c` adds a fixed correction to the raw reading, for example `-3.0` when the sensor reads 3 °C too high.
- **Gestures:** left and right switch screens, forward forces a refresh, backward goes home and a wave toggles sleep.
- **Pick the chart mode per chart.** `cumulative` rises to the total of the day, `rate` shows power or flow. `show_peak_labels` annotates the peaks, for water in litres per event.
- **Mounted upside down?** `rotate_180 = true` flips the image.
- **Show a picture instead.** `python -m inky_dashboard --serve` starts a small web page to upload an image and switch between dashboard and picture.
- **Two parts on the Pi.** The deployment guide runs the climate logger as a systemd service that starts at boot, and renders the dashboard from cron every 15 minutes.
