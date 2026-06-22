#!/usr/bin/env python3
"""
THATS OC CLT — local AI concierge ("The Plug").
RAG over the live catalog using Ollama. No cloud, no API keys, $0 / query.

  pipeline:  user msg -> embed (nomic-embed-text) -> cosine top-K pairs
             -> ground llama3.2 with ONLY those pairs -> reply + product cards

Run:  python3 ai/concierge.py   (serves http://localhost:8799)
Deps: none (Python stdlib only). Requires Ollama running on :11434.
"""
import json, math, os, re, urllib.request, http.server, socketserver

HERE       = os.path.dirname(os.path.abspath(__file__))
ROOT       = os.path.dirname(HERE)
OLLAMA     = "http://localhost:11434"
EMBED_MODEL= "nomic-embed-text"
CHAT_MODEL = "llama3.2"
PORT       = 8799
TOPK       = 4

SYSTEM = """You are "The Plug" — the AI concierge for Thats OC CLT, a Charlotte, NC
sneaker + streetwear shop ("leading destination for global heat"). Talk like a real
shop homie in a DM: confident, friendly, concise, never corporate.

HOW TO TALK:
- Have a real conversation. If the request is vague, ask ONE clarifying question
  (size? budget? vibe?) instead of dumping product.
- Recommend AT MOST 2-3 pairs, and ONLY pairs listed in CONTEXT that actually fit
  what they asked. Quality over quantity — one perfect pair beats a list.
- If CONTEXT is empty, do NOT recommend or name any specific pair. Just talk to them
  and ask what they're after. Never invent products, prices, or sizes.
- Greetings / small talk / questions about the shop: just answer like a person, no product list.
- Every pair is authenticated in-hand in Charlotte; mention it naturally when trust matters.
  Buyers can ship, cop at a free Plaza Midwood meetup, or deposit-to-hold.
- Keep it to 1-3 sentences. You are a knowledgeable friend, not a catalog.
"""

COLORS = ["black","white","pink","red","blue","royal","green","olive","cream",
          "orange","grey","gray","wheat","tan","brown","volt","burgundy","pastel",
          "navy","gold","multi","neon"]

def rank(catalog, query):
    qv = embed(query)
    scored = [(p, cosine(qv, p["_vec"])) for p in catalog]
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored

def select(query, scored):
    """Return only the pairs that genuinely match — or [] for chit-chat / no match."""
    q = query.lower()
    mp   = re.search(r'(?:under|below|less than|<|cheaper than|max)\s*\$?\s*(\d{2,4})', q)
    maxp = int(mp.group(1)) if mp else None
    msz  = re.search(r'\b(?:size|sz|us)\s*(\d{1,2}(?:\.5)?)\b', q)
    size = msz.group(1) if msz else None
    gender = None
    if any(w in q for w in ["women","womens","woman","for my girl","for her"," her "," she "]): gender = "women"
    elif any(w in q for w in [" men ","mens","for him","for my guy","for my man"]): gender = "men"
    colors = [c for c in COLORS if re.search(r'\b'+c+r'\b', q)]
    has_constraint = bool(maxp or size or gender or colors)

    def ok(p):
        if maxp and p["price"] > maxp: return False
        if size and str(p["size_us"]).lower().replace("w","") != size: return False
        if gender and p["gender"] not in ("unisex", gender): return False
        if colors:
            hay = (p["colorway"] + " " + " ".join(p["tags"])).lower()
            if not any(c in hay for c in colors): return False
        return True

    top = scored[0][1] if scored else 0.0
    if has_constraint:
        # explicit criteria → trust hard filters; only pairs with some relevance
        return [p for p, s in scored if ok(p) and s >= 0.42][:3]
    # no explicit criteria → only surface product if the query clearly reads as shopping
    if top < 0.56:
        return []
    return [p for p, s in scored if s >= max(0.5, top - 0.06)][:3]

def ollama(path, payload):
    req = urllib.request.Request(OLLAMA + path,
        data=json.dumps(payload).encode(), headers={"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())

def embed(text):
    return ollama("/api/embeddings", {"model":EMBED_MODEL,"prompt":text})["embedding"]

def cosine(a, b):
    dot = sum(x*y for x,y in zip(a,b))
    na  = math.sqrt(sum(x*x for x in a)); nb = math.sqrt(sum(y*y for y in b))
    return dot/(na*nb) if na and nb else 0.0

def product_text(p):
    return (f"{p['name']} by {p['brand']} {p['model']}. Colorway {p['colorway']}. "
            f"Size US {p['size_us']}, condition {p['condition']}, ${p['price']} "
            f"(market ${p['market']}). {p['gender']}. Style: {', '.join(p['tags'])}.")

# ---- build / load embedding index -------------------------------------------
def build_index():
    catalog = json.load(open(os.path.join(HERE,"catalog.json")))
    cache_p = os.path.join(HERE,"index.json")
    cache   = {}
    if os.path.exists(cache_p):
        try: cache = json.load(open(cache_p))
        except Exception: cache = {}
    changed = False
    for p in catalog:
        if p["id"] not in cache:
            print(f"  embedding {p['id']}  {p['name']}")
            cache[p["id"]] = embed(product_text(p))
            changed = True
    if changed:
        json.dump(cache, open(cache_p,"w"))
    for p in catalog:
        p["_vec"] = cache[p["id"]]
    return catalog

def retrieve(catalog, query, k=TOPK):
    qv = embed(query)
    ranked = sorted(catalog, key=lambda p: cosine(qv, p["_vec"]), reverse=True)
    return ranked[:k]

def answer(catalog, message, history):
    matches = select(message, rank(catalog, message))
    if matches:
        ctx = "CONTEXT (only pairs you may recommend — pick the 1-3 that best fit):\n" + \
              "\n".join(f"- {product_text(p)}" for p in matches)
    else:
        ctx = ("CONTEXT: (nothing in stock matches this message — do NOT name or recommend "
               "any specific pair. Just talk to them like a person; if they're shopping, ask "
               "their size, budget, or the vibe they want.)")
    msgs = [{"role":"system","content":SYSTEM + "\n\n" + ctx}]
    for h in history[-6:]:
        msgs.append({"role":h["role"],"content":h["content"]})
    msgs.append({"role":"user","content":message})
    reply = ollama("/api/chat", {"model":CHAT_MODEL,"messages":msgs,"stream":False})["message"]["content"]
    cards = [{k:p[k] for k in ("id","name","brand","colorway","size_us","condition","price","market","img")} for p in matches]
    return {"reply":reply.strip(), "products":cards}

# ---- http server ------------------------------------------------------------
CATALOG = None
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k): super().__init__(*a, directory=ROOT, **k)
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin","*")
        self.send_header("Access-Control-Allow-Headers","Content-Type")
        self.send_header("Access-Control-Allow-Methods","POST, GET, OPTIONS")
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def _json(self, code, obj):
        data = json.dumps(obj).encode()
        self.send_response(code); self.send_header("Content-Type","application/json")
        self._cors(); self.end_headers(); self.wfile.write(data)
    def do_POST(self):
        path = self.path.rstrip("/")
        try:
            body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            if path == "/chat":
                self._json(200, answer(CATALOG, body.get("message",""), body.get("history",[])))
            elif path == "/search":
                hits = retrieve(CATALOG, body.get("query",""), int(body.get("k",8)))
                cards = [{k:p[k] for k in ("id","name","brand","model","colorway","size_us","condition","price","market","img")} for p in hits]
                self._json(200, {"products":cards})
            else:
                self._json(404, {"error":"not found"})
        except Exception as e:
            self._json(500, {"error":str(e)})
    def log_message(self,*a): pass

if __name__ == "__main__":
    print("THATS OC CLT — concierge booting…")
    CATALOG = build_index()
    print(f"  indexed {len(CATALOG)} pairs · serving http://localhost:{PORT}  (demo: /concierge.html)")
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("",PORT), H) as srv:
        srv.serve_forever()
