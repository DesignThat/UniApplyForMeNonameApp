import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest }
      );

      const url = new URL(request.url);
      const headers = new Headers(response.headers);

      // Hashed assets (build/assets/*) are content-addressed — cache forever.
      if (url.pathname.startsWith('/assets/')) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // index.html, manifest.json, sw.js — short TTL so updates deploy quickly.
        headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
      }

      return new Response(response.body, { status: response.status, headers });
    } catch (e) {
      if (e instanceof NotFoundError || e instanceof MethodNotAllowedError) {
        const indexRequest = new Request(new URL('/index.html', request.url).toString(), request);
        const fallback = await getAssetFromKV(
          { request: indexRequest, waitUntil: ctx.waitUntil.bind(ctx) },
          { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest }
        );
        const headers = new Headers(fallback.headers);
        headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
        return new Response(fallback.body, { status: fallback.status, headers });
      }
      return new Response('Internal Error', { status: 500 });
    }
  },
};
