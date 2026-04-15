const appJson = require('./app.json');

/**
 * Set EXPO_WEB_BASE_PATH when the site is served from a subpath (e.g. GitHub Pages project sites).
 * Example: EXPO_WEB_BASE_PATH=/transport-connect → https://ilovelapras.github.io/transport-connect/
 * Omit for root hosting (localhost, Netlify, Vercel default domain).
 */
const basePath =
  process.env.EXPO_WEB_BASE_PATH?.trim().replace(/\/+$/, '') || '';

module.exports = {
  expo: {
    ...appJson.expo,
    experiments: {
      ...(appJson.expo.experiments || {}),
      ...(basePath ? { baseUrl: basePath } : {}),
    },
  },
};
