import { registerRootComponent } from 'expo';

import App from './App';

// Install a global error handler, like crash reporters (Sentry, Bugsnag, ...) do.
// On web, `ErrorUtils` comes from React Native's error-guard polyfill in the bundle.
const previousHandler = global.ErrorUtils.getGlobalHandler();
global.ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('[ErrorUtils global handler]', { isFatal, message: error?.message }, error);
  if (typeof document !== 'undefined') {
    const banner = document.createElement('div');
    banner.setAttribute('data-testid', 'fatal-banner');
    banner.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:9999;padding:12px;background:#c00;color:#fff;font:14px monospace';
    banner.textContent = `FATAL (isFatal=${isFatal}): ${error?.message}`;
    document.body.appendChild(banner);
  }
  // Intentionally not calling previousHandler so the repro output stays easy to read.
  void previousHandler;
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);
