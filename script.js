'use strict';
/*
  HENRYHUB – Single-page mock storefront
  To customize product prices, titles, categories and pictures, edit PRODUCTS below.
  Images: assets/images/fuss1.png ... fuss8.png
  Discord username: @antcn (set DISCORD_USERNAME to change).
  No real payment or order backend is connected.
*/
const DISCORD_USERNAME = 'antcn';
const PRODUCTS = [
  {id:1,title:'Der Klassiker – Left Foot Edition',short:'LEFT FOOT',subtitle:'THE ORIGINAL',price:4.99,cat:'classic',views:'69.420',rating:'99 %',date:8,length:'00:42',badge:'NEW',tone:'#3a3029',accent:'#edaa57',desc:'Ein Fuß. Eine Kamera. Eine erschreckend selbstbewusste Bildkomposition. Henry nennt es Kunst. Wir nennen es Montag.'},
  {id:2,title:'Right Foot: Die Fortsetzung',short:'RIGHT FOOT',subtitle:'THE SEQUEL',price:5.99,cat:'classic',views:'42.069',rating:'98 %',date:7,length:'01:03',badge:'',tone:'#242e3b',accent:'#a0b6d1',desc:'Größer, mutiger, rechter. Kritiker sagen: „Erstaunlich symmetrisch.“ Die Fortsetzung, die sich niemand gewünscht hat.'},
  {id:3,title:'Sockenfrei – Directors Cut',short:'NO SOCKS',subtitle:'DIRECTOR’S CUT',price:9.99,cat:'premium',views:'88.888',rating:'100 %',date:6,length:'02:17',badge:'PREMIUM',tone:'#463327',accent:'#ff9000',desc:'Ungeschnitten. Ungefiltert. Unnötig dramatisch. Das Magnum Opus der internationalen Zehenfotografie.'},
  {id:4,title:'4K Close-Up: Zehe Nummer Drei',short:'ULTRA HD',subtitle:'TOE № 03',price:6.99,cat:'closeup',views:'13.337',rating:'96 %',date:5,length:'00:19',badge:'4K',tone:'#29233b',accent:'#a59bdb',desc:'So nah warst du der Wahrheit noch nie. Imaginäre 4K-Qualität. Echte Fragezeichen.'},
  {id:5,title:'Das große Socken-Geheimnis',short:'SOCKS ON',subtitle:'HIDDEN FILES',price:3.99,cat:'socks',views:'24.800',rating:'97 %',date:4,length:'00:57',badge:'',tone:'#2d3a37',accent:'#91c2a4',desc:'Was versteckt sich hinter dieser Socke? Spoiler: mit hoher Wahrscheinlichkeit ein Fuß.'},
  {id:6,title:'Mystery Pack – Überraschungszehe',short:'CLASSIFIED',subtitle:'TOP SECRET',price:7.99,cat:'mystery',views:'77.777',rating:'99 %',date:3,length:'01:11',badge:'MYSTERY',tone:'#302d30',accent:'#d9b1d5',desc:'Du weißt nicht, was du bekommst. Henry weiß es vermutlich auch nicht. Das macht die Sache spannend.'},
  {id:7,title:'Golden Hour – Abendsonne & Fuß',short:'GOLDEN HOUR',subtitle:'CINEMATIC',price:8.49,cat:'premium',views:'91.011',rating:'99 %',date:2,length:'01:42',badge:'PREMIUM',tone:'#49351e',accent:'#e7b457',desc:'Ein cineastisches Meisterwerk mit Licht, Schatten und den wirklich wichtigen Dingen im Leben.'},
  {id:8,title:'Final Boss – Beide Füße gleichzeitig',short:'FINAL BOSS',subtitle:'DOUBLE TROUBLE',price:14.99,cat:'mystery',views:'999.999',rating:'101 %',date:1,length:'03:33',badge:'HOT',tone:'#432729',accent:'#e49a8a',desc:'Zwei Füße. Ein Bild. Die größte Zusammenkunft seit Avengers: Endgame. Henry hat sich selbst übertroffen.'}
];
const CAT_NAMES = {all:'Alle',classic:'Klassiker',premium:'Premium',socks:'Socken-Content',closeup:'Nahaufnahmen',mystery:'Mystery'};
const el = id => document.getElementById(id);
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const euro = amount => amount.toLocaleString('de-AT',{style:'currency',currency:'EUR'});
function readList(key){try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v.filter(id=>Number.isInteger(id)&&PRODUCTS.some(p=>p.id===id)):[]}catch{return []}}
let cart = readList('henryhub-cart');
let favorites = readList('henryhub-favorites');
let category = 'all';
let sortBy = 'popular';
let search = '';
let favOnly = false;
let lastFocus = null;
let currentOrder = [];
function store(){try{localStorage.setItem('henryhub-cart',JSON.stringify(cart));localStorage.setItem('henryhub-favorites',JSON.stringify(favorites))}catch{/* Storage may be disabled */}}
const getProduct = id => PRODUCTS.find(p=>p.id===id);
const getCart = () => cart.map(getProduct).filter(Boolean);
const getFavorites = () => favorites.map(getProduct).filter(Boolean);
function fallbackMarkup(p){return `<div class="thumbnail-fallback" style="--tone:${p.tone};--accent:${p.accent}" aria-hidden="true"><div class="fallback-copy"><div class="fallback-num">${String(p.id).padStart(2,'0')}</div><div class="fallback-title">${p.short}</div><div class="fallback-subtitle">HENRY ORIGINAL • ${p.subtitle}</div></div></div>`}
function mediaMarkup(p,extraClass=''){
  return `${fallbackMarkup(p)}<img class="${extraClass}" alt="Vorschaubild von ${p.title}" src="assets/images/fuss${p.id}.png" loading="lazy" decoding="async">`;
}
function fixMissingImages(root){root.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>img.remove(),{once:true});if(img.complete&&!img.naturalWidth)img.remove()})}
function cardMarkup(p){
  const saved=favorites.includes(p.id),added=cart.includes(p.id);
  return `<article class="product-card" data-product="${p.id}">
    <div class="thumbnail">${mediaMarkup(p)}
      <div class="thumb-badges"><span class="thumb-badge ${p.badge==='NEW'?'is-new':p.badge==='PREMIUM'?'is-premium':''}">${p.badge||'HENRY ORIGINAL'}</span></div>
      <div class="play-overlay" aria-hidden="true"><span class="play-circle"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m7 4 14 8-14 8V4Z"/></svg></span></div>
      <span class="duration">${p.length}</span>
      <button type="button" class="thumb-open" data-action="details" data-id="${p.id}" aria-label="Details zu ${p.title} öffnen"></button>
      <button type="button" class="save-heart ${saved?'saved':''}" data-action="favorite" data-id="${p.id}" aria-label="${saved?'Aus Favoriten entfernen':'Zu Favoriten hinzufügen'}: ${p.title}" aria-pressed="${saved}"><svg viewBox="0 0 24 24" fill="none"><path d="M20.8 5.7a5 5 0 0 0-7.1 0L12 7.4l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.6l8.8-8.8a5 5 0 0 0 0-7.1Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></button>
    </div><div class="card-body"><div class="card-topline"><button class="card-title" type="button" data-action="details" data-id="${p.id}">${p.title}</button><div class="card-rating"><span>★</span> ${p.rating}</div></div><div class="card-meta"><span class="author-name">Henry Official <span class="verified" title="Vom Anbieter bestätigt">✓</span> · ${p.views} angebliche Views</span><b>${euro(p.price)}</b></div><div class="card-buy"><button class="card-btn ${added?'added':''}" type="button" data-action="cart" data-id="${p.id}">${added?'✓ Gemerkt':'+ Merken'}</button><button class="card-btn buy-now" type="button" data-action="buy" data-id="${p.id}">Anfragen ↗</button></div></div>
  </article>`;
}
function visibleProducts(){
  let list = PRODUCTS.filter(p=>(category==='all'||p.cat===category)&&(!favOnly||favorites.includes(p.id)));
  const q=search.trim().toLocaleLowerCase('de-AT');
  if(q)list=list.filter(p=>[p.title,p.short,p.subtitle,p.desc,CAT_NAMES[p.cat]].join(' ').toLocaleLowerCase('de-AT').includes(q));
  return [...list].sort((a,b)=>sortBy==='low'?a.price-b.price:sortBy==='high'?b.price-a.price:sortBy==='new'?a.date-b.date:sortBy==='title'?a.title.localeCompare(b.title,'de'):Number(b.views.replace(/\./g,''))-Number(a.views.replace(/\./g,'')));
}
function render(){
  const list=visibleProducts();const grid=el('productGrid');grid.innerHTML=list.map(cardMarkup).join('');fixMissingImages(grid);
  el('emptyState').hidden=list.length>0;
  const active=el('activeFilter');const labels=[];
  if(category!=='all')labels.push(`Kategorie: ${CAT_NAMES[category]}`);
  if(search.trim())labels.push(`Suche: „${search.trim()}“`);
  if(favOnly)labels.push('Nur Favoriten');
  active.hidden=!labels.length;
  if(labels.length)active.innerHTML=`${labels.map(s=>escapeText(s)).join(' · ')} <button id="clearActive" type="button">Zurücksetzen ×</button>`;
  $$('.category-tab').forEach(btn=>{btn.classList.toggle('active',btn.dataset.category===category);btn.setAttribute('aria-pressed',String(btn.dataset.category===category))});
  el('favButton').style.color=favOnly?'var(--orange)':'';
  el('favButton').setAttribute('aria-pressed',String(favOnly));
  updateCounts();
}
function escapeText(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function updateCounts(){el('cartCount').textContent=cart.length;el('favCount').textContent=favorites.length;el('favCount').hidden=favorites.length===0}
function resetFilters(){category='all';favOnly=false;search='';sortBy='popular';el('siteSearch').value='';el('sortSelect').value='popular';render()}
function toast(message){const container=el('toastStack');const d=document.createElement('div');d.className='toast';d.textContent=message;container.append(d);setTimeout(()=>d.remove(),3700)}
function toggleFavorite(id){if(favorites.includes(id)){favorites=favorites.filter(n=>n!==id);toast('Aus den Favoriten entfernt. Henry versteht es nicht.')}else{favorites.push(id);toast('Zu Favoriten hinzugefügt. Sehr guter Geschmack.')}store();render()}
function toggleCart(id){const p=getProduct(id);if(!p)return;if(cart.includes(id)){cart=cart.filter(n=>n!==id);toast('Aus der Merkliste entfernt.')}else{cart.push(id);toast('In der Merkliste! Henry ist stolz auf dich.')}store();render();if(!el('cartModal').hidden)renderCart()}
function modalOpen(id){lastFocus=document.activeElement;$$('.modal-backdrop').forEach(m=>m.hidden=true);el(id).hidden=false;document.body.classList.add('modal-open');el(id).querySelector('.dialog').focus()}
function modalClose(id){el(id).hidden=true;if(!$$('.modal-backdrop').some(m=>!m.hidden)){document.body.classList.remove('modal-open');lastFocus?.focus?.()}}
function closeAll(){ $$('.modal-backdrop').forEach(m=>m.hidden=true);document.body.classList.remove('modal-open');lastFocus?.focus?.() }
function detailOpen(id){const p=getProduct(id);if(!p)return;const added=cart.includes(id);
  el('productModalBody').innerHTML=`<div class="product-modal-media">${mediaMarkup(p)}<span class="duration">${p.length} · FOTO-VORSCHAU</span></div><div class="product-modal-details"><span class="dialog-kicker">HENRY ORIGINAL / ${CAT_NAMES[p.cat].toUpperCase()}</span><h2 id="modalProductTitle">${p.title}</h2><div class="modal-meta"><span><b>★</b> ${p.rating} angebliche Zufriedenheit</span><span>${p.views} angebliche Views</span><span>Henry Official <b>✓</b></span></div><p class="product-modal-desc">${p.desc}</p><div class="product-modal-bottom"><div class="modal-price"><small>PREIS PRO DIGITALBILD</small>${euro(p.price)}</div><div class="modal-buttons"><button type="button" class="button button-outline" data-action="modalCart" data-id="${p.id}">${added?'✓ Gemerkt':'+ Zur Merkliste'}</button><button type="button" class="button button-primary" data-action="buy" data-id="${p.id}">Auf Discord anfragen ↗</button></div></div></div>`;
  fixMissingImages(el('productModalBody'));modalOpen('productModal');
}
function renderCart(){const products=getCart();el('cartTitleCount').textContent=`(${products.length})`;const body=el('cartModalBody');if(!products.length){body.innerHTML=`<div class="cart-empty"><div class="cart-empty-symbol">🛒</div><h3>Noch keine Meisterwerke gesammelt.</h3><p>Deine Merkliste ist leer. Genau wie Henrys Steuerberater.</p><button type="button" class="button button-primary" data-action="continue">Galerie ansehen</button></div>`;return}
  body.innerHTML=`<div>${products.map(p=>`<div class="cart-item"><div class="cart-thumb">${mediaMarkup(p)}</div><div class="cart-info"><h3>${p.title}</h3><p>Digitalbild · <strong>${euro(p.price)}</strong></p></div><button class="cart-remove" data-action="removeCart" data-id="${p.id}" aria-label="${p.title} entfernen" title="Entfernen">×</button></div>`).join('')}</div><div class="cart-footer"><div class="cart-total"><span>Gesamt (Beispielpreise)</span><strong>${euro(products.reduce((s,p)=>s+p.price,0))}</strong></div><button class="button button-primary" data-action="orderCart">Alles bei Henry anfragen ↗</button><p>Kein automatischer Kauf. Du schreibst @${DISCORD_USERNAME} direkt auf Discord.</p></div>`;
  fixMissingImages(body);
}
function orderOpen(products){if(!products.length)return;currentOrder=products;const summary=products.map(p=>`- ${p.title} (${euro(p.price)})`).join('\n');const total=euro(products.reduce((s,p)=>s+p.price,0));el('orderMessage').value=`Servus Henry! 👋\n\nIch bin gerade auf henry-lifeetpics.store gelandet (frag nicht warum) und interessiere mich für:\n\n${summary}\n\nSumme laut Website: ${total}\n\nWie läuft das mit dem Kauf?\n\nLG, ein äußerst seriöser Kunde`;
  modalOpen('orderModal');
}
async function copyText(s){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(s);return true}}catch{/* file:// clipboard can be blocked */}const t=document.createElement('textarea');t.value=s;t.setAttribute('readonly','');t.style.cssText='position:fixed;top:-9999px';document.body.append(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch{}t.remove();return ok}
function surprise(){const chosen=PRODUCTS[Math.floor(Math.random()*PRODUCTS.length)];detailOpen(chosen.id);toast('Der Algorithmus hat entschieden. Nicht hinterfragen.')}
function trapTab(e){const modal=$$('.modal-backdrop').find(m=>!m.hidden);if(!modal||e.key!=='Tab')return;const focusable=[...modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
// Events
el('siteSearch').addEventListener('input',e=>{search=e.target.value;render()});
el('sortSelect').addEventListener('change',e=>{sortBy=e.target.value;render()});
el('topCategories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;favOnly=false;render();if(window.innerWidth<650)el('galerie').scrollIntoView({behavior:'smooth'})});
el('favButton').addEventListener('click',()=>{favOnly=!favOnly;render();el('galerie').scrollIntoView({behavior:'smooth'})});
el('cartButton').addEventListener('click',()=>{renderCart();modalOpen('cartModal')});
el('heroSurprise').addEventListener('click',surprise);
el('premiumAction').addEventListener('click',()=>{category='premium';favOnly=false;render()});
el('resetFilters').addEventListener('click',resetFilters);
el('activeFilter').addEventListener('click',e=>{if(e.target.id==='clearActive')resetFilters()});
el('mobileMenuButton').addEventListener('click',()=>{const m=el('mobileNav');m.hidden=!m.hidden;el('mobileMenuButton').setAttribute('aria-expanded',String(!m.hidden))});
el('mobileNav').addEventListener('click',e=>{if(e.target.closest('a')){el('mobileNav').hidden=true;el('mobileMenuButton').setAttribute('aria-expanded','false')}});
document.addEventListener('click',e=>{
  const close=e.target.closest('[data-close]');if(close){modalClose(close.dataset.close);return}
  if(e.target.classList.contains('modal-backdrop')){modalClose(e.target.id);return}
  const b=e.target.closest('[data-action]');if(!b)return;
  const id=Number(b.dataset.id);
  switch(b.dataset.action){case 'details':detailOpen(id);break;case 'favorite':toggleFavorite(id);break;case 'cart':toggleCart(id);break;case 'modalCart':toggleCart(id);detailOpen(id);break;case 'buy':orderOpen([getProduct(id)]);break;case 'removeCart':toggleCart(id);break;case 'orderCart':orderOpen(getCart());break;case 'continue':closeAll();el('galerie').scrollIntoView({behavior:'smooth'});break}
});
el('copyOrder').addEventListener('click',async()=>{const ok=await copyText(el('orderMessage').value);toast(ok?'Kopiert! Jetzt Discord öffnen und @antcn anschreiben.':'Bitte Nachricht markieren und mit Strg+C kopieren.');if(ok){el('copyOrder').textContent='✓ Nachricht kopiert!';setTimeout(()=>el('copyOrder').textContent='Nachricht kopieren',3000)}});
let logoClicks=0,logoTimer;
el('brandLogo').addEventListener('click',e=>{logoClicks++;clearTimeout(logoTimer);logoTimer=setTimeout(()=>logoClicks=0,1800);if(logoClicks>=5){logoClicks=0;e.preventDefault();const audio=el('secretAudio');audio.currentTime=0;audio.play().then(()=>toast('GEHEIMES AUDIO FREIGESCHALTET. Der Juden Skandal.')).catch(()=>toast('Audio konnte nicht gestartet werden.'))}});
let konami=[];const KCODE=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeAll();return}
  trapTab(e);
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  if(e.key==='/'&&!$$('.modal-backdrop').some(m=>!m.hidden)){e.preventDefault();el('siteSearch').focus();return}
  konami.push(e.key);konami=konami.slice(-KCODE.length);
  if(konami.join(',')===KCODE.join(',')){konami=[];toast('KONAMI CODE: HENRYHUB ULTRA PREMIUM FREIGESCHALTET. (War nur Spaß.)');modalOpen('introModal')}
});
el('introYes').addEventListener('click',()=>{closeAll();toast('Zugang zu 100 % dramatischen Füßen gewährt.')});
el('introNo').addEventListener('click',()=>{closeAll();toast('Zu spät. Der Algorithmus kennt dich jetzt.')});
el('footerYear').textContent=String(new Date().getFullYear());
render();
