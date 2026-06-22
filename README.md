# THATS OC CLT — Storefront

Charlotte's plug for global heat. Nike-energy storefront for the @thatsoccclt sneaker + streetwear resale shop.

- Static site (HTML/CSS/JS), one catalog (`ai/catalog.json`) drives home, vault, brand pages, search & the AI concierge.
- **The Plug** — local AI concierge + semantic search via Ollama (`python3 ai/concierge.py`, runs on :8799). Hosted site shows a graceful fallback when the local engine isn't running.
- Drop real pair photos into `assets/products/<id>.jpg` to replace stock everywhere.

Built with Charlotte in mind. No fakes, ever.
