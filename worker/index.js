// Cloudflare Workers Sites entry point.
// Serves the static Vite build from the KV-backed asset store,
// falling back to index.html for SPA client-side routing.
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler';

// __STATIC_CONTENT_MANIFEST is injected by wrangler at deploy time.
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (e) {
      if (e instanceof NotFoundError || e instanceof MethodNotAllowedError) {
        // SPA fallback — return index.html for any unknown path.
        const indexRequest = new Request(new URL('/index.html', request.url).toString(), request);
        return await getAssetFromKV(
          { request: indexRequest, waitUntil: ctx.waitUntil.bind(ctx) },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      }
      return new Response('Internal Error', { status: 500 });
    }
  },
};
