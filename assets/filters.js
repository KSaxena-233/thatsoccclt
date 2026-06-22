/* THATS OC CLT — catalog engine: StockX-style sidebar filters + sort, brand pages, home grid. */
(function(){
  var P = new URLSearchParams(location.search);
  var BRAND_NAMES = {nike:'Nike',jordan:'Jordan',adidas:'adidas',yeezy:'Yeezy','new balance':'New Balance',
    vans:'Vans',supreme:'Supreme','denim tears':'Denim Tears',godspeed:'Godspeed','raspberry hills':'Raspberry Hills',
    canon:'Canon',converse:'Converse',timberland:'Timberland'};
  var BRAND_LOGO = {nike:'nike',jordan:'j',adidas:'adidas',yeezy:'y','new balance':'nb',vans:'v',supreme:'sup',
    'denim tears':'dt',godspeed:'gd','raspberry hills':'rsp',canon:'canon'};
  var COLORS = {black:'#141414',white:'#efefe9',cream:'#e8ddc4',pink:'#f4b6c6',red:'#c43b34',blue:'#2f5fd0',
    royal:'#1c3fa0',green:'#2f7d3a',olive:'#6c6f3a',orange:'#e2792f',grey:'#9aa0a6',gray:'#9aa0a6',wheat:'#d6b487',
    tan:'#cBA77c',brown:'#6e4b2a',volt:'#c3ee46',burgundy:'#6e2230',navy:'#1b2a4a',gold:'#c9a14a',pastel:'#d9c7e8'};

  var state = {
    brands:new Set(), models:new Set(), sizes:new Set(), colors:new Set(), conds:new Set(),
    priceMax:null, sort:'featured', q:(P.get('q')||'').toLowerCase().trim()
  };
  var preset=(P.get('brand')||'').toLowerCase().trim();
  if(preset) state.brands.add(preset);

  var catalog=[], grid, countEl, emptyEl;

  fetch('ai/catalog.json').then(function(r){return r.json();}).then(function(d){
    catalog=d.map(function(p){ p._colors=prodColors(p); return p; });
    boot();
  }).catch(function(){});

  function prodColors(p){
    var hay=((p.colorway||'')+' '+((p.tags||[]).join(' '))).toLowerCase();
    return Object.keys(COLORS).filter(function(c){ return hay.indexOf(c)>-1; });
  }
  function brandMatch(p, b){
    if((p.brand||'').toLowerCase()===b) return true;
    return ((p.brand||'')+' '+(p.model||'')+' '+(p.name||'')).toLowerCase().indexOf(b)>-1;
  }
  function passes(p){
    if(state.brands.size){ var ok=false; state.brands.forEach(function(b){ if(brandMatch(p,b)) ok=true; }); if(!ok) return false; }
    if(state.models.size && !state.models.has(p.model)) return false;
    if(state.sizes.size && !state.sizes.has(String(p.size_us))) return false;
    if(state.colors.size){ var c=false; state.colors.forEach(function(x){ if(p._colors.indexOf(x)>-1) c=true; }); if(!c) return false; }
    if(state.conds.size && !state.conds.has(p.condition)) return false;
    if(state.priceMax!=null && +p.price>state.priceMax) return false;
    if(state.q){ var h=((p.name||'')+' '+(p.brand||'')+' '+(p.colorway||'')+' '+((p.tags||[]).join(' '))).toLowerCase(); if(h.indexOf(state.q)<0) return false; }
    return true;
  }
  function sortList(a){
    a=a.slice();
    if(state.sort==='price-asc') a.sort(function(x,y){return x.price-y.price;});
    else if(state.sort==='price-desc') a.sort(function(x,y){return y.price-x.price;});
    else if(state.sort==='discount') a.sort(function(x,y){return (y.market-y.price)-(x.market-x.price);});
    else if(state.sort==='newest') a.reverse();
    return a;
  }
  function esc(s){return String(s).replace(/[&<>']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;'}[c]);});}
  function money(n){return '$'+Number(n).toLocaleString();}
  function card(p){
    var disc = p.market>p.price ? '<span class="pill last">↓ '+money(p.market-p.price)+'</span>' : '';
    var dataP = esc(JSON.stringify({name:p.name,brand:p.brand,price:p.price,img:p.img,size_us:p.size_us,condition:p.condition}));
    return '<a href="product.html" class="card"><div class="ph"><img src="assets/products/'+p.id+'.jpg" onerror="this.onerror=null;this.src=\''+p.img+'\'" alt="">'
      +'<div class="badges"><span class="pill auth">Verified</span>'+disc+'</div>'
      +'<button class="qadd" type="button" data-p=\''+dataP+'\'>+</button></div>'
      +'<div class="meta"><span class="brandline">'+esc((p.brand||'').toUpperCase())+' · '+esc((p.model||'').toUpperCase())+'</span>'
      +'<span class="name">'+esc(p.name)+'</span>'
      +'<div class="row"><span class="price">'+money(p.price)+'</span>'
      +'<div style="text-align:right"><span class="mkt">mkt <b>'+money(p.market)+'</b></span><br><span class="size">US '+esc(p.size_us)+' · '+esc(p.condition)+'</span></div></div></div></a>';
  }

  /* -------- HOME featured grid (no sidebar) -------- */
  function renderHome(el){
    el.innerHTML = catalog.slice(0,8).map(card).join('');
  }

  /* -------- COLLECTION sidebar page -------- */
  function uniq(arr){ return Array.from(new Set(arr)); }
  function count(pred){ return catalog.filter(pred).length; }

  function buildSidebar(side){
    var brandList = uniq(catalog.map(function(p){return (p.brand||'').toLowerCase();}));
    if(catalog.some(function(p){return brandMatch(p,'yeezy');})) brandList.push('yeezy');
    brandList = uniq(brandList).filter(Boolean).sort();
    var models = uniq(catalog.map(function(p){return p.model;})).sort();
    var sizes  = uniq(catalog.map(function(p){return String(p.size_us);})).sort(function(a,b){return parseFloat(a)-parseFloat(b);});
    var colors = uniq([].concat.apply([],catalog.map(function(p){return p._colors;})));
    var conds  = uniq(catalog.map(function(p){return p.condition;}));

    var h='<div class="frail-hd"><span>Filters</span><span class="clr" id="clrAll">Clear all</span></div>';
    // Brand
    h+='<div class="fgroup" data-g="brand"><div class="fhead">Brand <span class="car">▾</span></div><div class="fbody">'
      + brandList.map(function(b){
          var lg = BRAND_LOGO[b];
          var logo = lg? '<img class="blogo" src="assets/brands/'+lg+'.png" alt="">' : '';
          return '<div class="frow" data-f="brand" data-v="'+b+'"><span class="box"></span>'+logo
            +'<span class="lbl">'+esc(BRAND_NAMES[b]||b)+'</span><span class="cnt">'+count(function(p){return brandMatch(p,b);})+'</span></div>';
        }).join('') + '</div></div>';
    // Model
    h+='<div class="fgroup" data-g="model"><div class="fhead">Silhouette <span class="car">▾</span></div><div class="fbody">'
      + models.map(function(m){ return '<div class="frow" data-f="model" data-v="'+esc(m)+'"><span class="box"></span><span class="lbl">'+esc(m)+'</span><span class="cnt">'+count(function(p){return p.model===m;})+'</span></div>'; }).join('')
      + '</div></div>';
    // Size
    h+='<div class="fgroup" data-g="size"><div class="fhead">Size <span class="car">▾</span></div><div class="fbody"><div class="sizes-grid">'
      + sizes.map(function(s){ return '<div class="size-btn" data-f="size" data-v="'+s+'">'+s+'</div>'; }).join('')
      + '</div></div></div>';
    // Color
    h+='<div class="fgroup" data-g="color"><div class="fhead">Color <span class="car">▾</span></div><div class="fbody"><div class="colors">'
      + colors.map(function(c){ return '<span class="swatch" data-f="color" data-v="'+c+'" title="'+c+'" style="background:'+(COLORS[c]||'#888')+'"></span>'; }).join('')
      + '</div></div></div>';
    // Condition
    h+='<div class="fgroup" data-g="cond"><div class="fhead">Condition <span class="car">▾</span></div><div class="fbody">'
      + conds.map(function(c){ var nm=c==='DS'?'Deadstock':(c==='VNDS'?'Very Near DS':c); return '<div class="frow" data-f="cond" data-v="'+c+'"><span class="box"></span><span class="lbl">'+nm+'</span><span class="cnt">'+count(function(p){return p.condition===c;})+'</span></div>'; }).join('')
      + '</div></div>';
    // Price
    h+='<div class="fgroup" data-g="price"><div class="fhead">Price <span class="car">▾</span></div><div class="fbody price-opts">'
      + [150,250,400].map(function(v){ return '<div class="frow" data-f="price" data-v="'+v+'"><span class="box"></span><span class="lbl">Under $'+v+'</span></div>'; }).join('')
      + '</div></div>';
    side.innerHTML=h;
    syncSidebar(side);

    // interactions
    side.addEventListener('click',function(e){
      var head=e.target.closest('.fhead'); if(head){ head.parentNode.classList.toggle('collapsed'); return; }
      if(e.target.id==='clrAll'){ state.brands.clear();state.models.clear();state.sizes.clear();state.colors.clear();state.conds.clear();state.priceMax=null; sync(); return; }
      var row=e.target.closest('[data-f]'); if(!row) return;
      var f=row.dataset.f, v=row.dataset.v;
      if(f==='brand') tog(state.brands,v);
      else if(f==='model') tog(state.models,v);
      else if(f==='size') tog(state.sizes,v);
      else if(f==='color') tog(state.colors,v);
      else if(f==='cond') tog(state.conds,v);
      else if(f==='price'){ state.priceMax = (state.priceMax===+v)? null : +v; }
      sync();
    });
  }
  function tog(set,v){ if(set.has(v)) set.delete(v); else set.add(v); }
  function syncSidebar(side){
    side.querySelectorAll('[data-f]').forEach(function(el){
      var f=el.dataset.f,v=el.dataset.v,on=false;
      if(f==='brand')on=state.brands.has(v); else if(f==='model')on=state.models.has(v);
      else if(f==='size')on=state.sizes.has(v); else if(f==='color')on=state.colors.has(v);
      else if(f==='cond')on=state.conds.has(v); else if(f==='price')on=(state.priceMax===+v);
      el.classList.toggle('on',on);
    });
  }
  function appliedHTML(){
    var pills=[];
    state.brands.forEach(function(v){pills.push(['brand',v,BRAND_NAMES[v]||v]);});
    state.models.forEach(function(v){pills.push(['model',v,v]);});
    state.sizes.forEach(function(v){pills.push(['size',v,'US '+v]);});
    state.colors.forEach(function(v){pills.push(['color',v,v]);});
    state.conds.forEach(function(v){pills.push(['cond',v,v]);});
    if(state.priceMax!=null) pills.push(['price',state.priceMax,'Under $'+state.priceMax]);
    return pills.map(function(p){return '<span class="ap" data-f="'+p[0]+'" data-v="'+esc(p[1])+'">'+esc(p[2])+' <b>✕</b></span>';}).join('');
  }
  var sideRef, appliedRef;
  function sync(){
    if(sideRef) syncSidebar(sideRef);
    if(appliedRef){
      appliedRef.innerHTML=appliedHTML();
      appliedRef.querySelectorAll('.ap').forEach(function(el){ el.onclick=function(){
        var f=el.dataset.f,v=el.dataset.v;
        if(f==='brand')state.brands.delete(v); else if(f==='model')state.models.delete(v);
        else if(f==='size')state.sizes.delete(v); else if(f==='color')state.colors.delete(v);
        else if(f==='cond')state.conds.delete(v); else if(f==='price')state.priceMax=null;
        sync();
      };});
    }
    render();
  }
  function render(){
    var list=sortList(catalog.filter(passes));
    grid.innerHTML=list.map(card).join('');
    if(countEl) countEl.textContent=list.length;
    if(emptyEl) emptyEl.style.display=list.length?'none':'block';
  }

  function boot(){
    var home=document.getElementById('homeGrid');
    if(home){ renderHome(home); }
    grid=document.getElementById('catGrid'); if(!grid) return;
    countEl=document.getElementById('catCount'); emptyEl=document.getElementById('catEmpty');
    sideRef=document.getElementById('filterSidebar'); appliedRef=document.getElementById('appliedFilters');

    // title / crumb from preset brand
    var titleEl=document.getElementById('catTitle'), descEl=document.getElementById('catDesc'), crumbEl=document.getElementById('crumbBrand');
    if(preset){
      var nm=BRAND_NAMES[preset]||preset;
      if(titleEl) titleEl.textContent=nm;
      if(crumbEl) crumbEl.textContent=nm.toUpperCase();
      if(descEl) descEl.textContent='Every authenticated '+nm+' pair in the building, priced against live market.';
      document.title=nm+' · THATS OC CLT';
    }
    if(sideRef) buildSidebar(sideRef);
    var sel=document.getElementById('sortSel'); if(sel) sel.addEventListener('change',function(e){state.sort=e.target.value;render();});
    var ft=document.getElementById('filtToggle'); if(ft) ft.addEventListener('click',function(){sideRef.classList.toggle('open');});
    sync();
  }

  // dynamic add-to-bag
  document.addEventListener('click',function(e){
    var b=e.target.closest && e.target.closest('.qadd[data-p]'); if(!b) return;
    e.preventDefault(); e.stopPropagation();
    try{ var p=JSON.parse(b.getAttribute('data-p').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
      if(window.addToBag) window.addToBag({name:p.name,brand:p.brand,price:p.price,img:p.img,size:p.size_us,cond:p.condition});
      b.textContent='✓'; b.classList.add('added'); setTimeout(function(){b.textContent='+';b.classList.remove('added');},1100);
    }catch(err){}
  });
})();
