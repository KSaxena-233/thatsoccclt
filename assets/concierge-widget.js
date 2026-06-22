/* THATS OC CLT — "The Plug" AI concierge (premium panel).
   Drop <script src="assets/concierge-widget.js"></script> before </body>.
   Talks to the local Ollama-backed server (ai/concierge.py) on :8799. */
(function(){
  const API  = "http://localhost:8799/chat";
  const LOGO = "assets/oc-logo.png";   // brand mark (FAB)
  const AVATAR = "assets/pep.png";     // "OC" concierge mark used inside the chat

  const css = `
  .plug-fab{position:fixed;right:22px;bottom:22px;z-index:9000;display:flex;align-items:center;gap:9px;
    background:#0c1012;color:#eafcfa;border:1px solid rgba(63,200,185,.45);border-radius:40px;padding:11px 18px 11px 12px;cursor:pointer;
    font-family:'Archivo',sans-serif;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.02em;box-shadow:0 10px 34px rgba(0,0,0,.5);transition:transform .18s,box-shadow .2s}
  .plug-fab:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(20,160,150,.3)}
  .plug-fab img{width:28px;height:auto;object-fit:contain}
  .plug-fab .pdot{width:7px;height:7px;border-radius:50%;background:#3FC8B9;box-shadow:0 0 10px #3FC8B9;animation:plugp 2s infinite}
  @keyframes plugp{0%{box-shadow:0 0 0 0 rgba(63,200,185,.5)}70%{box-shadow:0 0 0 7px rgba(63,200,185,0)}100%{box-shadow:0 0 0 0 rgba(63,200,185,0)}}

  .plug-ov{position:fixed;inset:0;z-index:9001;background:rgba(4,6,7,.6);backdrop-filter:blur(6px);display:none;opacity:0;transition:opacity .22s;padding:24px}
  .plug-ov.open{display:flex;opacity:1;align-items:center;justify-content:center}
  .plug-panel{width:min(720px,100%);max-height:94vh;background:radial-gradient(120% 80% at 50% 0%,#0e1518 0%,#080b0d 60%);border:1px solid rgba(63,200,185,.22);border-radius:20px;
    box-shadow:0 40px 120px rgba(0,0,0,.7);display:flex;flex-direction:column;overflow:hidden;font-family:'Archivo','Helvetica Neue',sans-serif;color:#e8f0f0;transform:translateY(14px) scale(.99);transition:transform .25s}
  .plug-ov.open .plug-panel{transform:none}

  .plug-hd{display:flex;align-items:center;gap:13px;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.07)}
  .plug-hd .lg{width:46px;height:46px;border-radius:12px;background:#0a0d0f;border:1px solid rgba(63,200,185,.3);display:grid;place-items:center;flex:0 0 auto;overflow:hidden}
  .plug-hd .lg img{width:34px;height:auto;object-fit:contain}
  .plug-hd .nm{font-family:'Archivo',sans-serif;font-weight:800;font-size:21px;letter-spacing:.18em;text-transform:uppercase;line-height:1;color:#fff}
  .plug-hd .st{display:flex;gap:16px;margin-top:6px;font-family:'Archivo',sans-serif;font-weight:600;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#7fb8b2}
  .plug-hd .st i{font-style:normal;display:inline-flex;align-items:center;gap:5px}
  .plug-hd .st i::before{content:"";width:6px;height:6px;border-radius:50%;background:#3FC8B9;box-shadow:0 0 7px #3FC8B9}
  .plug-hd .x{margin-left:auto;width:40px;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,.12);background:none;color:#cfe;cursor:pointer;font-size:18px;flex:0 0 auto;transition:background .2s}
  .plug-hd .x:hover{background:rgba(255,255,255,.06)}

  .plug-body{flex:1;overflow-y:auto;padding:22px;scrollbar-width:thin}
  .plug-body::-webkit-scrollbar{width:7px}.plug-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:4px}

  .pi-hero{display:grid;grid-template-columns:1fr .82fr;gap:18px;align-items:center;margin-bottom:26px}
  @media(max-width:560px){.pi-hero{grid-template-columns:1fr}}
  .pi-hero h2{font-family:'Archivo',sans-serif;font-weight:900;font-size:clamp(26px,4.4vw,38px);line-height:.98;letter-spacing:-.02em;text-transform:uppercase;color:#fff}
  .pi-hero h2 em{font-style:normal;color:#3FC8B9}
  .pi-hero p{color:#9fb4b2;font-size:14px;margin-top:14px;line-height:1.55;font-weight:500}
  .pi-case{position:relative;border-radius:14px;overflow:hidden;aspect-ratio:1/.92;background:radial-gradient(80% 60% at 50% 0%,#1b2a2e,#070a0b);border:1px solid rgba(255,255,255,.08)}
  .pi-case::before{content:"";position:absolute;top:0;left:15%;right:15%;height:3px;background:linear-gradient(90deg,transparent,rgba(140,230,220,.7),transparent);filter:blur(1px)}
  .pi-case img{width:100%;height:100%;object-fit:cover;mix-blend-mode:screen;opacity:.96}
  .pi-case .wm{position:absolute;top:16px;left:18px;font-family:'Archivo',sans-serif;font-weight:900;font-size:24px;letter-spacing:.06em;color:rgba(140,200,195,.16);text-transform:uppercase;line-height:.9}
  .pi-case .auth{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-family:'Archivo',sans-serif;font-weight:700;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#3FC8B9;background:rgba(8,18,18,.8);border:1px solid rgba(63,200,185,.4);border-radius:30px;padding:5px 12px;white-space:nowrap}

  .pi-sec-l{display:flex;align-items:center;gap:8px;font-family:'Archivo',sans-serif;font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8fa9a6;margin:0 0 12px}
  .pi-sec-l svg{width:14px;height:14px;stroke:#3FC8B9;fill:none;stroke-width:1.6}
  .pi-sec-l .sp{margin-left:auto;color:#3FC8B9;display:inline-flex;align-items:center;gap:6px}
  .pi-sec-l .sp svg{stroke:#3FC8B9}

  .pi-ask{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:26px}
  @media(max-width:560px){.pi-ask{grid-template-columns:1fr}}
  .pi-card{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;cursor:pointer;transition:border-color .18s,background .18s;text-align:left}
  .pi-card:hover{border-color:rgba(63,200,185,.5);background:rgba(63,200,185,.06)}
  .pi-card .ci{width:34px;height:34px;border-radius:9px;border:1px solid rgba(63,200,185,.3);display:grid;place-items:center;flex:0 0 auto;color:#3FC8B9}
  .pi-card .ci svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.6}
  .pi-card span{font-size:13px;color:#dfeae9;font-weight:500;line-height:1.3}

  .pi-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
  .pi-fil{font-family:'Archivo',sans-serif;font-weight:600;font-size:12px;color:#cfe0de;background:none;border:1px solid rgba(255,255,255,.14);border-radius:30px;padding:9px 16px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .18s}
  .pi-fil:hover,.pi-fil.on{border-color:#3FC8B9;color:#3FC8B9}
  .pi-fil svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:1.6}

  .pi-picks{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  @media(max-width:560px){.pi-picks{grid-template-columns:1fr 1fr}}
  .pp{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;cursor:pointer;transition:border-color .18s}
  .pp:hover{border-color:rgba(63,200,185,.4)}
  .pp .ph{position:relative;aspect-ratio:1/1;background:#11181a}
  .pp .ph img{width:100%;height:100%;object-fit:cover}
  .pp .hrt{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:rgba(8,12,14,.6);border:1px solid rgba(255,255,255,.18);display:grid;place-items:center;color:#cfe;font-size:12px}
  .pp .m{padding:11px}
  .pp .nm{font-family:'Archivo',sans-serif;font-weight:700;font-size:13px;color:#fff;line-height:1.2}
  .pp .cw{font-size:11px;color:#90a5a3;margin-top:2px}
  .pp .pr{font-family:'Archivo',sans-serif;font-weight:800;font-size:16px;color:#3FC8B9;margin-top:7px}
  .pp .sub{font-size:10px;color:#7d918f;margin-top:2px}
  .pp .au{font-family:'Archivo',sans-serif;font-weight:600;font-size:9px;letter-spacing:.04em;text-transform:uppercase;color:#3FC8B9;margin-top:7px;display:inline-flex;align-items:center;gap:4px}

  .pl-row{display:flex;gap:10px;align-items:flex-start;max-width:88%;margin-bottom:14px}
  .pl-row.me{margin-left:auto;flex-direction:row-reverse}
  .pl-av{width:30px;height:30px;border-radius:9px;flex:0 0 auto;overflow:hidden;background:#0a0d0f;border:1px solid rgba(63,200,185,.25)}
  .pl-av img{width:100%;height:100%;object-fit:contain}
  .pl-av.me{background:#3FC8B9;border:none;display:grid;place-items:center;color:#04100e;font-family:'Archivo',sans-serif;font-weight:800;font-size:10px}
  .pl-b{padding:12px 14px;border-radius:13px;font-size:14px;line-height:1.55}
  .pl-row.bot .pl-b{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-top-left-radius:4px;color:#e8f0f0}
  .pl-row.me .pl-b{background:#3FC8B9;color:#04100e;border-top-right-radius:4px;font-weight:600}
  .pl-cards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
  .pl-card{display:flex;gap:9px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px;transition:border-color .15s}
  .pl-card:hover{border-color:rgba(63,200,185,.4)}
  .pl-card .ph{width:50px;height:50px;border-radius:7px;overflow:hidden;flex:0 0 auto;background:#11181a}.pl-card .ph img{width:100%;height:100%;object-fit:cover}
  .pl-card .nm{font-family:'Archivo',sans-serif;font-weight:700;font-size:11px;color:#fff;line-height:1.15}
  .pl-card .pr{font-family:'Archivo',sans-serif;font-weight:800;font-size:13px;color:#3FC8B9;margin-top:3px}
  .pl-card .plbag{margin-top:5px;font-family:'Archivo',sans-serif;font-weight:700;font-size:9px;text-transform:uppercase;border:none;background:#3FC8B9;color:#04100e;border-radius:20px;padding:4px 9px;cursor:pointer}
  .pl-typing{display:flex;gap:4px;padding:13px}
  .pl-typing span{width:7px;height:7px;border-radius:50%;background:#3FC8B9;opacity:.4;animation:plb 1.1s infinite}
  .pl-typing span:nth-child(2){animation-delay:.2s}.pl-typing span:nth-child(3){animation-delay:.4s}
  @keyframes plb{30%{opacity:1;transform:translateY(-3px)}}

  .plug-ft{flex:0 0 auto;padding:16px 20px 18px;border-top:1px solid rgba(255,255,255,.07);background:rgba(6,10,11,.6)}
  .pf-in{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid rgba(63,200,185,.3);border-radius:14px;padding:8px 8px 8px 14px}
  .pf-in .spark{color:#3FC8B9;flex:0 0 auto;display:inline-flex}.pf-in .spark svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.6}
  .pf-in input{flex:1;background:none;border:none;outline:none;color:#eef;font-family:'Helvetica Neue',sans-serif;font-size:14px}
  .pf-in input::placeholder{color:#6f8482}
  .pf-send{width:46px;height:40px;border:none;border-radius:11px;background:#3FC8B9;color:#04100e;cursor:pointer;flex:0 0 auto;transition:filter .15s;display:grid;place-items:center}.pf-send:hover{filter:brightness(1.1)}
  .pf-send svg{width:20px;height:20px;stroke:#04100e;fill:none;stroke-width:2}
  .pf-tools{display:flex;align-items:center;gap:16px;margin-top:11px}
  .pf-tools button{display:inline-flex;align-items:center;gap:7px;background:none;border:none;color:#90a5a3;font-family:'Archivo',sans-serif;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.03em;cursor:pointer}
  .pf-tools button:hover{color:#cfe}.pf-tools button svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.6}
  .pf-tools .clr{margin-left:auto}
  .pf-trust{display:flex;justify-content:center;gap:22px;margin-top:14px;flex-wrap:wrap}
  .pf-trust i{font-style:normal;display:inline-flex;align-items:center;gap:6px;font-family:'Archivo',sans-serif;font-weight:600;font-size:9.5px;letter-spacing:.04em;text-transform:uppercase;color:#6f8482}
  .pf-trust i svg{width:13px;height:13px;stroke:#3FC8B9;fill:none;stroke-width:1.6}
  @media(max-width:560px){.pf-trust{gap:14px}}`;

  const ICONS = {
    search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>',
    gift:'<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M12 8s-1-5-4-5-2 5 4 5zM12 8s1-5 4-5 2 5-4 5z"/></svg>',
    tag:'<svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9-9 9z"/><circle cx="9" cy="9" r="1.3"/></svg>',
    ticket:'<svg viewBox="0 0 24 24"><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/></svg>',
    pin:'<svg viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    spark:'<svg viewBox="0 0 24 24"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/></svg>',
    cam:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.3"/><path d="M8 7l1.5-2h5L16 7"/></svg>',
    mic:'<svg viewBox="0 0 24 24"><path d="M5 11v1a7 7 0 0014 0v-1M12 19v3"/><rect x="9" y="3" width="6" height="11" rx="3"/></svg>',
    clr:'<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 10-2.3 5.7M20 5v5h-5"/></svg>',
    shield:'<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
    check:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>',
    arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  let catalog = [];
  fetch('ai/catalog.json').then(r=>r.json()).then(d=>{ catalog=d; renderPicks(); }).catch(()=>{});

  const fab = document.createElement('button');
  fab.className = 'plug-fab';
  fab.innerHTML = `<img src="${LOGO}" alt=""><span class="pdot"></span> Ask The Plug`;
  document.body.appendChild(fab);

  const ov = document.createElement('div');
  ov.className = 'plug-ov';
  ov.innerHTML = `
    <div class="plug-panel">
      <div class="plug-hd">
        <div class="lg"><img src="${AVATAR}" alt=""></div>
        <div><div class="nm">OC · The Plug</div><div class="st"><i>AI Concierge</i><i>Live Authenticated Inventory</i></div></div>
        <button class="x" aria-label="close">×</button>
      </div>
      <div class="plug-body" id="plugBody">
        <div id="plugIntro">
          <div class="pi-hero">
            <div>
              <h2>How can I<br><em>hook you up?</em></h2>
              <p>Tell me your vibe, budget, size, or occasion. I'll pull the best authenticated heat we've got.</p>
            </div>
            <div class="pi-case"><div class="wm">OC<br>CLT</div><img src="assets/sn_157811.jpg" alt=""><span class="auth">✓ Authenticated</span></div>
          </div>
          <div class="pi-sec-l">${ICONS.spark} Try asking</div>
          <div class="pi-ask">
            <button class="pi-card" data-q="Clean white pair under $200"><span class="ci">${ICONS.search}</span><span>Clean white pair under $200</span></button>
            <button class="pi-card" data-q="A Jordan for a birthday gift"><span class="ci">${ICONS.gift}</span><span>Jordan for a birthday gift</span></button>
            <button class="pi-card" data-q="Size 8, pink or silver"><span class="ci">${ICONS.tag}</span><span>Size 8, pink or silver</span></button>
            <button class="pi-card" data-q="Need something for a concert"><span class="ci">${ICONS.ticket}</span><span>Need something for a concert</span></button>
          </div>
          <div class="pi-sec-l">${ICONS.tag} Quick filters</div>
          <div class="pi-filters">
            <button class="pi-fil" data-q="clean pairs under $200">Under $200</button>
            <button class="pi-fil" data-q="size 8">Size 8</button>
            <button class="pi-fil" data-q="a clean white pair">White pair</button>
            <button class="pi-fil" data-q="something bold for going out">Going-out</button>
            <button class="pi-fil" data-q="a clean low-top">Low-top</button>
            <button class="pi-fil" data-q="something I can cop at a Plaza meetup">${ICONS.pin} Local pickup</button>
          </div>
          <div class="pi-sec-l">Live picks for you<span class="sp">● Live inventory ${ICONS.arrow}</span></div>
          <div class="pi-picks" id="plugPicks"></div>
        </div>
      </div>
      <div class="plug-ft">
        <div class="pf-in">
          <span class="spark">${ICONS.spark}</span>
          <input type="text" placeholder="Ask The Plug about style, budget, size, or occasion…" autocomplete="off">
          <button class="pf-send" aria-label="send">${ICONS.arrow}</button>
        </div>
        <div class="pf-tools">
          <button>${ICONS.cam} Upload a photo</button>
          <button>${ICONS.mic} Send voice</button>
          <button class="clr" id="plugClear">${ICONS.clr} Clear chat</button>
        </div>
        <div class="pf-trust">
          <i>${ICONS.shield} Grounded in live authenticated stock</i>
          <i>${ICONS.lock} Runs locally</i>
          <i>${ICONS.check} No data leaves the shop</i>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const body  = ov.querySelector('#plugBody');
  const intro = ov.querySelector('#plugIntro');
  const input = ov.querySelector('.pf-in input');
  const sendB = ov.querySelector('.pf-send');
  const picksEl = ov.querySelector('#plugPicks');
  let history = [], busy = false, chatStarted = false;

  const esc = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const money = n => '$'+Number(n).toLocaleString();
  const bottom = () => body.scrollTop = body.scrollHeight;
  function open(){ ov.classList.add('open'); fab.style.display='none'; document.documentElement.style.overflow='hidden'; setTimeout(()=>input.focus(),80); }
  function close(){ ov.classList.remove('open'); fab.style.display='flex'; document.documentElement.style.overflow=''; }
  fab.onclick = open;
  ov.querySelector('.x').onclick = close;
  ov.addEventListener('click', e=>{ if(e.target===ov) close(); });

  function renderPicks(){
    if(!picksEl||!catalog.length) return;
    picksEl.innerHTML = catalog.slice(0,3).map(p=>`
      <div class="pp" data-q="show me the ${esc(p.name)}">
        <div class="ph"><img src="${p.img}" alt=""><span class="hrt">♡</span></div>
        <div class="m"><div class="nm">${esc(p.name)}</div><div class="cw">${esc(p.colorway||'')}</div>
        <div class="pr">${money(p.price)}</div><div class="sub">Size ${esc(p.size_us)} · ${esc(p.condition)}</div>
        <div class="au">✓ Authenticated</div></div>
      </div>`).join('');
  }

  function startChat(){ if(chatStarted) return; intro.style.display='none'; chatStarted=true; }
  function addUser(t){ startChat(); const r=document.createElement('div'); r.className='pl-row me';
    r.innerHTML=`<div class="pl-av me">YO</div><div class="pl-b">${esc(t)}</div>`; body.appendChild(r); bottom(); }
  function addTyping(){ const r=document.createElement('div'); r.className='pl-row bot'; r.id='plugTyping';
    r.innerHTML=`<div class="pl-av"><img src="${AVATAR}"></div><div class="pl-b" style="padding:0"><div class="pl-typing"><span></span><span></span><span></span></div></div>`; body.appendChild(r); bottom(); }
  function cards(ps){ if(!ps||!ps.length) return '';
    return `<div class="pl-cards">`+ps.map(p=>`<a class="pl-card" href="product.html">
      <div class="ph"><img src="${p.img}" alt=""></div>
      <div><div class="nm">${esc(p.name)}</div><div class="pr">${money(p.price)}</div>
      <button class="plbag" data-p='${JSON.stringify(p).replace(/'/g,"&#39;")}'>+ bag</button></div></a>`).join('')+`</div>`; }
  function addBot(t,ps){ const r=document.createElement('div'); r.className='pl-row bot';
    r.innerHTML=`<div class="pl-av"><img src="${AVATAR}"></div><div class="pl-b">${esc(t)}${cards(ps)}</div>`; body.appendChild(r); bottom(); }

  async function ask(t){
    if(busy||!t.trim()) return; busy=true;
    addUser(t); input.value=''; addTyping();
    try{
      const res = await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,history})});
      const d = await res.json();
      document.getElementById('plugTyping')?.remove();
      if(d.error){ addBot("The concierge engine isn't reachable — start it with: python3 ai/concierge.py",[]); }
      else{ addBot(d.reply,d.products); history.push({role:'user',content:t}); history.push({role:'assistant',content:d.reply}); }
    }catch(e){ document.getElementById('plugTyping')?.remove(); addBot("Couldn't reach The Plug. Run the local server: python3 ai/concierge.py (needs Ollama up).",[]); }
    busy=false; input.focus();
  }

  sendB.onclick=()=>ask(input.value);
  input.onkeydown=e=>{ if(e.key==='Enter') ask(input.value); };
  ov.addEventListener('click', e=>{
    if(e.target.closest('.plbag')) return;   // cart.js handles add-to-bag (avoid double-add)
    var q=e.target.closest('[data-q]'); if(q){ ask(q.getAttribute('data-q')); }
  });
  ov.querySelector('#plugClear').onclick=()=>{ history=[]; body.querySelectorAll('.pl-row').forEach(n=>n.remove()); intro.style.display=''; chatStarted=false; bottom(); };

  window.openPlug = open;
  window.askPlug  = t=>{ open(); ask(t); };
})();
