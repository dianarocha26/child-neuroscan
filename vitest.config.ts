import { defineConfig } from 'vitest/config';

// Standalone test config: the unit tests cover pure logic in src/lib, so they
// don't need the React plugin or the build-only sw-build-id plugin from
// vite.config.ts.
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    // Pin a non-UTC default zone so local-vs-UTC date bugs surface on CI
    // (GitHub runners are UTC). Individual tests may switch zones.
    env: { TZ: 'America/Los_Angeles' },
    restoreMocks: true,
  },
});
