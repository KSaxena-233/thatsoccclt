/* THATS OC CLT — cart: add-to-bag, drawer, localStorage. Exposes window.addToBag(item). */
(function(){
  var KEY='oc_cart';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ return []; } }
  function save(c){ localStorage.setItem(KEY, JSON.stringify(c)); }
  var cart = load();

  // ---- drawer + toast DOM ----
  var ov=document.createElement('div'); ov.id='cartOverlay';
  ov.innerHTML='<div class="cart-drawer">'
    +'<div class="cart-hd"><h3>Your Bag</h3><button class="x" aria-label="close">×</button></div>'
    +'<div class="cart-items" id="cartItems"></div>'
    +'<div class="cart-ft"><div class="cart-tot"><span class="l">Subtotal</span><span class="v" id="cartTot">$0</span></div>'
    +'<div class="cart-note">authenticated in CLT · ship or cop at a Plaza meetup · deposit-to-hold available</div>'
    +'<button class="cart-co">Checkout · Shop Pay</button></div></div>';
  document.body.appendChild(ov);
  var toast=document.createElement('div'); toast.className='toast'; document.body.appendChild(toast);
  var tT;
  function showToast(m){ toast.textContent=m; toast.classList.add('show'); clearTimeout(tT); tT=setTimeout(function(){toast.classList.remove('show');},1700); }

  var itemsEl=ov.querySelector('#cartItems'), totEl=ov.querySelector('#cartTot');
  function money(n){ return '$'+Number(n).toLocaleString(); }
  function render(){
    var n=cart.length, sum=cart.reduce(function(a,b){return a+(+b.price||0);},0);
    document.querySelectorAll('.bag').forEach(function(b){
      b.innerHTML='BAG · <span class="bag-count">'+n+'</span>';
      b.classList.remove('pop'); void b.offsetWidth; if(n) b.classList.add('pop');
    });
    if(!n){ itemsEl.innerHTML='<div class="cart-empty">Your bag\'s empty.<br>Go find some heat.</div>'; }
    else{
      itemsEl.innerHTML=cart.map(function(it,i){
        return '<div class="citem"><div class="ph"><img src="'+it.img+'" alt=""></div>'
          +'<div class="ci"><div class="nm">'+it.name+'</div>'
          +'<div class="sub">'+(it.brand||'')+(it.size?' · US '+it.size:'')+(it.cond?' · '+it.cond:'')+'</div>'
          +'<div class="pr">'+money(it.price)+'</div></div>'
          +'<button class="rm" data-i="'+i+'">remove</button></div>';
      }).join('');
    }
    totEl.textContent=money(sum);
  }
  function openCart(){ ov.classList.add('open'); document.documentElement.style.overflow='hidden'; }
  function closeCart(){ ov.classList.remove('open'); document.documentElement.style.overflow=''; }

  window.addToBag=function(item){
    if(!item||!item.name) return;
    cart.push({name:item.name,brand:item.brand||'',price:+item.price||0,img:item.img||'',size:item.size||'',cond:item.cond||''});
    save(cart); render(); showToast('Added to bag · '+item.name);
  };

  // ---- wire static UI ----
  ov.addEventListener('click',function(e){
    if(e.target===ov||e.target.classList.contains('x')) return closeCart();
    if(e.target.classList.contains('rm')){ cart.splice(+e.target.getAttribute('data-i'),1); save(cart); render(); }
    if(e.target.classList.contains('cart-co')){
      if(!cart.length){ showToast('Bag is empty'); return; }
      location.href='checkout.html';
    }
  });
  document.querySelectorAll('.bag').forEach(function(b){ b.addEventListener('click',function(e){ e.preventDefault(); openCart(); }); });

  // ---- parse a product from a card DOM ----
  function fromCard(card){
    var img=card.querySelector('.ph img');
    if(card.classList.contains('rcard')){
      return {name:txt(card,'.nm'),brand:txt(card,'.bl'),price:num(card,'.pr'),img:img?img.getAttribute('src'):'',size:'',cond:''};
    }
    var sizeRaw=txt(card,'.size');
    return {name:txt(card,'.name'),brand:txt(card,'.brandline'),price:num(card,'.price'),img:img?img.getAttribute('src'):'',
      size:(sizeRaw.split('·')[0]||'').replace(/US/i,'').trim(),cond:(sizeRaw.split('·')[1]||'').trim()};
  }
  function txt(el,s){ var n=el.querySelector(s); return n?n.textContent.trim():''; }
  function num(el,s){ var n=el.querySelector(s); return n?parseInt(n.textContent.replace(/[^0-9]/g,''))||0:0; }

  // ---- inject quick-add buttons on cards (skip the SOLD ones) ----
  function injectQadd(){
    document.querySelectorAll('.card, .rcard').forEach(function(card){
      if(card.querySelector('.qadd')) return;
      if(card.querySelector('.pill.dead')) return;           // sold out
      var ph=card.querySelector('.ph'); if(!ph) return;
      var b=document.createElement('button'); b.className='qadd'; b.type='button'; b.textContent='+';
      b.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        addToBag(fromCard(card)); b.classList.add('added'); b.textContent='✓';
        setTimeout(function(){ b.classList.remove('added'); b.textContent='+'; },1100);
      });
      ph.appendChild(b);
    });
  }
  injectQadd();

  // ---- PDP main buy button ----
  var buy=document.querySelector('.btn-buy');
  if(buy){
    buy.addEventListener('click',function(){
      var h1=document.querySelector('.buy h1'), hero=document.getElementById('hero');
      addToBag({
        name:h1?h1.textContent.replace(/\s+/g,' ').trim():'This pair',
        brand:txt(document,'.buy .brandline'),
        price:num(document,'.priceblock .p'),
        img:hero?hero.getAttribute('src'):'',
        size:txt(document,'.sizebox .big').replace(/US/i,'').trim(), cond:'DS'
      });
      openCart();
    });
  }

  // ---- delegated: concierge widget "+ bag" buttons ----
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.plbag'); if(!b) return;
    e.preventDefault(); e.stopPropagation();
    try{ var p=JSON.parse(b.getAttribute('data-p').replace(/&#39;/g,"'"));
      addToBag({name:p.name,brand:p.brand,price:p.price,img:p.img,size:p.size_us,cond:p.condition}); }catch(err){}
    b.textContent='✓ added';
  });

  window.openCart=openCart;
  render();
})();
