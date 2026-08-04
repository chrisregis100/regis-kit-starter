globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, a as toEventHandler, b as defineLazyEventHandler, c as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/assets/Badge-CIzSVOqy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2d4-In6rGIoh8hDeHviF+XCik+d57ug"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 724,
    "path": "../public/assets/Badge-CIzSVOqy.js"
  },
  "/assets/_protected-C8F__wBG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1637-u7SBXjWrKvxBRNHH99Vtm9IcllY"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 5687,
    "path": "../public/assets/_protected-C8F__wBG.js"
  },
  "/assets/app-Cm0huhpG.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"8eb9-tZcWuiN+tPEfTZXDdrKAR2ziU/Q"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 36537,
    "path": "../public/assets/app-Cm0huhpG.css"
  },
  "/assets/auth-client-BZhMcO__.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8d6d-q7ZCKPfozAQy3r7Z7EaQ2J5ENR8"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 36205,
    "path": "../public/assets/auth-client-BZhMcO__.js"
  },
  "/assets/dashboard-TWacgliR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"99a-L7clrUba64h1i0QpHz/oaVYnHJs"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 2458,
    "path": "../public/assets/dashboard-TWacgliR.js"
  },
  "/assets/billing-Cb95xeex.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6f-ezXl7Xn7PclzvFo71GF7lJlgOvw"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 2671,
    "path": "../public/assets/billing-Cb95xeex.js"
  },
  "/assets/forgot-password-ClbH_jmd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"96a-iNcUJ0PyXRUwY2Bah//1aA0D7ic"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 2410,
    "path": "../public/assets/forgot-password-ClbH_jmd.js"
  },
  "/assets/Select-QmtxTAli.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"23b5b-euZmv0RfHQVEsaTKTJ7sBlca4ig"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 146267,
    "path": "../public/assets/Select-QmtxTAli.js"
  },
  "/assets/login-BJXHizDE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc9-Z/iRckOP6ZC7S+hgqDeiqNOqPao"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 4041,
    "path": "../public/assets/login-BJXHizDE.js"
  },
  "/assets/index-I3AJGop-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"35da-91DyPKyDDPSu5GS5Gi1an3I4eOQ"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 13786,
    "path": "../public/assets/index-I3AJGop-.js"
  },
  "/assets/onboarding-rs7bosuv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"13e9-SnELOj+364VZCuT4de34SCal/ms"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 5097,
    "path": "../public/assets/onboarding-rs7bosuv.js"
  },
  "/assets/signup-CI3QLo3g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1071-CBr01H8fsHRk+Pnxzg8mqWdbk/8"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 4209,
    "path": "../public/assets/signup-CI3QLo3g.js"
  },
  "/assets/reset-password-4HdKWCOs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9ce-B2jG8frmXSXWuVa2S2MlvsGZajY"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 2510,
    "path": "../public/assets/reset-password-4HdKWCOs.js"
  },
  "/assets/settings-C4pq67NR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8d5-ARm2zYOVzxEH/vVAMX21XfmFUX4"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 2261,
    "path": "../public/assets/settings-C4pq67NR.js"
  },
  "/assets/team-CJfyatja.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1233-K9aU9MD1F/IOriHvMPF5nj8lPW0"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 4659,
    "path": "../public/assets/team-CJfyatja.js"
  },
  "/assets/index-Bm6yf8iZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"51017-KhGDUKOUdapXAhnbXOnfwej2ZLQ"',
    "mtime": "2026-08-04T15:01:50.542Z",
    "size": 331799,
    "path": "../public/assets/index-Bm6yf8iZ.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _d1Vanv = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_Rel3Dd = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_Rel3Dd };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_d1Vanv)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    middleware.push(...h3App["~middleware"]);
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
