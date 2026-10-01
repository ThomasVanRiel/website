---
title: "dsmrs"
summary: "A small Rust daemon that reads the P1 port of a Belgian smart meter, stores every telegram in SQLite and serves the readings over a REST API."
date: "2026-04-09"
tags:
  - Home automation
  - Raspberry Pi
  - Rust
repoUrl: https://codeberg.org/thomasvanriel/dsmrs
ai:
  level: human
  usage:
    architecture: human
    code: human
    docs: assisted
  note: "\"I write my slop manually.\" The structure and the logic are thought through and typed by hand. The documentation was drafted with an LLM."
---

dsmrs is a daemon for a Raspberry Pi that listens to the P1 port of a digital electricity meter. It assembles the DSMR telegrams from the serial stream, parses them, stores the readings in SQLite and exposes them over HTTP. The meter sends one telegram per second.

It feeds my [e-ink dashboard](/projects/inky-dashboard).

## Tips and tricks

- **The P1 signal is inverted.** Configure the EEPROM of the USB to serial adapter to invert RX. The baud rate is 115200.
- **Add your user to the `dialout` group** so the daemon can open `/dev/ttyUSB0` without root. This takes effect at the next login.
- **Develop without a meter.** `mock_tty.py` replays a file of recorded telegrams over a pseudo terminal at one per second. Start it, then run `cargo run -- -p /dev/pts/<n>` with the path it prints.
- **Cross-compile for the Pi** with `cargo build --release --target aarch64-unknown-linux-gnu` instead of building on the Pi itself. The linker is set in `.cargo/config.toml`.
- **Ask only for the fields you need.** `/electricity/history?field=total_import_t1&field=total_import_t2` returns just those columns. Without `from` and `to` you get the last 24 hours. Timestamps are Unix seconds.
- **Water runs over the same port.** Set the submeter channel under `[channels]` in `dsmrs.toml` and use `/water/current` and `/water/history`.
- **Run it as a systemd service** with `Restart=on-failure` and the working directory set to the folder that holds `dsmrs.toml`. The database is created there.
