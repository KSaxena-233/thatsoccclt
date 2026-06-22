/* THATS OC CLT — semantic search overlay. Hits the local Ollama /search endpoint. */
(function(){
  var API="http://localhost:8799/search";
  var ICON='<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>';

  var ov=document.createElement('div'); ov.id='searchOverlay';
  ov.innerHTML='<div class="search-panel">'
    +'<div class="search-top">'+ICON+'<input id="scInput" type="text" placeholder="Describe what you want… &quot;clean pair for a date under 250&quot;" autocomplete="off"><button class="esc">ESC</button></div>'
    +'<div class="search-hint">Powered by <b>semantic search</b> — type a vibe, not just a name. Runs locally on Ollama.</div>'
    +'<div class="search-chips">'
      +'<button>clean white pair for everyday</button>'
      +'<button>something bold and colorful</button>'
      +'<button>a grail under $400</button>'
      +'<button>pink, womens</button>'
      +'<button>comfortable neutral tones</button>'
    +'</div>'
    +'<div class="search-res" id="scRes"></div></div>';
  document.body.appendChild(ov);

  var input=ov.querySelector('#scInput'), res=ov.querySelector('#scRes');
  function open(){ ov.classList.add('open'); document.documentElement.style.overflow='hidden'; setTimeout(function(){input.focus();},60); }
  function close(){ ov.classList.remove('open'); document.documentElement.style.overflow=''; }
  function money(n){ return '$'+Number(n).toLocaleString(); }

  var t;
  function run(q){
    if(!q.trim()){ res.innerHTML=''; return; }
    res.innerHTML='<div class="search-hint" style="grid-column:1/-1">searching the vault…</div>';
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q,k:8})})
      .then(function(r){return r.json();})
      .then(function(d){
        if(!d.products||!d.products.length){ res.innerHTML='<div class="search-hint" style="grid-column:1/-1">no match — try another vibe, or ask The Plug.</div>'; return; }
        res.innerHTML=d.products.map(function(p){
          return '<a class="sres" href="product.html"><div class="ph"><img src="'+p.img+'" alt=""></div>'
            +'<div class="m"><div class="bl">'+p.brand+'</div><div class="nm">'+p.name+'</div>'
            +'<div class="pr">'+money(p.price)+'</div></div></a>';
        }).join('');
      })
      .catch(function(){ res.innerHTML='<div class="search-hint" style="grid-column:1/-1">search engine offline — run: python3 ai/concierge.py</div>'; });
  }
  input.addEventListener('input',function(){ clearTimeout(t); t=setTimeout(function(){ run(input.value); },350); });
  ov.querySelector('.search-chips').addEventListener('click',function(e){ if(e.target.tagName==='BUTTON'){ input.value=e.target.textContent; run(input.value); } });
  ov.addEventListener('click',function(e){ if(e.target===ov||e.target.classList.contains('esc')) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });

  // wire any nav search trigger
  document.querySelectorAll('.navsearch, [data-search]').forEach(function(el){
    el.addEventListener('click',function(e){ e.preventDefault(); open(); });
  });
  window.openSearch=open;
})();
