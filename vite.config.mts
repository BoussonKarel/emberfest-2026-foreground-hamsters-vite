import { defineConfig, loadEnv } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { crx } from '@crxjs/vite-plugin';
import { createManifest } from './manifest.config.mts';

function isValidBrowser(browser: string): browser is 'chrome' | 'firefox' {
  return browser === 'chrome' || browser === 'firefox';
}

// Single source of truth for which browser is being targeted: everything
// else (manifest.config.mts, build.outDir, the crx() plugin) derives from
// the browser resolved here.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const browser = env['TARGET_BROWSER'] || 'chrome';

  if (!isValidBrowser(browser)) {
    throw new Error(
      `Unsupported browser "${browser}" passed via TARGET_BROWSER.`,
    );
  }

  return {
    plugins: [
      classicEmberSupport(),
      ember(),
      // extra plugins here
      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
      crx({ manifest: createManifest(browser), browser }),
    ],
    build: {
      // Separate output dirs so a chrome build and a firefox build can
      // coexist without clobbering each other.
      outDir: `dist/${browser}`,
    },
    server: {
      cors: {
        origin: [/chrome-extension:\/\//, /moz-extension:\/\//],
      },
    },
  };
});
