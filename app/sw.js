/* Service worker do app Murel (PWA)
   - Telas do app: busca na rede primeiro (pega atualizações); sem internet, usa a cópia guardada.
   - Bibliotecas, fontes e modelo de placas: usa a cópia guardada (baixa só uma vez).
   - API (api.gipepark.com.br): sempre direto na rede, nunca guardada. */
var VERSAO = 'murel-202610251250';
var APP = VERSAO + '-app';
var LIBS = 'gipe-libs-v1';

var ARQUIVOS_APP = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/logo-login.webp',
  './icons/logo-login-512.png',
  './icons/favicon-32.png',
  './icons/favicon.svg'
];
var MODELO = './plate-model.onnx';

var ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
var BIBLIOTECAS = [
  ORT + 'ort.min.js',
  ORT + 'ort-wasm-simd-threaded.mjs',
  ORT + 'ort-wasm-simd-threaded.wasm',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'
];
var HOSTS_LIBS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function(e){
  e.waitUntil(Promise.all([
    caches.open(APP).then(function(c){ return c.addAll(ARQUIVOS_APP); }),
    caches.open(LIBS).then(function(c){
      // cada item é opcional: se um falhar, a instalação continua
      return Promise.allSettled([MODELO].concat(BIBLIOTECAS).map(function(u){
        return c.match(u).then(function(ja){ return ja || c.add(u); });
      }));
    })
  ]).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(nomes){
    return Promise.all(nomes.map(function(n){
      if (n !== APP && n !== LIBS) return caches.delete(n);
    }));
  }).then(function(){ return self.clients.claim(); }));
});

function redePrimeiro(req, chaveFallback){
  return new Promise(function(resolve){
    var feito = false;
    var lento = setTimeout(function(){             // rede lenta: responde com a cópia guardada
      caches.match(chaveFallback || req).then(function(r){ if (r && !feito){ feito = true; resolve(r); } });
    }, 4000);
    fetch(req).then(function(resp){
      clearTimeout(lento);
      if (resp && resp.ok){ var copia = resp.clone(); caches.open(APP).then(function(c){ c.put(chaveFallback || req, copia); }); }
      if (!feito){ feito = true; resolve(resp); }
    }).catch(function(){
      clearTimeout(lento);
      caches.match(chaveFallback || req).then(function(r){
        if (!feito){ feito = true; resolve(r || new Response('Sem conexão', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })); }
      });
    });
  });
}

function cacheEmPrimeiro(req){
  return caches.match(req).then(function(r){
    if (r) return r;
    return fetch(req).then(function(resp){
      if (resp && (resp.ok || resp.type === 'opaque')){ var copia = resp.clone(); caches.open(LIBS).then(function(c){ c.put(req, copia); }); }
      return resp;
    });
  });
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;                       // POST da API etc.: segue direto
  var url = new URL(req.url);
  if (url.hostname === 'api.gipepark.com.br') return;     // API nunca é guardada

  if (HOSTS_LIBS.indexOf(url.hostname) >= 0){ e.respondWith(cacheEmPrimeiro(req)); return; }
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('.onnx')){ e.respondWith(cacheEmPrimeiro(req)); return; }
  if (req.mode === 'navigate'){ e.respondWith(redePrimeiro(req, './index.html')); return; }
  e.respondWith(redePrimeiro(req));
});
