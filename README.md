
# Ventra ABP Platform (Angular 20 + Signals + LeptonX)

This project contains the folder structure and foundational code for an **ABP.IO** compatible Angular application using the latest **Angular 20** features (Signals, Standalone Components) and the **LeptonX** naming conventions.

## Folder Structure

The structure is designed to follow ABP's modular architecture:

```
src/
  app/
    core/             # Core singleton services (Config, Auth, etc.)
      config/         # Configuration logic (Signal-based)
      auth/           # Authentication logic
    
    shared/           # Shared UI components and directives
      components/     # Reusable UI components (Signal inputs/outputs)
    
    layout/           # Layout definitions (LeptonX structure)
      main/           # Main Layout (Sidebar + Header wrapper)
      components/     # Layout-specific components
        header/       # LeptonX Header
        sidebar/      # LeptonX Sidebar (Collapsible)
    
    home/             # Feature module (Home page)
    
    proxy/            # ABP Generated proxies (API Services/DTOs)
      users/          # Example generated proxy
    
    identity/         # Example Feature Module
```

## Key Technologies Demonstrated

1. **Angular Signals**:
   - `AppConfigService` uses `signal()` and `computed()` for theme state.
   - `LayoutStateService` manages sidebar toggles reactively without `BehaviorSubject`.
   - Components use `input()` and `output()` helper functions (Angular 17+).

2. **LeptonX Theme Integration**:
   - Class names follow `lx-*` convention (e.g., `lx-sidebar`, `lx-header`).
   - Dark mode support baked into the configuration service.
   - Responsive sidebar with mobile overlay.

3. **Standalone Components**:
   - No `NgModule` definitions. All components are `standalone: true`.
   - Bootstrapped via `bootstrapApplication` in `main.ts`.

## Getting Started

Since this is a structural scaffold, you would typically:
1. Ensure you have Angular CLI installed.
2. Install dependencies (if this were a real repo): `npm install`.
3. Run `npm start`.

*Note: This structure assumes you will eventually integrate `@abp/ng.core` and `@abp/ng.theme.lepton-x` when you have valid license/feed access.*