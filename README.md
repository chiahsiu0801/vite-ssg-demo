# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
# vite-ssg-demo

# Vite SSG Demo

This project demonstrates how to use Vite with Vue to build both Client-Side Rendered (CSR) and Static Site Generated (SSG) versions of the same application.

## Setup

```bash
npm install
```

## Development

### CSR Mode (Client-Side Rendering)

```bash
# Switch to CSR mode and start development server
npm run dev:csr
```

### SSG Mode (Static Site Generation)

```bash
# Switch to SSG mode and start development server
npm run dev:ssg
```

## Building

### Build for CSR

```bash
npm run build:csr
```

The output will be in the `dist-csr` directory.

### Build for SSG

```bash
npm run build:ssg
```

The output will be in the `dist-ssg` directory.

## Preview

### Preview CSR Build

```bash
npm run preview:csr
```

### Preview SSG Build

```bash
npm run preview:ssg
```

## Incremental Static Regeneration (ISR)

To run the SSG build with the server that supports ISR:

```bash
npm run isr
```

## Switching Between Modes

You can manually switch between CSR and SSG modes:

```bash
# Switch to CSR mode
npm run switch:csr

# Switch to SSG mode
npm run switch:ssg
```

## How It Works

This project uses two separate entry files:
- `src/main-csr.js` - For client-side rendering
- `src/main-ssg.js` - For static site generation

The build process uses environment variables to determine which mode to use, and the output is placed in separate directories.
