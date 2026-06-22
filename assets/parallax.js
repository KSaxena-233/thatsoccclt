/* lightweight scroll parallax — section images drift at their own speed */
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var targets = [];
  document.querySelectorAll('.split .img img').forEach(function(el){ targets.push([el,0.16]); });
  document.querySelectorAll('.cl-solo .ph img').forEach(function(el){ targets.push([el,0.10]); });
  if(!targets.length) return;
  targets.forEach(function(t){ t[0].style.willChange='transform'; });
  var ticking=false;
  function update(){
    var vh=window.innerHeight;
    targets.forEach(function(t){
      var el=t[0], speed=t[1];
      var r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>vh) return;
      var off=((r.top+r.height/2)-vh/2)/vh;          // -0.5..0.5
      el.style.transform='translateY('+(off*speed*-140).toFixed(1)+'px) scale(1.16)';
    });
    ticking=false;
  }
  function onScroll(){ if(!ticking){ requestAnimationFrame(update); ticking=true; } }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  update();
})();
