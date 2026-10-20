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
  // הסולם: הקשה על דמות בוחרת אותה — הדלתאות שלה בליים, ולוח-הפירוט מתחלף. השם לא זז.
  var tabs = [].slice.call(document.querySelectorAll('.rk'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.classList.toggle('on', on); o.setAttribute('aria-selected', on);
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });
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
        var n = Math.min(6, Math.floor(p * 9));      // שש שורות נדלקות בזו-אחר-זו במחצית הראשונה של המעבר
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

(function(){var scenes=document.querySelectorAll('[data-scene]');if(!scenes.length)return;
function upd(){var mid=innerHeight*0.5;scenes.forEach(function(g){var st=g.querySelectorAll(':scope > :not(.pin)'),best=1,bd=1e9;st.forEach(function(el,i){var r=el.getBoundingClientRect();var d=Math.abs((r.top+r.bottom)/2-mid);if(d<bd){bd=d;best=i+1}});g.setAttribute('data-active',best);st.forEach(function(el,i){el.classList.toggle('on',i+1===best)})})}
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();})();

(function(){var g=document.querySelector('.steps'),dots=document.querySelectorAll('.dots i');if(!g||!dots.length)return;var cards=g.querySelectorAll('.step');
g.addEventListener('scroll',function(){var c=g.getBoundingClientRect(),mid=c.left+c.width/2,best=0,bd=1e9;cards.forEach(function(el,i){var r=el.getBoundingClientRect();var d=Math.abs((r.left+r.right)/2-mid);if(d<bd){bd=d;best=i}});dots.forEach(function(d,i){d.classList.toggle('on',i===best)})},{passive:true});})();
(function(){var w=document.querySelector('.watches'),ch=document.querySelectorAll('.wchips button');if(!w||!ch.length)return;var figs=w.querySelectorAll('figure');
ch.forEach(function(b,i){b.addEventListener('click',function(){w.setAttribute('data-active',i+1);ch.forEach(function(x,j){x.classList.toggle('on',j===i);x.setAttribute('aria-selected',j===i)});figs.forEach(function(f,j){f.classList.toggle('on',j===i)})})});})();
