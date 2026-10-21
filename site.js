// ibra.fit — תנועה בלבד. הטקסט נראה גם בלי הקובץ הזה.
document.documentElement.classList.add('js');
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // הרגע המתוזמר היחיד: הסיום (כוריאוגרפיית-הספלאש)
  var items = document.querySelectorAll('[data-splash]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('go');
        io.unobserve(en.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (e) { io.observe(e); });
  } else { items.forEach(function (e) { e.classList.add('go'); }); }
  // הכותרת: הבאדג' בה נדלק רק כשההירו מחוץ למסך (ה-CSS מחיל זאת בטלפון בלבד).
  var hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      document.documentElement.classList.toggle('past-hero', !es[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }
  if (reduced) return;

  // התקדמות-גלילה לכל [data-p]: 0 כשנכנס מלמטה, 1 כשמרכזו עבר את מרכז-המסך. כותב --p; ה-CSS עושה את השאר.
  var ps = [].slice.call(document.querySelectorAll('[data-p]')), poster = document.querySelector('.poster'), ticking = false;
  function frame() {
    ticking = false;
    var vh = innerHeight;
    ps.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = (vh - r.top) / (vh + r.height);       // 0 = top edge at bottom of screen, 1 = bottom edge at top
      p = Math.max(0, Math.min(1, p));
      el.style.setProperty('--p', p.toFixed(3));
      if (el === poster) {
        var n = Math.min(6, Math.floor(p * 14));     // שש המילים נדלקות בזו-אחר-זו בשליש הראשון של המעבר
        el.className = 'poster' + (n ? ' l' + n : '');
      }
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); frame();

  // המילה המתחלפת: ChatGPT ⇒ Claude ⇒ Gemini, שני סיבובים, ונעצרת על ChatGPT.
  var el = document.querySelector('.rot'); if (!el) return;
  var words = el.getAttribute('data-words').split('|');
  var probe = document.createElement('span'); probe.className = 'rot'; probe.style.position = 'absolute'; probe.style.visibility = 'hidden';
  el.parentNode.appendChild(probe);
  var w = 0; words.forEach(function (t) { probe.textContent = t; w = Math.max(w, probe.offsetWidth); });
  probe.remove(); el.style.minWidth = w + 'px';
  var i = 0, left = words.length * 2;
  function next() {
    el.classList.add('fade');
    setTimeout(function () { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove('fade'); }, 230);
    if (--left > 0) setTimeout(next, 2400);
  }
  setTimeout(next, 2400);
})();

// סצנות: במה נעוצה, והתקדמות-הגלילה דרך המקטע (0→1) מזיזה את המסכים בתוך המכשיר ומחליפה את הטקסט. רציף והפיך, בלי ספים.
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var scenes=[].slice.call(document.querySelectorAll('[data-scene]'));if(!scenes.length)return;
  var S=scenes.map(function(g){return{g:g,txts:[].slice.call(g.querySelectorAll('.txts > *')),bars:[].slice.call(g.querySelectorAll('.bars i'))}});
  var ticking=false;
  function frame(){ticking=false;var vh=innerHeight;
    S.forEach(function(s){var r=s.g.getBoundingClientRect();var st=s.g.querySelector('.stage');var range=r.height-st.offsetHeight;
      var p=range>0?(st.getBoundingClientRect().top-r.top)/range:0;p=Math.max(0,Math.min(1,p));s.g.style.setProperty('--sp',p.toFixed(4));
      var n=s.txts.length,x=p*(n-1),best=Math.round(x);s.g.setAttribute('data-active',best+1);
      s.txts.forEach(function(el,i){var a=Math.max(0,Math.min(1,1-Math.abs(x-i)*2.2));el.style.setProperty('--a',a.toFixed(3));el.classList.toggle('on',i===best)});
      s.bars.forEach(function(b,i){b.style.setProperty('--f',Math.max(0,Math.min(1,x-i+1)).toFixed(3))});
      if(s.g.classList.contains('steps')&&window.__setMoment)window.__setMoment(p);if(s.g.classList.contains('watches')&&window.__watchMoment)window.__watchMoment(p);
    });}
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);frame();
})();
// הדרגה ⇒ הדרך. הקשה על דרגה מזיזה את הליים ואת התג, והכרטיס "לאן ומתי" מצטייר מחדש:
// הקו מתעקם לצורה החדשה (אינטרפולציה בין 40 הנקודות), המספרים מתגלגלים, השנים זזות.
// הנתונים: מסכי "לאן ומתי" של האפליקציה לשלוש דרגות-יעד, על נתונים אמיתיים (21.10.2026).
(function(){var L=[].slice.call(document.querySelectorAll('#rank .ladder li[data-road]'));var ph=document.getElementById('roadphone');if(!L.length||!ph)return;
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
var X0=293,X1=7,TOP=26,BOT=130,W=300;
var el={line:ph.querySelector('.line'),est:ph.querySelector('.est'),fill:ph.querySelector('.fill'),goal:ph.querySelector('.goal'),today:ph.querySelector('.today'),halo:ph.querySelector('.halo'),split:ph.querySelector('.split'),peak:ph.querySelector('.lbl.peak'),dots:ph.querySelector('.dots'),esl:ph.querySelector('.years .esl'),gk:ph.querySelector('[data-gk]'),gy:ph.querySelector('[data-gy]'),door:ph.querySelector('[data-door]'),gw:ph.querySelector('[data-gw]'),gf:ph.querySelector('[data-gf]')};
function pt(kg,j,lo,hi){return {x:X0-(X0-X1)*j/(kg.length-1),y:TOP+(hi-kg[j])/(hi-lo)*(BOT-TOP)}}
function path(kg,from,to,lo,hi){var d='';for(var j=from;j<=to;j++){var p=pt(kg,j,lo,hi);d+=(j===from?'M':'L')+p.x.toFixed(1)+' '+p.y.toFixed(1)}return d}
function extrema(kg){var out=[];for(var j=1;j<kg.length-1;j++){var a=kg[j]-kg[j-1],b=kg[j+1]-kg[j];if(a*b<0&&Math.abs(a)+Math.abs(b)>0.6)out.push(j)}return out}
function draw(kg,d,final){var n=kg.length,lo=Math.min.apply(null,kg)-1.5,hi=Math.max.apply(null,kg)+0.8,ef=d.estFrom==null?n-1:d.estFrom;
 el.line.setAttribute('d',path(kg,0,Math.min(ef,n-1),lo,hi));
 if(d.estFrom!=null){el.est.style.opacity=1;el.est.setAttribute('d',path(kg,Math.max(0,ef-1),n-1,lo,hi))}else{el.est.style.opacity=0}
 el.fill.setAttribute('d',path(kg,0,n-1,lo,hi)+'L'+X1+' '+BOT+'L'+X0+' '+BOT+'Z');
 var g=pt(kg,n-1,lo,hi),t=pt(kg,0,lo,hi);el.goal.setAttribute('cx',g.x);el.goal.setAttribute('cy',g.y);el.today.setAttribute('cy',t.y);el.halo.setAttribute('cy',t.y);
 if(d.estFrom!=null){var s=pt(kg,ef,lo,hi);el.split.style.opacity=1;el.split.setAttribute('x1',s.x);el.split.setAttribute('x2',s.x);el.split.setAttribute('y1',s.y+7)}else el.split.style.opacity=0;
 var pk=kg.indexOf(Math.max.apply(null,kg)),pp=pt(kg,pk,lo,hi);el.peak.style.left=Math.max(0,pp.x/W*100-6)+'%';el.peak.style.top=Math.max(0,pp.y/150*100-12)+'%';
 if(final){var ex=extrema(kg),cs=el.dots.children;for(var i=0;i<cs.length;i++){var c=cs[i];if(i<ex.length){var p=pt(kg,ex[i],lo,hi);c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.classList.toggle('e',ex[i]>=ef);c.style.opacity=1}else c.style.opacity=0}}
 else{var cs2=el.dots.children;for(var k=0;k<cs2.length;k++)cs2[k].style.opacity=0}}
var cur=null,raf=null;
function tween(e,from,to,ms){var t0=null;function f(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/ms);p=1-Math.pow(1-p,3);e.textContent=Math.round(from+(to-from)*p);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f);setTimeout(function(){e.textContent=to},ms+80)}
function apply(d){el.peak.querySelector('b').textContent=d.peak;['y1','y2','y3'].forEach(function(c,k){ph.querySelector('.years .'+c).style.right=(d.years[k]*100)+'%'});el.esl.style.opacity=d.est?1:0;
 el.gk.textContent=d.gk;el.gy.textContent=d.gy;el.door.textContent=d.door;
 if(!cur||reduced){el.gw.textContent=d.gw;el.gf.textContent=d.gf;draw(d.kg,d,true);cur=d;return}
 tween(el.gw,cur.gw,d.gw,700);tween(el.gf,cur.gf,d.gf,700);
 var from=cur.kg,to=d.kg,t0=null;if(raf)cancelAnimationFrame(raf);
 function f(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/800);p=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;var kg=from.map(function(v,i){return v+(to[i]-v)*p});draw(kg,d,p>=1);if(p<1)raf=requestAnimationFrame(f)}
 raf=requestAnimationFrame(f);setTimeout(function(){if(cur===d)draw(d.kg,d,true)},900);cur=d}
function pick(li){L.forEach(function(o){var on=o===li;o.classList.toggle('on',on);o.setAttribute('aria-selected',on);var s=o.querySelector('.nm small');if(s)s.hidden=!on});apply(JSON.parse(li.getAttribute('data-road')))}
L.forEach(function(li){li.addEventListener('click',function(){pick(li)});li.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(li)}})});
apply(JSON.parse(document.querySelector('#rank .ladder li.on').getAttribute('data-road')));
// הכניסה: הקו מצטייר פעם אחת כשהכרטיס נכנס למסך.
if(!reduced&&'IntersectionObserver' in window){var len=el.line.getTotalLength();el.line.style.strokeDasharray=len+' '+len;el.line.style.strokeDashoffset=len;el.dots.style.opacity=0;
 new IntersectionObserver(function(es,io){if(!es[0].isIntersecting)return;io.disconnect();el.line.style.transition='stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';el.line.style.strokeDashoffset=0;setTimeout(function(){el.line.style.strokeDasharray='';el.line.style.transition='';el.dots.style.transition='opacity .4s';el.dots.style.opacity=1},1500)},{threshold:.35}).observe(ph)}})();

// הסט: בגלילה דרך שלב 2 — הכפתור נלחץ, המסך מתחלף למנוחה, השעון סופר.
(function(){var hs=document.getElementById('setshot');if(!hs)return;var clk=hs.querySelector('[data-clock]');
function mmss(sec){return Math.floor(sec/60)+':'+('0'+Math.floor(sec%60)).slice(-2)}
window.__setMoment=function(p){var q=Math.max(0,Math.min(1,(p-0.38)/0.3));hs.classList.toggle('pressed',q>0.2&&q<0.36);hs.classList.toggle('resting',q>=0.36);var sec=90-Math.round(Math.max(0,(q-0.36)/0.64)*38);clk.textContent=mmss(sec)}})();
// השעון: המנוחה סופרת, הדופק נושם, הרצועה נכנסת לזון, המדרגה עולה.
(function(){var ws=document.querySelector('#connect .ws');if(!ws)return;var q=function(sel){return document.querySelector('#connect '+sel)};
var wc=q('[data-wclock]'),h1=q('[data-hr1]'),zc=q('[data-zclock]'),h2=q('[data-hr2]'),zb=[].slice.call(document.querySelectorAll('#connect .zbar i')),lc=q('[data-lclock]'),h3=q('[data-hr3]'),r1=q('[data-rung]'),r2=q('[data-rung2]');
function mmss(sec){return Math.floor(sec/60)+':'+('0'+Math.floor(sec%60)).slice(-2)}
function seg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)))}
window.__watchMoment=function(p){var a=seg(p,0,0.4);wc.textContent=mmss(68-Math.round(a*16));h1.textContent=134-Math.round(a*3);
 var b=seg(p,0.3,0.7);zc.textContent='12:'+(39+Math.round(b*16));h2.textContent=118+Math.round(b*4);var lit=6+Math.round(b*3);zb.forEach(function(e,i){e.classList.toggle('on',i>=9-lit)});
 var c=seg(p,0.65,1);lc.textContent='10:'+(16+Math.round(c*42));h3.textContent=141+Math.round(c*3);var rung=c>0.6?6:5;r1.textContent=rung;r2.textContent=rung}})();
