---
title: "Vogelwijzer Vlaanderen"
summary: "Where and when you can see which birds in Flanders, from 11.5 million observations, corrected for where birdwatchers actually go."
date: "2026-08-29"
tags:
  - Data science
  - Ecology
  - Web app
demoUrl: https://vogelwijzer.thomasvanriel.com
# repoUrl: https://github.com/ThomasVanRiel/vogelwijzer   (private for now)
ai:
  level: directed
  usage:
    architecture: human
    code: ai
---

Bird observations describe birdwatchers as much as birds. A species looks common where people watch and rare where they do not. Vogelwijzer models that bias out of the public Waarnemingen.be archive and shows a relative reporting rate per species, per cell of 5 by 5 km and per week of the year.

Behind the map sits a data pipeline in DuckDB, a spatial and seasonal model fitted with INLA in R, and a static SvelteKit app. The evaluation was preregistered and tested against standardised surveys that were never used for training. The site is in Dutch.

## Tips and tricks

- **Compare within one species.** A value of 2× means twice the average of that species. It supports comparing places and weeks for one bird, not comparing two birds.
- **It is not a count and not a probability.** The number is a share of bird reporting, relative to the species' own mean.
- **Hatched cells mean too little evidence,** not that the bird is absent. A place where nobody looked must not look like a place without birds.
- **Not every species gets a map.** Only species that passed the validation get a validated map. The others are marked as unvalidated or only get a seasonal curve.
- **The data stops in 2018.** The model is trained on 2008 to 2018 and says nothing about changes since.
- **Read the [method page](https://vogelwijzer.thomasvanriel.com/methode)** before drawing a conclusion from the map.
