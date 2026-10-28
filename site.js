// Google Play: מתג אחד — data-play על <html> עם קישור-הרשומה; ריק ⇒ התגים מוסתרים
(function(){var u=document.documentElement.getAttribute("data-play");if(!u)return;[].forEach.call(document.querySelectorAll(".badge.play"),function(a){a.href=u;a.hidden=false})})();
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
      var p=range>0?(st.getBoundingClientRect().top-r.top)/range:0;p=Math.max(0,Math.min(1,p));s.g.style.setProperty('--sp',p.toFixed(4));if(s.g.classList.contains('five')){var N=s.txts.length-1,u=p*N,i0=Math.floor(u),f0=u-i0,f1=f0<0.65?0:(f0-0.65)/0.35;f1=f1*f1*(3-2*f1);s.g.style.setProperty('--tx',((i0+f1)/N).toFixed(4))}
      var n=s.txts.length,x=p*(n-1),best=Math.round(x);s.g.setAttribute('data-active',best+1);
      var five=s.g.classList.contains('five');s.txts.forEach(function(el,i){var a;if(five){var d=x-i;a=d<=-0.17?0:d<0?1+d/0.17:d<=0.65?1:d<0.82?1-(d-0.65)/0.17:0}else a=Math.max(0,Math.min(1,1-Math.abs(x-i)*2.2));el.style.setProperty('--a',a.toFixed(3));el.classList.toggle('on',i===best)});
      s.bars.forEach(function(b,i){b.style.setProperty('--f',Math.max(0,Math.min(1,x-i+1)).toFixed(3))});
      if(s.g.classList.contains('steps')&&window.__setMoment)window.__setMoment(p);if(s.g.classList.contains('watches')&&window.__watchMoment)window.__watchMoment(p);if(s.g.classList.contains('coach')&&window.__coachMoment)window.__coachMoment(p);
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
 el.gk.textContent=d.gk;el.gy.textContent=d.gy;el.door.textContent=d.door;if(d.ms){var mx=X0-(X0-X1)*d.ms.at;var ml=ph.querySelector('line.ms');ml.setAttribute('x1',mx);ml.setAttribute('x2',mx);var lb=ph.querySelector('.lbl.ms');lb.style.left=(mx/W*100)+'%';lb.querySelector('b').textContent=d.ms.m;ph.querySelector('[data-ms]').textContent=d.ms.t}
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

// הרגעים ב"איך זה עובד": הסט האחרון (יעד ⇒ מעלים ⇒ עוד חזרה ⇒ ההצלחה) · סרטון לכל תרגיל (▶ ⇒ הגיליון ⇒ מחליקים לבא) · הארוחה (200⇒220 ⇒ אכלתי בחוץ)
(function(){var ls=document.getElementById('lastset'),vd=document.getElementById('vidshot'),ml=document.getElementById('mealshot');if(!ls)return;var deck=document.querySelector('#todayshot .tdeck');
function seg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)))}
function on(el,cls,v){el.classList.toggle(cls,v)}
var L={rest:ls.querySelector('.rest'),set:ls.querySelector('.setn'),earn:ls.querySelector('.earned'),w:ls.querySelector('[data-w]'),r:ls.querySelector('[data-r]'),pw:ls.querySelector('.plus'),pr:ls.querySelector('.plus2'),cta:ls.querySelector('.cta')};
var V=vd?{play:vd.querySelector('.play'),list:vd.querySelector('.vlist'),fr:[].slice.call(vd.querySelectorAll('iframe'))}:null;
var M=ml?{g2:ml.querySelector('[data-g2]'),kc:ml.querySelector('[data-kcal]'),pr:ml.querySelector('[data-pro]'),plus:ml.querySelector('.plus'),out:ml.querySelector('.mout')}:null;
function live(i,v){var f=V&&V.fr[i];if(!f)return;if(v&&!f.src){f.src=f.getAttribute('data-src')}if(!v&&f.src){f.removeAttribute('src')}f.classList.toggle('live',v)}
window.__setMoment=function(p){
 // שלב 2 · מסך-היום: החפיסה מחליקה (ב-RTL הקלפים הבאים משמאל ⇒ הרצועה זזה ימינה)
 var t=seg(p*5,0.7,1.6),ts=seg(t,0.12,0.5);ts=ts*ts*(3-2*ts);if(deck)deck.style.transform='translateX('+(ts*92).toFixed(1)+'cqw)';var td=document.getElementById('todayshot');if(td){on(td.querySelector('.tring'),'hit',t>=0.54&&t<0.66);on(td,'sheet',t>=0.66)}
 // שלב 2 · 0.125–0.375
 var u=p*5;var q=seg(u,2.7,3.6);
 on(L.rest,'on',q<0.3);on(L.set,'on',q>=0.3&&q<0.82);on(L.earn,'on',q>=0.82);
  var rep=q>=0.62;L.r.textContent=rep?'10':'9';on(L.r,'lit',rep);on(L.pr,'hit',q>=0.58&&q<0.66);
 on(L.cta,'hit',q>=0.74&&q<0.82);
 // שלב 3 · 0.375–0.625
 if(V){var v=seg(u,1.7,2.6);
 on(V.play,'pulse',v>0.05&&v<0.2);on(V.play,'hit',v>=0.2&&v<0.3);on(vd,'sheet',v>=0.3);
 var sw=seg(v,0.62,0.86);V.list.style.transform='translateY(-'+(sw*58).toFixed(1)+'%)';
 live(0,v>=0.3&&sw<0.5);live(1,sw>=0.5)}
 // שלב 4 · 0.625–0.875
 if(M){var m=seg(u,3.7,4.6);
 var g=m<0.2?200:m<0.34?210:220;M.g2.textContent=g;on(M.g2,'lit',g>220-1&&m>=0.34);M.kc.textContent=612+Math.round((g-200)*1.65);M.pr.textContent=52+Math.round((g-200)*0.31);
 on(M.plus,'hit',(m>=0.17&&m<0.23)||(m>=0.31&&m<0.37));
 on(M.out,'hit',m>=0.56&&m<0.64);on(ml,'sheet',m>=0.64);on(ml,'ruled',m>=0.76)}
}})();
// השעון: הרצועה נכנסת לזון, המדרגה עולה.
(function(){var ws=document.querySelector('.watchsteps .ws');if(!ws)return;var q=function(sel){return document.querySelector('.watchsteps '+sel)};
var h2=q('[data-hr2]'),zb=[].slice.call(document.querySelectorAll('.watchsteps .zbar i')),h3=q('[data-hr3]'),r1=q('[data-rung]'),r2=q('[data-rung2]');
function seg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)))}
window.__watchMoment=function(p){var b=seg(p,0.3,0.7);h2.textContent=118+Math.round(b*4);var lit=6+Math.round(b*3);zb.forEach(function(e,i){e.classList.toggle('on',i>=9-lit)});
 var c=seg(p,0.65,1);h3.textContent=141+Math.round(c*3);var rung=c>0.6?6:5;r1.textContent=rung;r2.textContent=rung}})();

// המאמן ראה אותך: הסימון נמתח אל הצוואר ⇒ הממצא ⇒ המרשם נכנס לתוכנית, שורה אחר שורה
(function(){var c=document.getElementById('coachshot');if(!c)return;
window.__coachMoment=function(p){var t=function(k,v){c.classList.toggle(k,v)};t('marked',p>=0.08);t('found',p>=0.2);t('rx',p>=0.28);t('rx1',p>=0.32);t('rx2',p>=0.38);t('rx3',p>=0.44);t('pg2',p>=0.54);t('marked2',p>=0.6);t('found2',p>=0.68);t('rxb',p>=0.74);t('rxb1',p>=0.78);t('rxb2',p>=0.84);t('rxb3',p>=0.9)}})();

// כרטיסיות (איך זה עובד · השעון): מתקדם לבד כשהמקטע על המסך; הקשה בוחרת מאיפה ממשיכים (האוטומט ממשיך)
(function(){var CFG={train:{durs:[6000,7000,4000],moment:function(k,f){var K=[1,3][k];if(K!=null&&window.__setMoment)window.__setMoment((K-0.3+f*0.9)/5)}},how:{durs:[4000,5000,4000,5000],moment:function(){}},
 watch:{durs:[3500,5000,5000],moment:function(k,f){if(window.__watchMoment)window.__watchMoment(k===0?0:k===1?0.3+f*0.4:0.65+f*0.35)}}};
window.__steppers={};
[].forEach.call(document.querySelectorAll('[data-stepper]'),function(st){var cfg=CFG[st.getAttribute('data-stepper')]||CFG.how;
var tabs=[].slice.call(st.querySelectorAll('.tabs button')),lis=[].slice.call(st.querySelectorAll('.list li')),cur=st.querySelector('.curstep');
var N=lis.length,DUR=5000,k=-1,t0=0,fl=0,auto=!matchMedia('(prefers-reduced-motion: reduce)').matches,raf=null,on=false;
function paint(f){fl=f;var bar=lis[k]&&lis[k].querySelector('.bar'),tb=tabs[k]&&tabs[k].querySelector('.bar');if(bar)bar.style.setProperty('--f',f.toFixed(3));if(tb)tb.style.setProperty('--f',f.toFixed(3));cfg.moment(k,f)}
function show(i,f){k=(i+N)%N;st.style.setProperty('--k',k);
 tabs.forEach(function(b,j){b.classList.toggle('on',j===k);b.setAttribute('aria-selected',j===k);b.querySelector('.bar').style.setProperty('--f',0)});
 lis.forEach(function(l,j){l.classList.toggle('on',j===k);l.querySelector('.bar').style.setProperty('--f',0)});
 var li=lis[k];cur.querySelector('h3').textContent=li.querySelector('b').textContent;cur.querySelector('p').textContent=li.querySelector('small').textContent;
 if(tabs[k]&&tabs[k].scrollIntoView)try{tabs[k].scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}catch(e){}
 DUR=cfg.durs[k]||5000;t0=performance.now()-(f||0)*DUR;paint(f||0)}
function frame(now){raf=null;if(!on)return;var f=Math.min(1,(now-t0)/DUR);paint(f);if(f>=1){if(auto)show(k+1);else return}raf=requestAnimationFrame(frame)}
function start(){if(on)return;on=true;t0=performance.now()-fl*DUR;if(!raf)raf=requestAnimationFrame(frame)}
function stop(){on=false;if(raf){cancelAnimationFrame(raf);raf=null}}
tabs.concat(lis.map(function(l){return l.querySelector('button')})).forEach(function(b){b.addEventListener('click',function(){stop();show(+b.getAttribute('data-step'));start()})});
show(0,0);
if('IntersectionObserver' in window){new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()},{rootMargin:'0px 0px -45% 0px',threshold:0}).observe(st)}else start();
window.__steppers[st.getAttribute('data-stepper')]={show:function(i,f){auto=false;stop();show(i,f)}}});
window.__stepper=window.__steppers.how})();

// הציוד: הצ'יפים נדלקים לפי הגלילה. בלי JS או עם reduced-motion — כולם דלוקים.
(function(){var g=document.querySelector('.gearcard');if(!g||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var ch=[].slice.call(g.querySelectorAll('.chip[data-k]')),sum=g.querySelector('.sum'),raf=0;
function paint(){raf=0;var r=g.getBoundingClientRect(),h=innerHeight,p=(h-r.top)/(h*0.6);p=Math.max(0,Math.min(1,p));
ch.forEach(function(c){c.classList.toggle('on',p>=c.dataset.k*0.17)});sum.classList.toggle('on',p>=0.85)}
function on(){if(!raf)raf=requestAnimationFrame(paint)}
addEventListener('scroll',on,{passive:true});addEventListener('resize',on);paint()})();

// הציוד: הקשה על "טווח?" של הדמבלס מראה את המשקל הבא שאפשר להרכיב.
(function(){if(!document.getElementById("db"))return;
const S={lo:4,hi:24,st:2},STEPS=[1,1.25,2,2.5],LAST=12;
const $=id=>document.getElementById(id),f=n=>(+n.toFixed(2)).toString();
function next(){for(let w=S.lo;w<=S.hi+1e-9;w+=S.st){if(w>LAST+1e-9)return w}return null}
function paint(){$('lo').textContent=f(S.lo);$('hi').textContent=f(S.hi);$('st').textContent=f(S.st);
 $('dbr').innerHTML='<bdi dir="ltr">'+f(S.lo)+'–'+f(S.hi)+'</bdi>';$('dbr').classList.remove('ask');
 const n=next();$('nx').textContent=n?f(n)+' ק״ג':'אין משקל כבד יותר';
 $('why').textContent=n?'המשקל הבא שאפשר באמת להרכיב: \u2066+'+f(n-LAST)+'\u2069 ק״ג.':'מיצית את הטווח. הצעד הבא: עוד חזרות, או תרגיל קשה יותר.'}
$('db').onclick=()=>{$('ged').classList.add('on');$('hint').style.display='none';$('db').setAttribute('aria-expanded','true');paint()};
document.querySelectorAll('.gst button').forEach(b=>b.onclick=()=>{const k=b.dataset.k,d=+b.dataset.d;
 if(k==='st'){S.st=STEPS[Math.max(0,Math.min(STEPS.length-1,STEPS.indexOf(S.st)+d))]}
 if(k==='lo'){S.lo=Math.max(1,Math.min(S.hi-S.st,S.lo+d))}
 if(k==='hi'){S.hi=Math.max(S.lo+S.st,Math.min(60,S.hi+2*d))}
 paint()});
})();
