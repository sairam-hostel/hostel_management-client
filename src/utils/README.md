# Utilities

This directory contains utility modules used throughout the application.

## Files

### `api.js`

A centralized API utility wrapper around Axios. It handles:

- Base URL configuration from environment variables.
- Request and response interceptors (if any).
- Generic methods for HTTP requests (`get`, `post`, `put`, `delete`).

### `constants.js`

Stores application-wide constants to avoid magic numbers and strings. This typically includes:

- API endpoints.
- Configuration values.
- Enums or fixed lists used in the UI.
