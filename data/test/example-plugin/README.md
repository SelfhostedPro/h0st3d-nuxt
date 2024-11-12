# Example Plugin

This is a simple example plugin that demonstrates the plugin system capabilities.

## Features

- Adds a new route at `/hello`
- Provides a reusable `HelloWorld` component
- Shows basic state management with a counter
- Uses shadcn-vue components

## Installation

To install this plugin, use the plugin manager and provide this repository URL.

## Development

```bash
# Install dependencies
bun install

# Build plugin
bun run build
```

## Structure

- `plugin.json` - Plugin manifest
- `src/index.ts` - Plugin entry point
- `src/components/` - Plugin components
- `src/pages/` - Plugin pages
