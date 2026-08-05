const fs = require("fs");
const originalWatch = fs.watch;
const rootDirs = [
  "/Users/macbook/Desktop/web/business/regis-kit-starter/apps/web",
  "/Users/macbook/Desktop/web/business/regis-kit-starter/apps/web/src",
];

fs.watch = function (path, ...args) {
  const normalizedPath =
    typeof path === "string" ? path.replace(/\/+$/, "") : path;

  if (rootDirs.some((dir) => normalizedPath === dir)) {
    console.log(`[patch-watch] skipping rootDir watch: ${path}`);
    return {
      close: () => {},
      on: () => this,
      once: () => this,
      emit: () => true,
      addListener: () => this,
      removeListener: () => this,
      removeAllListeners: () => this,
      off: () => this,
      setMaxListeners: () => this,
      getMaxListeners: () => 0,
      listeners: () => [],
      rawListeners: () => [],
      eventNames: () => [],
      listenerCount: () => 0,
    };
  }

  return originalWatch.call(fs, path, ...args);
};
