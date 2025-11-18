// Re-export the tabs routes as the app's route configuration.
// Keeping routes in tabs/tabs.routes.ts helps organize tab structure
// while main.ts imports from this single entry point.
export { routes } from './tabs/tabs.routes';
