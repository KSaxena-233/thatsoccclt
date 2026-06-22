/* scroll-reveal: sections rise in as they enter view. zero markup changes. */
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var sel = '.sec-head, .card, .cl-solo, .trust, .split, .rcard, .ig-grid, .coacard, .authsteps, .colhead';
  var els = [].slice.call(document.querySelectorAll(sel));
  els.forEach(function(el){ el.classList.add('reveal'); });
  // stagger items inside grids
  ['.grid','.grid4'].forEach(function(gs){
    [].slice.call(document.querySelectorAll(gs)).forEach(function(g){
      [].slice.call(g.children).forEach(function(c,i){ c.style.transitionDelay = ((i%4)*70)+'ms'; });
    });
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:'0px 0px -7% 0px' });
  els.forEach(function(el){ io.observe(el); });
})();
