/* Feltvelger: gjør at appen kan åpnes uten nett. Nett først – siste versjon brukes alltid når det er dekning. */
const C='feltvelger-app-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add(new Request(new URL('./',self.registration.scope).href,{cache:'no-store'}))).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const isPage=r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);if(!isPage)return;
 e.respondWith((async()=>{const c=await caches.open(C);const key=new Request(u.origin+u.pathname.replace(/index\.html$/,''));
  try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),8000);const res=await fetch(r,{signal:ctl.signal,cache:'no-store'});clearTimeout(t);if(res.ok)c.put(key,res.clone());return res}
  catch(err){const hit=await c.match(key);if(hit)return hit;throw err}})())});
