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
    });}
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);frame();
})();
// הדרגה ⇒ הדרך. הקשה על דרגה מזיזה את הליים ומחליפה את מסך "כל הדרך".
(function(){var L=[].slice.call(document.querySelectorAll('#rank .ladder li'));var img=document.querySelector('#rank .seeshot .shot');if(!L.length||!img)return;
function pick(li){L.forEach(function(o){var on=o===li;o.classList.toggle('on',on);o.setAttribute('aria-selected',on);var s=o.querySelector('.nm small');if(s)s.hidden=!on});var src=li.getAttribute('data-shot');if(img.getAttribute('src')===src)return;img.classList.add('swap');setTimeout(function(){img.src=src;img.onload=function(){img.classList.remove('swap')}},250)}
L.forEach(function(li){li.addEventListener('click',function(){pick(li)});li.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(li)}})});})();
