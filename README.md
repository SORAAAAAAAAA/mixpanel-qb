# Mixpanel Query Builder

A replica of Mixpanel's user profile interface featuring advanced query building and data visualization capabilities.

## Overview

This application demonstrates a production-grade implementation of a data query and filtering system, modeled after Mixpanel's analytics platform. Built with modern web technologies and best practices, it showcases clean architecture, state management, and responsive design.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **Query Building**: react-querybuilder with JsonLogic
- **UI Components**: Radix UI primitives
- **Mock Data**: Faker.js

## Key Features

- **Advanced Query Builder**: Construct complex filters with combinators and nested rules
- **Resizable Columns**: Interactive table columns with drag-to-resize functionality
- **Dark Mode**: Optimized theme switching with zero-flash implementation
- **Type-Safe State**: Centralized state management with TypeScript interfaces
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Architecture Highlights

### State Management
- Zustand store for global application state
- Seeded mock data generation for consistent SSR/client hydration
- Automatic filter application on query changes

### Performance Optimizations
- Blocking script for instant theme application
- `disableTransitionOnChange` to prevent layout thrashing
- Memoized data generation to avoid unnecessary renders

### Component Design
- Reusable UI primitives following composition patterns
- Separation of concerns (data/presentation/logic)
- Custom hooks for cross-cutting functionality

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── query-builder/  # Query building UI
│   ├── results/        # Data table components
│   └── ui/             # Reusable UI primitives
├── stores/           # Zustand state stores
├── types/            # TypeScript type definitions
├── data/             # Mock data factories
└── lib/              # Utility functions
```

## Development Notes

- Faker is seeded (`faker.seed(12345)`) to ensure deterministic data generation
- Theme script in `<head>` prevents color flash on initial load
- Column widths use controlled state for smooth resize interactions
- JsonLogic enables complex query evaluation without custom parsers
