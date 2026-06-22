/* THATS OC CLT — floating "Ask The Plug" concierge widget.
   Drop <script src="assets/concierge-widget.js"></script> before </body>.
   Talks to the local Ollama-backed server (ai/concierge.py) on :8799. */
(function(){
  const API = "http://localhost:8799/chat";
  const LOGO = "assets/oc-logo.png";

  const css = `
  .plug-fab{position:fixed;right:22px;bottom:22px;z-index:9000;display:flex;align-items:center;gap:10px;
    background:#ECEAE3;color:#0C0C0D;border:none;border-radius:40px;padding:12px 18px 12px 12px;cursor:pointer;
    font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 8px 30px rgba(0,0,0,.45);transition:transform .18s}
  .plug-fab:hover{transform:translateY(-2px)}
  .plug-fab img{width:30px;height:auto;object-fit:contain}
  .plug-fab .pdot{width:7px;height:7px;border-radius:50%;background:#BC3340;box-shadow:0 0 0 0 rgba(188,51,64,.5);animation:plugp 2s infinite}
  @keyframes plugp{0%{box-shadow:0 0 0 0 rgba(188,51,64,.5)}70%{box-shadow:0 0 0 7px rgba(188,51,64,0)}100%{box-shadow:0 0 0 0 rgba(188,51,64,0)}}
  .plug-panel{position:fixed;right:22px;bottom:22px;z-index:9001;width:min(400px,calc(100vw - 32px));height:min(620px,calc(100vh - 44px));
    background:#141416;border:1px solid rgba(236,234,227,.14);border-radius:4px;box-shadow:0 24px 70px rgba(0,0,0,.6);
    display:none;flex-direction:column;overflow:hidden;font-family:'Space Grotesk',system-ui,sans-serif}
  .plug-panel.open{display:flex}
  .plug-hd{display:flex;align-items:center;gap:11px;padding:14px 16px;background:#1A1A1D;border-bottom:1px solid rgba(236,234,227,.12)}
  .plug-hd img{width:38px;height:auto;object-fit:contain}
  .plug-hd .nm{font-family:'Space Grotesk',sans-serif;font-weight:700;text-transform:uppercase;font-size:14px;color:#ECEAE3;line-height:1.05;letter-spacing:-.01em}
  .plug-hd .nm em{font-style:normal;color:#C9CBCE}
  .plug-hd .sub{font-family:'Space Mono',monospace;font-size:9px;color:#8C8B85;letter-spacing:.06em;text-transform:uppercase}
  .plug-hd .x{margin-left:auto;border:none;background:transparent;font-size:20px;color:#8C8B85;cursor:pointer;line-height:1}
  .plug-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px}
  .plug-intro{text-align:center;padding:14px 6px}
  .plug-intro h4{font-family:'Space Grotesk',sans-serif;font-weight:700;text-transform:uppercase;font-size:19px;color:#ECEAE3;line-height:1;letter-spacing:-.01em}
  .plug-intro p{font-size:13px;color:#8C8B85;margin-top:8px}
  .pl-row{display:flex;gap:9px;align-items:flex-start;max-width:92%}
  .pl-row.me{align-self:flex-end;flex-direction:row-reverse}
  .pl-av{width:28px;height:28px;border-radius:3px;flex:0 0 auto;overflow:hidden;background:#000}
  .pl-av img{width:100%;height:100%;object-fit:contain}
  .pl-av.me{background:#ECEAE3;color:#0C0C0D;display:grid;place-items:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:10px}
  .pl-b{padding:11px 13px;border-radius:6px;font-size:14px;line-height:1.5}
  .pl-row.bot .pl-b{background:#1A1A1D;border:1px solid rgba(236,234,227,.1);border-top-left-radius:2px;color:#ECEAE3}
  .pl-row.me .pl-b{background:#ECEAE3;color:#0C0C0D;border-top-right-radius:2px}
  .pl-cards{display:flex;flex-direction:column;gap:8px;margin-top:10px}
  .pl-card{display:flex;gap:10px;background:#1A1A1D;border:1px solid rgba(236,234,227,.1);border-radius:3px;padding:8px;transition:border-color .15s}
  .pl-card:hover{border-color:rgba(236,234,227,.4)}
  .pl-card .ph{width:58px;height:58px;border-radius:2px;overflow:hidden;flex:0 0 auto;background:#ECEAE3}
  .pl-card .ph img{width:100%;height:100%;object-fit:cover}
  .pl-card .nm{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:12px;color:#ECEAE3;line-height:1.2}
  .pl-card .bl{font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#5A5A53}
  .pl-card .pr{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;color:#ECEAE3;margin-top:3px}
  .pl-card .pr small{font-family:'Space Mono',monospace;font-size:9px;color:#C9CBCE;font-weight:400;margin-left:5px}
  .pl-card .au{font-family:'Space Mono',monospace;font-size:8px;color:#8C8B85;margin-top:2px;text-transform:uppercase}
  .pl-card .plbag{margin-top:7px;font-family:'Space Mono',monospace;font-size:10px;text-transform:uppercase;border:none;background:#ECEAE3;color:#0C0C0D;border-radius:2px;padding:5px 10px;cursor:pointer}
  .pl-card .plbag:hover{background:#C9CBCE}
  .pl-typing{display:flex;gap:4px;padding:12px 13px}
  .pl-typing span{width:6px;height:6px;border-radius:50%;background:#8C8B85;animation:plb 1.2s infinite}
  .pl-typing span:nth-child(2){animation-delay:.2s}.pl-typing span:nth-child(3){animation-delay:.4s}
  @keyframes plb{0%,60%,100%{opacity:.25}30%{opacity:1}}
  .plug-ft{flex:0 0 auto;padding:12px 14px 14px;background:#1A1A1D;border-top:1px solid rgba(236,234,227,.1)}
  .plug-chips{display:flex;gap:7px;overflow-x:auto;padding-bottom:9px;scrollbar-width:none}
  .plug-chips::-webkit-scrollbar{display:none}
  .plug-chips button{flex:0 0 auto;font-family:'Space Mono',monospace;font-size:10.5px;text-transform:uppercase;color:#8C8B85;background:#141416;border:1px solid rgba(236,234,227,.12);border-radius:2px;padding:7px 11px;cursor:pointer;white-space:nowrap}
  .plug-chips button:hover{background:#ECEAE3;color:#0C0C0D;border-color:#ECEAE3}
  .plug-in{display:flex;gap:8px;align-items:center;background:#141416;border:1px solid rgba(236,234,227,.14);border-radius:3px;padding:5px 5px 5px 14px}
  .plug-in:focus-within{border-color:rgba(236,234,227,.5)}
  .plug-in input{flex:1;border:none;background:transparent;font-family:'Space Grotesk',sans-serif;font-size:14px;color:#ECEAE3;outline:none}
  .plug-in button{width:36px;height:36px;border:none;border-radius:2px;background:#ECEAE3;color:#0C0C0D;font-size:15px;cursor:pointer}
  .plug-in button:hover{background:#C9CBCE}
  .plug-dis{text-align:center;font-family:'Space Mono',monospace;font-size:9px;color:#5A5A53;margin-top:8px;letter-spacing:.03em;text-transform:uppercase}`;

  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.className = 'plug-fab';
  fab.innerHTML = `<img src="${LOGO}" alt=""><span class="pdot"></span> Ask The Plug`;
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.className = 'plug-panel';
  panel.innerHTML = `
    <div class="plug-hd">
      <img src="${LOGO}" alt="">
      <div><div class="nm">The <em>Plug</em></div><div class="sub">AI concierge · live inventory</div></div>
      <button class="x" aria-label="close">×</button>
    </div>
    <div class="plug-body" id="plugBody">
      <div class="plug-intro"><h4>What heat you after?</h4><p>Vibe, budget, size, occasion — I'll pull what's authenticated and in the building.</p></div>
    </div>
    <div class="plug-ft">
      <div class="plug-chips">
        <button>Clean white pair under $200</button>
        <button>Pink, size 8, for my girl</button>
        <button>A grail Jordan 1</button>
        <button>Comfortable everyday neutral</button>
      </div>
      <div class="plug-in"><input type="text" placeholder="Ask The Plug anything…" autocomplete="off"><button>→</button></div>
      <div class="plug-dis">grounded in live authenticated stock · runs locally · no data leaves the shop</div>
    </div>`;
  document.body.appendChild(panel);

  const body  = panel.querySelector('#plugBody');
  const input = panel.querySelector('input');
  const sendB = panel.querySelector('.plug-in button');
  let history = [], busy = false, introGone = false;

  const esc = s => s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const bottom = () => body.scrollTop = body.scrollHeight;
  function open(){ panel.classList.add('open'); fab.style.display='none'; input.focus(); }
  function close(){ panel.classList.remove('open'); fab.style.display='flex'; }
  fab.onclick = open;
  panel.querySelector('.x').onclick = close;

  function addUser(t){
    if(!introGone){ body.querySelector('.plug-intro')?.remove(); introGone=true; }
    const r=document.createElement('div'); r.className='pl-row me';
    r.innerHTML=`<div class="pl-av me">YO</div><div class="pl-b">${esc(t)}</div>`;
    body.appendChild(r); bottom();
  }
  function addTyping(){
    const r=document.createElement('div'); r.className='pl-row bot'; r.id='plugTyping';
    r.innerHTML=`<div class="pl-av"><img src="${LOGO}"></div><div class="pl-b" style="padding:0"><div class="pl-typing"><span></span><span></span><span></span></div></div>`;
    body.appendChild(r); bottom();
  }
  function cards(ps){
    if(!ps||!ps.length) return '';
    return `<div class="pl-cards">`+ps.map(p=>`<a class="pl-card" href="product.html">
      <div class="ph"><img src="${p.img}" alt=""></div>
      <div><div class="bl">${esc(p.brand)}</div><div class="nm">${esc(p.name)}</div>
      <div class="pr">$${p.price}<small>mkt $${p.market}</small></div>
      <div class="au">✓ auth · US ${p.size_us} · ${p.condition}</div>
      <button class="plbag" data-p='${JSON.stringify(p).replace(/'/g,"&#39;")}'>+ bag</button></div></a>`).join('')+`</div>`;
  }
  function addBot(t,ps){
    const r=document.createElement('div'); r.className='pl-row bot';
    r.innerHTML=`<div class="pl-av"><img src="${LOGO}"></div><div class="pl-b">${esc(t)}${cards(ps)}</div>`;
    body.appendChild(r); bottom();
  }
  async function ask(t){
    if(busy||!t.trim()) return; busy=true;
    addUser(t); input.value=''; addTyping();
    try{
      const res = await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,history})});
      const d = await res.json();
      document.getElementById('plugTyping')?.remove();
      if(d.error){ addBot("Concierge engine isn't reachable — start it with: python3 ai/concierge.py",[]); }
      else{ addBot(d.reply,d.products); history.push({role:'user',content:t}); history.push({role:'assistant',content:d.reply}); }
    }catch(e){
      document.getElementById('plugTyping')?.remove();
      addBot("Couldn't reach The Plug. Run the local server: python3 ai/concierge.py (needs Ollama up).",[]);
    }
    busy=false; input.focus();
  }
  sendB.onclick=()=>ask(input.value);
  input.onkeydown=e=>{ if(e.key==='Enter') ask(input.value); };
  panel.querySelector('.plug-chips').onclick=e=>{ if(e.target.tagName==='BUTTON') ask(e.target.textContent); };

  // public hooks so on-page buttons can open / query the concierge
  window.openPlug = open;
  window.askPlug  = (t)=>{ open(); ask(t); };
})();
