if ("serviceWorker" in navigator) {
  let registration;

  const registerServiceWorker = async () => {
    registration = await navigator.serviceWorker.register(
      "./service-worker.js"
    );
  };

  registerServiceWorker();
}

const cacheName = "my-cache";
const filestoCache = ["/", "/index.html", "/styles.css", "/client.js"];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
});
self.addEventListener("activate", (e) => self.clients.claim());
