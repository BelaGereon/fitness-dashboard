# Fitness Dashboard Roadmap

Last updated: 2026-02-02

## Core Goals (from brainstorming)
1. Add storage functionality to persist data between sessions so the app no longer relies on sample data.
2. Repurpose the next chart component to display week entries (likely using the `CustomizedDataGrid`) so weeks can be sorted/filtered without bloating the UI.
3. Add a UI flow to create new week entries, then fill in data and store them.
4. Repurpose `StatCard` components to display last ~30 days of stats (e.g., dailyProtein, weightDeltaComparedToPrevWeek).
5. Identify additional, non-redundant stats that add value without cluttering the dashboard.
6. Add a goal framework (gain / maintain / diet down) and adjust graph colors/goals accordingly.
7. Add automation for data collection from providers (Fitbit, Withings, Yazio, Lyfta), pending API research.

## Prioritization Lens
- Usability first: make the app usable without sample data.
- Then improve visibility: clean weekly list and meaningful stats.
- Then intelligence & automation: goal framework and provider integrations.
