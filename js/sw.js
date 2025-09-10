
const CACHE = "andrewnixdorf-website";
const ASSETS = ["../","../index.html","../css/style.css","./app.js","../assets/data/site.config.json","../assets/images/stoked-logo.png","../assets/images/devreno.jpg","../assets/images/reno-gear.jpg"];

self.addEventListener("install",(e)=>{
  e.waitUntil(
    caches.open(CACHE).then(cache => 
      Promise.allSettled(ASSETS.map(asset => cache.add(asset)))
        .then(results => {
          const failed = results.filter(r => r.status === 'rejected');
          if (failed.length > 0) {
            console.warn('Some assets failed to cache:', failed);
          }
        })
    )
  );
});

self.addEventListener("activate",(e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});

self.addEventListener("fetch",(e)=>{
  e.respondWith(caches.match(e.request).then(res=>res||fetch(e.request)));
});

