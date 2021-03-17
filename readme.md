## Done

- Move generation of apples into game loop

## TODO

- Decouple game loop from rendering, make simulation speed adjustable
  - Show ticks per seconds
  - Show frames per seconds
- Make objects clickable
- Decouple simulation code from configuration code
  - Allow to have multiple configurations
- Evaluate https://www.createjs.com/easeljs

## Apfelernte

Environment:

- Daytime: lack of daylight decreases work speed
- Season: Only x days of harvest per year
- Rot: apples rot after x days
- Orchard: Takes a certain time to reach

Attributes

- Ambition: Higher ambition means starting work earlier and leaving for work later
- Energy Capacity

States

- Energy:
  - Decreases by doing work
  - Replenished by resting

Activity

- Rest: replenishes energy
- Work: costs energy

Decision: Group decides to switch goal

## Ants

- Research pheromones
- Pheromones:
  - Food
  - Enemies / Danger
  - Building material?
- Enemy spawner
- Random walking pattern
- How "far" can pheromones be smelled
- Somehow expand hive

## Greenification

- Grass: Spreads next to each other underground
- FLowers: Bees?
- Trees: Seeds
- Water
- How can different environments produce different plants?
