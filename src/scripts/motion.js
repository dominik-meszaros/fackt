
(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // SwiftUI .spring(duration:, bounce:) as a CSS linear() easing.
  function spring(dur, bounce){
    var w = 2*Math.PI/dur, z = 1 - bounce, pts=[], N=48, T=dur*1.6;
    for(var k=0;k<=N;k++){var t=k/N*T, v;
      if(z<1){var wd=w*Math.sqrt(1-z*z); v=1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t));}
      else v=1-Math.exp(-w*t)*(1+w*t);
      pts.push(v.toFixed(4));}
    pts[N]='1';
    return {e:'linear('+pts.join(',')+')', d:T};
  }
  var supportsLinear = CSS.supports('transition-timing-function','linear(0,1)');
  function tr(el, props, dur, ease, delay){
    var s = (typeof ease==='object') ? ease : null;
    var d = s ? s.d : dur, e = s ? (supportsLinear ? s.e : 'cubic-bezier(.3,1.4,.5,1)') : ease;
    el.style.transition = props.map(function(p){return p+' '+d+'s '+e+' '+(delay||0)+'s'}).join(',');
  }
  function set(el, css){ for(var k in css) el.style[k]=css[k]; }
  function reflow(el){ void el.offsetWidth; }
  var timers = {};
  function later(key, fn, ms){ (timers[key]=timers[key]||[]).push(setTimeout(fn, ms)); }
  function clear(key){ (timers[key]||[]).forEach(clearTimeout); timers[key]=[]; }
  var $ = function(id){return document.getElementById(id)};
  var Q = function(root, sel){return Array.prototype.slice.call(root.querySelectorAll(sel))};

  // Fit each 402 x 874 screen into its phone.
  function fit(){ Q(document,'.phone').forEach(function(p){ var s=p.querySelector('.screen'); s.style.transform='scale('+(p.clientWidth/402)+')'; }); }
  if (window.ResizeObserver) { var ro=new ResizeObserver(fit); Q(document,'.phone').forEach(function(p){ro.observe(p)}); }
  addEventListener('resize', fit); fit();

  // dozyAppear(i, step): staggered fade + lift.
  function appear(els, attr, step, base){
    els.forEach(function(el){ var i=+el.getAttribute(attr); tr(el,['opacity','transform'],0,'none'); set(el,{opacity:0,transform:'translateY(14px)'}); });
    reflow(els[0]||document.body);
    var sp = spring(0.5, 0.25);
    els.forEach(function(el){ var i=+el.getAttribute(attr); tr(el,['opacity','transform'],0,sp,(base||0)+i*step); set(el,{opacity:1,transform:'none'}); });
  }

  var scenes = {};

  // ---------- Dozy: wake ----------
  scenes.wake = function(){
    var sun=$('wk-sun'), sl=$('wk-sloth'), nt=$('wk-night'), root=$('s-wake');
    [sun,sl,nt].forEach(function(e){e.style.transition='none'});
    set(sun,{transform:'translateY(278px) scale(.9)'}); set(sl,{transform:'translate(0,34px) scaleY(.94)'}); set(nt,{opacity:.85});
    reflow(sun);
    tr(sun,['transform'],1.6,'cubic-bezier(0,0,.58,1)'); set(sun,{transform:'translateY(48px) scale(1)'});
    tr(sl,['transform'],0,spring(0.9,0.38),0.35); set(sl,{transform:'none'});
    tr(nt,['opacity'],1.4,'cubic-bezier(0,0,.58,1)'); set(nt,{opacity:0});
    appear(Q(root,'[data-ap]'),'data-ap',0.09,0);
  };

  // ---------- Dozy: night ----------
  (function(){
    var stars=[[.08,.07,2,2.6,0],[.22,.19,1.5,3.4,.9],[.86,.06,2.5,3,.4],[.71,.15,1.5,2.8,1.4],[.4,.04,2,3.6,.2],[.93,.24,2,2.4,1.1],[.13,.28,2.5,3.2,.6],[.6,.26,1.5,2.9,1.8],[.32,.12,1.5,3.1,1.2]];
    $('stars').innerHTML=stars.map(function(s){return '<span class="dz-star" style="left:'+(s[0]*402)+'px;top:'+(s[1]*874)+'px;width:'+s[2]+'px;height:'+s[2]+'px;--d:'+s[3]+'s;--dl:'+s[4]+'s"></span>'}).join('');
    var r=''; for(var i=0;i<8;i++){ r+='<rect x="15.5" y="2" width="3" height="6" rx="1.5" transform="rotate('+(i*45)+' 17 17)"/>'; } $('rays').innerHTML=r;
  })();
  scenes.sleep = function(){ var root=$('s-sleep'); appear(Q(root,'.dz-head > *, .dz-sl, .dz-slide').map(function(e,i){e.setAttribute('data-sa',i);return e}),'data-sa',0.09,0); };

  // ---------- Dozy: score ----------
  scenes.score = function(){
    var root=$('s-score'), arc=$('sc-arc'), n=$('sc-n');
    arc.style.transition='none'; arc.style.strokeDashoffset='653.5'; reflow(arc);
    arc.style.transition='stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1) .2s'; arc.style.strokeDashoffset=String(653.5*(1-.86));
    clear('score'); var t0=performance.now();
    (function tick(){ var p=Math.min(1,(performance.now()-t0-200)/1400); p=p<0?0:1-Math.pow(1-p,3); n.textContent=Math.round(86*p); if(p<1) timers.score.push(requestAnimationFrame(tick)); })();
    timers.score=timers.score||[];
    appear(Q(root,'[data-sc]'),'data-sc',0.09,0.3);
  };

  // ---------- Ritual: garden ----------
  var TW=128, TH=64; // 2x of the app's 64 x 32 tile
  function pt(i,j){ return {x:(i-j)*TW/2, y:(i+j)*TH/2}; }
  var plants=[['sunflower',0,0],['tulip',1,0],['pine',0,1],['lavender',2,1],['cherry',1,2],['pumpkin',2,2]];
  function buildLawn(n, celebrate){
    var plot=$('plot'); Q(plot,'.lawn').forEach(function(e){e.remove()});
    var h='';
    var mid=pt((n-1)/2,(n-1)/2);
    h+='<img class="lawn" src="/motion/ritual-plot_shadow.png" style="left:'+(mid.x+12-n*TW*1.04/2)+'px;top:'+(mid.y+18+8-n*TH/2+TH/2)+'px;width:'+(n*TW*1.04)+'px;height:'+(n*TH)+'px;opacity:.55;z-index:0" alt="">';
    for(var i=0;i<n;i++)for(var j=0;j<n;j++){
      var c=pt(i,j), z=1+(i+j);
      h+='<img class="lawn" src="/motion/ritual-plot_top_'+((i*7+j*5+i*j)%3)+'.png" style="left:'+(c.x-TW/2)+'px;top:'+(c.y-TH/2)+'px;width:'+TW+'px;height:'+TH+'px;z-index:'+z+'" alt="">';
      if(j==n-1) h+='<img class="lawn" src="/motion/ritual-plot_side_l.png" style="left:'+(c.x-TW/2)+'px;top:'+c.y+'px;width:'+(TW/2)+'px;height:'+(TW*50/128)+'px;z-index:'+z+'" alt="">';
      if(i==n-1) h+='<img class="lawn" src="/motion/ritual-plot_side_r.png" style="left:'+c.x+'px;top:'+c.y+'px;width:'+(TW/2)+'px;height:'+(TW*50/128)+'px;z-index:'+z+'" alt="">';
      if(celebrate && (i==n-1||j==n-1)) h+='<div class="lawn rt-glow" data-glow="'+(i+j)+'" style="left:'+c.x+'px;top:'+c.y+'px;z-index:400"></div>';
    }
    plot.insertAdjacentHTML('afterbegin',h);
    if(celebrate){ var gl=Q(plot,'[data-glow]'); reflow(plot); gl.forEach(function(g){ g.style.transitionDelay=(+g.getAttribute('data-glow')*0.04)+'s'; g.style.opacity=0; }); }
  }
  function fitPlot(n, animate){ var s = 3/n*0.92 + 0.08; var plot=$('plot'); plot.style.transition=animate?'transform .5s ease':'none'; plot.style.transform='translateY('+(-(n-1)*TH/2*s)+'px) scale('+s+')'; }
  function sparkle(x,y){ var plot=$('plot'); for(var k=0;k<6;k++){ var s=document.createElement('span'); s.className='rt-spark'; s.textContent='✦'; s.style.left=(x-8)+'px'; s.style.top=(y-80)+'px'; s.style.zIndex=900; s.style.transform='scale(.2)'; plot.appendChild(s); var a=k/6*Math.PI*2; reflow(s); s.style.transform='translate('+(Math.cos(a)*44)+'px,'+(-Math.sin(a)*32-14)+'px) scale(1)'; s.style.opacity=0; (function(s){setTimeout(function(){s.remove()},800)})(s);} }
  scenes.garden = function(){
    clear('garden'); var plot=$('plot'); Q(plot,'.rt-item,.rt-spark').forEach(function(e){e.remove()});
    buildLawn(3,false); fitPlot(3,false);
    var nodes={};
    plants.forEach(function(p,k){
      later('garden',function(){
        var c=pt(p[1],p[2]); var d=document.createElement('div'); d.className='rt-item';
        d.style.left=c.x+'px'; d.style.top=c.y+'px'; d.style.zIndex=10*(p[1]+p[2])+20;
        d.innerHTML='<img src="/motion/ritual-plot_'+p[0]+'_'+(k%3===0?1:2)+'.png" style="--d:'+(1.8+Math.random()*.8).toFixed(2)+'s;--dl:'+(-Math.random()*2).toFixed(2)+'s" alt="">';
        d.style.transform='scale(.1)'; plot.appendChild(d); nodes[k]=d; reflow(d);
        d.style.transition='transform .22s ease-out'; d.style.transform='scale(1.1)';
        setTimeout(function(){ d.style.transition='transform .18s ease-in-out'; d.style.transform='scale(1)'; },220);
      }, 400+k*260);
    });
    function upgrade(k, stage, at){
      later('garden',function(){ var d=nodes[k]; if(!d) return; var p=plants[k]; d.querySelector('img').src='/motion/ritual-plot_'+p[0]+'_'+stage+'.png'; d.style.transition='transform .12s ease-out'; d.style.transform='scale(1.15)'; setTimeout(function(){d.style.transition='transform .25s ease-in-out'; d.style.transform='scale(1)';},120); var c=pt(p[1],p[2]); sparkle(c.x,c.y); },at);
    }
    upgrade(0,2,2400); upgrade(0,3,3100); upgrade(3,3,3500); upgrade(4,3,3900);
    later('garden',function(){ buildLawn(4,true); fitPlot(4,true); $('seeds').textContent='Land grew to 4 × 4'; },4700);
    later('garden',function(){ $('seeds').textContent='+12 seeds today'; },7600);
  };

  // ---------- Ritual: breathe ----------
  var brRAF;
  scenes.breathe = function(){
    cancelAnimationFrame(brRAF);
    var orb=$('br-orb'), arc=$('br-arc'), lab=$('br-l'), num=$('br-n'), sp=$('br-sp'), segs=Q($('s-breathe'),'.rt-segs i'), round=$('br-r');
    var names=['Breathe in','Hold','Breathe out','Hold'], P=4, t0=performance.now(), last=-1;
    function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
    (function f(){
      var t=(performance.now()-t0)/1000, cyc=t%(4*P), step=Math.floor(cyc/P), inStep=(cyc%P)/P;
      var s = step===0?ease(inStep):step===1?1:step===2?1-ease(inStep):0;
      orb.style.transform='scale('+(0.42+0.5*s)+')';
      sp.style.opacity = step===2?0.4:1;
      arc.style.strokeDashoffset = 785.4*(1-cyc/(4*P));
      segs.forEach(function(g,i){ g.style.width = i<step?'100%':i===step?(inStep*100)+'%':'0' });
      num.textContent = Math.max(1, Math.ceil(P - cyc%P));
      if(step!==last){ last=step; lab.style.transition='opacity .175s'; lab.style.opacity=0; setTimeout(function(){lab.textContent=names[step]; lab.style.opacity=1;},175); }
      round.textContent = 1+Math.floor(t/(4*P))%8;
      brRAF=requestAnimationFrame(f);
    })();
  };

  // ---------- Ritual: done ----------
  scenes.done = function(){
    var root=$('s-done'), art=$('dn-art'), sun=$('dn-sun');
    [art,sun].forEach(function(e){e.style.transition='none'});
    set(sun,{transform:'translateY(80px)'}); set(art,{transform:'translateY(18px) rotate(-2.5deg) scale(.94)',opacity:0});
    var rv=Q(root,'[data-rv]'); rv.forEach(function(e){e.style.transition='none'; set(e,{opacity:0,transform:'translateY(14px)'})});
    reflow(art);
    tr(art,['transform','opacity'],0,spring(0.55,0.28),0.12); set(art,{transform:'none',opacity:1});
    tr(sun,['transform'],0,spring(0.9,0.4),0.15); set(sun,{transform:'none'});
    var settle=spring(0.55,0.28);
    rv.forEach(function(e){ var i=+e.getAttribute('data-rv'); tr(e,['transform','opacity'],0,settle,0.35+i*0.07); set(e,{opacity:1,transform:'none'}); });
  };

  // ---------- Ritual: mood ----------
  var moods=[['great','great'],['good','good'],['okay','okay'],['low','low'],['rough','rough']];
  $('faces').innerHTML=moods.map(function(m,i){return '<div class="rt-face" data-m="'+i+'"><img src="/motion/ritual-mood_'+m[0]+'.png" alt=""><span>'+m[1]+'</span></div>'}).join('');
  var weekM=['good','great','okay','good','great','good',null];
  function drawWeek(today){ $('week').innerHTML=weekM.map(function(m,i){ var mm = i===6?today:m; return '<div>'+(mm?'<img src="/motion/ritual-mood_'+mm+'.png" alt="" '+(i===6?'id="wk-today"':'')+'>':'')+'</div>' }).join(''); }
  drawWeek(null);
  function pick(i, note){
    var faces=Q($('faces'),'.rt-face');
    faces.forEach(function(f,k){ f.classList.toggle('on',k===i); });
    var img=faces[i].querySelector('img'), pop=spring(0.38,0.55);
    img.style.transition='none'; img.style.transform='scale(1)'; reflow(img);
    tr(img,['transform','filter','opacity'],0,pop); img.style.transform='scale(1.05) rotate(1.6deg)';
    setTimeout(function(){ img.style.transform='none'; },160);
    var p=$('mood-t'); p.textContent=''; var k=0; clear('moodtype');
    (function type(){ if(k<=note.length){ p.textContent=note.slice(0,k++); later('moodtype',type,38);} })();
    later('mood',function(){ drawWeek(moods[i][0]); var t=$('wk-today'); t.style.transform='scale(.2)'; reflow(t); tr(t,['transform'],0,pop); t.style.transform='none'; },note.length*38+200);
  }
  scenes.mood = function(){ clear('mood'); drawWeek(null); Q($('faces'),'.rt-face').forEach(function(f){f.classList.remove('on')}); $('mood-t').textContent='';
    later('mood',function(){pick(2,'long day, ok')},500); later('mood',function(){pick(0,'walked, slept well, felt light')},1900); };
  $('faces').addEventListener('click',function(e){ var f=e.target.closest('.rt-face'); if(!f) return; clear('mood'); pick(+f.getAttribute('data-m'),['felt great','pretty good','fine, steady','a bit low','rough one'][+f.getAttribute('data-m')]); });

  // ---------- Fluo: shared keyboard ----------
  function keysHTML(active){
    var chips=['Fix','Ask','Reply','Tone','Translate'];
    var bar='<div class="fl-bar">'+chips.map(function(c){return '<div class="fl-chip'+(c==='Fix'?' fix':'')+'" data-chip="'+c+'">'+(c==='Fix'?'✦ ':'')+c+'</div>'}).join('')+'</div>';
    var rows=['qwertyuiop','asdfghjkl','zxcvbnm'];
    var k='<div class="fl-keys" data-keys>'+rows.map(function(r,i){ return '<div class="fl-row">'+(i===2?'<div class="fl-k w">⇧</div>':'')+r.split('').map(function(c){return '<div class="fl-k">'+c+'</div>'}).join('')+(i===2?'<div class="fl-k w">⌫</div>':'')+'</div>'}).join('')+'<div class="fl-row"><div class="fl-k w">123</div><div class="fl-k w">🌐</div><div class="fl-k sp">Fluo · English</div><div class="fl-k w" style="width:88px">return</div></div></div>';
    return bar+k;
  }
  function px(){ return '<div class="fl-px">'+[0,1,2,3,4,5].map(function(){return '<i></i>'}).join('')+'</div>'; }
  var pxTick=0; setInterval(function(){ pxTick++; Q(document,'.fl-px').forEach(function(p){ Q(p,'i').forEach(function(i,k){ i.classList.toggle('on', k===pxTick%6); }); }); },120);
  function panel(kb, html){
    var keys=kb.querySelector('[data-keys]'); var old=kb.querySelector('.fl-panel');
    if(old) old.remove();
    if(!html){ keys.style.transition='opacity .2s'; keys.style.opacity=1; return null; }
    keys.style.transition='opacity .15s'; keys.style.opacity=0;
    var p=document.createElement('div'); p.className='fl-panel'; p.innerHTML=html; p.style.opacity=0; p.style.transform='translateY(16px)'; kb.appendChild(p); reflow(p); p.style.opacity=1; p.style.transform='none'; return p;
  }
  function press(el, cb){ el.classList.add('pr'); setTimeout(function(){ el.classList.remove('pr'); cb&&cb(); },150); }

  scenes.fix = function(){
    clear('fix'); var kb=$('fx-kb'), c=$('fx-c'); var src='hey running late sry can we meet at ten';
    kb.innerHTML=keysHTML(); c.textContent=src;
    later('fix',function(){ press(kb.querySelector('[data-chip="Fix"]'), function(){
      panel(kb,'<div class="fl-cap" style="color:rgba(236,243,238,.35)">'+src+'<div class="fl-sweep"></div></div><div class="fl-load">'+px()+'Fixing 4 things</div>');
    }); },900);
    later('fix',function(){
      panel(kb,'<div class="fl-cap"><span class="fl-hi">Hey</span>, running late, <span class="fl-hi">sorry!</span> <span class="fl-hi">Can</span> we meet at <span class="fl-hi">ten?</span></div><div class="fl-acts"><div class="fl-pb" id="fx-rep">Replace</div><div class="fl-rb"></div><div class="fl-rb"></div><div class="fl-rb"></div></div><div class="fl-meta"><b>4</b> fixes · <b>4</b> free fixes left today</div>');
    },2900);
    later('fix',function(){ var r=$('fx-rep'); if(r) press(r,function(){ c.textContent='Hey, running late, sorry! Can we meet at ten?'; c.style.transition='none'; c.style.boxShadow='inset 0 0 0 1.5px #CDF27A'; reflow(c); c.style.transition='box-shadow .8s'; c.style.boxShadow='inset 0 0 0 1px #24302A'; panel(kb,null); }); },4800);
  };

  var vcRAF;
  scenes.voice = function(){
    cancelAnimationFrame(vcRAF); clear('voice');
    var bars=$('bars'); bars.innerHTML=Array(12).join('<i></i>')+'<i></i>';
    var bs=Q(bars,'i'), t0=performance.now(), tm=$('vc-t');
    (function f(){ var t=performance.now()/1000; bs.forEach(function(b,i){ var w=(Math.sin(t*6+i*.8)+1)/2; b.style.height=Math.round((6+26*w)/6)*6+'px'; }); var s=Math.floor((performance.now()-t0)/1000); tm.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); vcRAF=requestAnimationFrame(f); })();
    var words='Grab milk and bread on your way home. Thanks!'.split(' ');
    $('vc-said').innerHTML='<span class="lang">EN</span>'+words.map(function(w){return '<span class="fl-w">'+w+'</span> '}).join('');
    $('vc-c').innerHTML='&nbsp;';
    var ws=Q($('vc-said'),'.fl-w');
    ws.forEach(function(w,i){ later('voice',function(){w.classList.add('on')},500+i*330); });
    later('voice',function(){ $('vc-c').textContent='Grab milk and bread on your way home. Thanks!'; },500+words.length*330+500);
  };

  scenes.reply = function(){
    clear('reply'); var kb=$('rp-kb'), c=$('rp-c'), msgs=$('rp-msgs');
    kb.innerHTML=keysHTML(); c.innerHTML='&nbsp;'; Q(msgs,'.new').forEach(function(e){e.remove()});
    later('reply',function(){ press(kb.querySelector('[data-chip="Reply"]'),function(){ panel(kb,'<div class="fl-load" style="padding:8px 2px">'+px()+'Writing replies in your style</div>'); }); },800);
    later('reply',function(){
      var opts=['Perfect, see you then!','Can we do 8 instead?','Sorry, can\'t make it today.'];
      var p=panel(kb,opts.map(function(o,i){return '<div class="fl-opt" data-o="'+i+'">'+o+'<span>↑</span></div>'}).join(''));
      Q(p,'.fl-opt').forEach(function(o,i){ o.style.opacity=0; o.style.transform='translateY(12px)'; reflow(o); tr(o,['opacity','transform'],0,spring(0.4,0.3),i*0.07); o.style.opacity=1; o.style.transform='none'; });
    },2200);
    later('reply',function(){ var o=kb.querySelector('[data-o="0"]'); if(!o) return; o.style.transition='transform .15s'; o.style.transform='scale(.96)'; setTimeout(function(){ panel(kb,null); var m=document.createElement('div'); m.className='fl-out new'; m.textContent='Perfect, see you then!'; m.style.transform='translateY(20px) scale(.9)'; m.style.opacity=0; msgs.appendChild(m); reflow(m); tr(m,['transform','opacity'],0,spring(0.4,0.3)); m.style.transform='none'; m.style.opacity=1; },180); },4200);
  };

  // Replay buttons + autoplay when a screen scrolls into view.
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-replay]'); if(b) scenes[b.getAttribute('data-replay')](); });
  var map={'s-wake':'wake','s-sleep':'sleep','s-score':'score','s-garden':'garden','s-breathe':'breathe','s-done':'done','s-mood':'mood','s-fix':'fix','s-voice':'voice','s-reply':'reply'};
  // Rest state first, so the page reads complete without scripts running animations.
  ['fix','reply'].forEach(function(k){ var kb=$(k==='fix'?'fx-kb':'rp-kb'); kb.innerHTML=keysHTML(); });
  buildLawn(3,false); fitPlot(3,false);
  plants.forEach(function(p,k){ var c=pt(p[1],p[2]); var d=document.createElement('div'); d.className='rt-item'; d.style.left=c.x+'px'; d.style.top=c.y+'px'; d.style.zIndex=10*(p[1]+p[2])+20; d.innerHTML='<img src="/motion/ritual-plot_'+p[0]+'_3.png" style="--d:2.2s;--dl:-'+k*0.4+'s" alt="">'; $('plot').appendChild(d); });
  Q($('s-done'),'[data-rv]').forEach(function(e){ set(e,{opacity:1,transform:'none'}) });
  if(RM){ scenes.breathe(); scenes.voice(); return; }
  if('IntersectionObserver' in window){
    var seen={};
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ var k=map[en.target.id]; if(en.isIntersecting && !seen[k]){ seen[k]=1; scenes[k](); } }); },{threshold:.45});
    Object.keys(map).forEach(function(id){ io.observe($(id)); });
  } else Object.keys(scenes).forEach(function(k){ scenes[k](); });
})();
