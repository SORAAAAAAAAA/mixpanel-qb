# Mixpanel Query Builder Clone

A high-fidelity replica of Mixpanel's user profile interface, built to demonstrate advanced frontend engineering practices, complex state management, and interactive data visualization.

## Overview

This project implements a robust "Users" view, allowing granular segmentation of user profiles. It features a visual query builder for creating complex filter rules and a dynamic results table for viewing and managing data. The application is designed for performance, responsiveness, and a premium user experience.

## Technology Stack

-   **Framework**: Next.js 16 (App Router)
-   **Core**: React 19, TypeScript
-   **Styling**: Tailwind CSS v4, Shadcn UI (Radix Primitives)
-   **State Management**: Zustand
-   **Query Logic**: react-querybuilder + json-logic-js
-   **Interactions**: @dnd-kit (Drag & Drop), Custom Resizable Hooks
-   **Data**: Faker.js (Deterministic Mock Data)

## Key Features

### Visual Query Builder
-   **Smart Defaults**: Selecting a property automatically pre-fills a valid value from the dataset, ensuring immediate results (no empty states).
-   **Type-Specific Editors**: Supports specific input methods for String (Text/Dropdown), Number (Input with operators), Date (Pickers), and List types.
-   **Smart Search**: Property dropdowns are searchable by name and ID.

### Dynamic Results Table
-   **Column Management**: Includes a Mixpanel-style dropdown to toggle column visibility.
-   **Reorder**: Drag and drop columns to rearrange the table layout.
-   **Resize**: Drag column borders to adjust width.
-   **Data Visualization**: Custom cell renderers for different data types (Email, Date, Country, etc.).

### Advanced Filtering
-   **Global Search**: Real-time filtering by Name, Email, or Distinct ID via the top search bar.
-   **Logic Intersection**: The table displays the intersection of Query Builder Rules AND Global Search Terms.
-   **Case-Insensitivity**: All filtering is robust and case-insensitive.

### Architecture
-   **Centralized Store (analytics-store.ts)**: Manages `allUsers`, `filteredUsers`, `query`, and `visibleColumns`. Handles data normalization and filter application efficiently.
-   **Optimized Performance**: Memoized selectors and components to prevent unnecessary re-renders.
-   **SSR Compatibility**: Handles hydration mismatches for generated data and client-only state.

## Project Structure

```
src/
├── app/                  # Next.js App Router root
├── components/
│   ├── query-builder/    # Filter UI (Dropdowns, Rule Editors)
│   ├── results/          # Table UI (Columns, Cells, Drag/Resize logic)
│   ├── ui/               # Reusable primitives (Buttons, Inputs, Sidebar)
├── stores/               # Zustand (Analytics Store)
├── hooks/                # Custom hooks (useColumnReorder, useColumnResize)
├── lib/                  # Utilities (Constants, cn helper)
└── types/                # TypeScript Interfaces
```

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Open Browser**
    Navigate to [http://localhost:3000](http://localhost:3000).

---

*Note: Data is generated deterministically using `faker.seed(12345)`, ensuring consistent results across reloads.*
