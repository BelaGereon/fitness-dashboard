# Fitness Dashboard Roadmap

Last updated: 2026-02-10

## Current State Summary
- The dashboard is now usable as a real tracking app, not only as a static template.
- Core week data can be created, edited, persisted, viewed in a sortable grid, and exported as JSON.
- Overview cards are now driven by real app data through centralized hooks.

## Achieved Goals
1. Persistent storage is implemented.
2. Weekly data is displayed via a dedicated, sortable/filterable week grid.
3. Week creation and editing flow is implemented.
4. Stat cards were repurposed to show meaningful tracked metrics from stored data.
5. Export functionality is available to download week data as JSON.
6. Data/helper architecture has been refactored for reuse and reduced duplication.

## How We Achieved It
- Added a storage abstraction (`storage` layer + adapters) and integrated it into fitness week state management.
- Built a `FitnessWeeksDataProvider` + hooks pattern to centralize data access.
- Implemented week CRUD UI in `AddWeekDialog` / `EditWeekDialog`.
- Added a week history data grid and supporting data transformation functions.
- Added export pipeline (`download`, payload building, filename/serialization helpers).
- Refactored duplicated logic into reusable modules:
  - Shared week-day constants.
  - Shared week editor helper functions + colocated tests.
  - Shared chart gradient component.
  - Centralized metric hooks for calories/protein/steps/sets/volume.
- Updated overview cards to use real metric hooks and real date labels from data points.

## Not Yet Done
1. Goal framework (gain / maintain / cut) with target-aware visuals and guidance.
2. Provider integrations (Fitbit, Withings, Yazio, Lyfta) and sync automation.
3. Formal API/research spike for provider auth scopes, rate limits, and sync cadence.
4. Broader dashboard metric design pass to add high-signal, non-redundant insights.
5. E2E/UX-level testing for critical flows (create/edit/export/import/persistence across reloads).

## What To Take Care Of Next (Recommended Order)
1. Define and implement the goal framework domain model.
2. Add goal-aware chart overlays/colors and card context (progress vs target).
3. Introduce import flow for exported JSON backups (round-trip data safety).
4. Add E2E coverage for weekly CRUD + persistence + export/import paths.
5. Run provider integration spike and produce a concrete integration plan (MVP provider first).

## Prioritization Lens
- Keep usability first: robust local tracking experience without external integrations.
- Then improve coaching value: goals and progress interpretation.
- Then add automation: external provider sync once data model and UX are stable.
