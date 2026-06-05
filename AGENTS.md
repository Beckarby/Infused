# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Infused — Cocktail recipe app (Expo SDK 54, New Architecture)

## Commands
- `npm start` — dev server
- `npm run ios` / `npm run android` / `npm run web` — platform-specific start
- `npm run lint` — lint only (no typecheck script; run `npx tsc --noEmit` to typecheck)
- There are no tests.

## Architecture
- **File-based routing**: `app/` — Expo Router v6 (`typedRoutes: true`, `reactCompiler: true`)
- **State**: Zustand stores in `store/` (auth, profile, recipes, collections)
- **Theme**: `constants/theme.ts` — Colors (brown/cream palette), Fonts (Manrope body, EB Garamond headlines)
- **Mock data**: `constants/mock-recipes.ts` — initial recipes; auth is mock-only (test@test.com/password)
- **Entry**: `app/index.tsx` redirects to `/login`; root layout loads fonts and wraps a Stack navigator
- **`@/`** maps to repo root (`tsconfig.json` path alias)

## Quirks
- `expo-env.d.ts` is generated — do not edit
- `package-lock.json` and `assets/fonts/*` are gitignored
- `import 'react-native-reanimated'` must be the first import in `app/_layout.tsx`
- VS Code auto-fix + organize imports on save
