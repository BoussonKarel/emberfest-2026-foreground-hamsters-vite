import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

type Browser = 'chrome' | 'firefox';

// vite.config.mts is the single source of truth for which browser is being
// targeted; it calls this with the browser it resolved.
export const createManifest = (browser: Browser) =>
  defineManifest(() => {
    const isFirefox = browser === 'firefox';

    return {
      name: 'Vite Hamster Wacking',
      description: 'Because why make something useful',
      version: pkg.version,
      manifest_version: 3,
      action: {
        default_popup: 'index.html',
      },
      icons: {
        '16': 'icons/16.png',
        '32': 'icons/32.png',
        '48': 'icons/48.png',
        '128': 'icons/128.png',
      },
      // Firefox's MV3 background is a module-type script (no true service
      // worker support); Chrome's is a service worker. CRXJS reads whichever
      // key matches its own `browser` option and rewrites it to the built
      // loader.
      background: isFirefox
        ? { scripts: ['chrome-scripts/background.ts'], type: 'module' }
        : { service_worker: 'chrome-scripts/background.ts' },
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['chrome-scripts/hamsters.ts'],
        },
      ],
      permissions: ['storage', 'contextMenus'],
      // `key` pins a stable extension id on Chrome; Firefox doesn't
      // understand it and uses browser_specific_settings for the same
      // purpose instead.
      ...(isFirefox
        ? {
            browser_specific_settings: {
              gecko: {
                id: 'hamster-wacking@codeshare.co',
                strict_min_version: '109.0',
              },
            },
          }
        : {
            key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyP0H0KCx2rU9JqvpxSlMZDoudz6SXZxS8hv3XFXz3ZAgzUGJbo+hSB6JS/skP8Xt6B0PXAfG64HLJR0rZE88WacHte2WAFdlwedsIQgAuOZ65Lo0nztKDzlWNsf7gGpBBSSn/bGYyrfxmKEHiSUA6iTxtCR4NmRyCXQ5slPI3tirDtEzT9Fp28Lp/01Vs9V2PEfi5CEuqLJkGX5UGpPraAob3TdszxoBLiGOVg45za3HUnzxJzAC9jA7o5l31ArKAkOTQ7OmGZMNhX4JXXyDrmZCejs1vTmn2qbfKgO5T8aI5GndsD/ztAiU1X5Nf8SIw9GhyvBRsbfJdj9Ek7KXhwIDAQAB',
          }),
    };
  });
