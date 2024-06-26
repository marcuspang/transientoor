/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const SwapLazyImport = createFileRoute('/swap')()
const DysonLazyImport = createFileRoute('/dyson')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SwapLazyRoute = SwapLazyImport.update({
  path: '/swap',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/swap.lazy').then((d) => d.Route))

const DysonLazyRoute = DysonLazyImport.update({
  path: '/dyson',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/dyson.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/dyson': {
      preLoaderRoute: typeof DysonLazyImport
      parentRoute: typeof rootRoute
    }
    '/swap': {
      preLoaderRoute: typeof SwapLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AboutLazyRoute,
  DysonLazyRoute,
  SwapLazyRoute,
])

/* prettier-ignore-end */
