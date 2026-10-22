# expo web: `asyncRequireModule` reports "Requiring unknown module" to `ErrorUtils` before a split chunk loads

Minimal repro for an Expo issue. It's `npx create-expo-app --template blank@sdk-57` plus web dependencies, with these changes:

- [`index.js`](./index.js) installs `ErrorUtils.setGlobalHandler(...)`, the way crash reporters do. The handler logs to the console and shows a red **FATAL** banner.
- [`App.js`](./App.js) renders `React.lazy(() => import('./LazyThing'))`, so [`LazyThing.js`](./LazyThing.js) ends up in its own split chunk on web.
- [`app.json`](./app.json) sets `web.output: "single"`.

## Steps

```sh
npm install
npx expo start --web
```

Open the app in Chrome and watch the page and the DevTools console.

## Expected

`LazyThing.bundle` loads, then `LazyThing` renders. The global error handler is never called.

## Actual

`LazyThing` still renders, but first the global handler is called with `isFatal = true` and
`Error: Requiring unknown module "N"`, so the red FATAL banner appears.

The `LazyThing.bundle` request starts only after the error has been reported. Headless Chrome log from this repo:

```
[1514ms console.log]   Running application "main" ...
[1519ms console.error] [ErrorUtils global handler] {isFatal: true, message: Requiring unknown module "217". ...}
    at unknownModuleError → loadModuleImplementation → guardedLoadModule → metroRequire → metroImportAll → asyncRequireImpl
[1521ms request]       http://localhost:8081/LazyThing.bundle?platform=web&dev=true&...
```

## Cause

On web, `asyncRequireImpl` in `expo/src/async-require/asyncRequireModule.ts` first tries `importAll()` synchronously and loads the split bundle only if that throws. Because the web bundle includes React Native's `error-guard` polyfill, Metro's `guardedLoadModule` calls `ErrorUtils.reportFatalError(...)` for the missing module before the `try/catch` ever sees an error.

When the suggested fix from the issue (load first if the chunk's `<script>` isn't on the page yet) is patched into `node_modules`, the banner no longer appears and the chunk loads before the import.

## Versions

- expo 57.0.31, @expo/metro-config 57.0.13, @expo/metro-runtime 57.0.17
- react-native 0.86.3, react-native-web 0.21.4, react / react-dom 19.2.3
- Node 24.15.0, npm 11.12.1, macOS, Chrome
