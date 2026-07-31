/* ============================================================
   Cananéia & Ilha Comprida — render engine + EN/PT toggle
   ============================================================ */
(function(){
  "use strict";
  var C = window.CONTENT;
  // Language priority: URL (#en/#pt or ?lang=) > saved choice > English default.
  function readLang(){
    var h = (location.hash || "").replace(/^#/, "").toLowerCase();
    var q = "";
    try { q = (new URLSearchParams(location.search).get("lang") || "").toLowerCase(); } catch(e){}
    var v = (h==="en"||h==="pt") ? h : ((q==="en"||q==="pt") ? q : localStorage.getItem("cananeia-lang"));
    return v === "pt" ? "pt" : "en";
  }
  var lang = readLang();

  var el = function(id){ return document.getElementById(id); };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); };
  // pick language value from {en,pt} object
  var L = function(o){ return o ? (o[lang] != null ? o[lang] : o.en) : ""; };

  /* ---- data-i18n attribute text (nav + static headings) ---- */
  function applyAttrs(){
    document.querySelectorAll("[data-i18n]").forEach(function(node){
      var path = node.getAttribute("data-i18n").split(".");
      var ref = C, ok = true;
      for(var i=0;i<path.length;i++){ if(ref==null){ok=false;break;} ref = ref[path[i]]; }
      if(ok && ref && (ref.en!=null)){ node.textContent = L(ref); }
    });
  }

  /* ---- 02 Why ---- */
  function renderWhy(){
    el("whyGrid").innerHTML = C.why.features.map(function(f){
      var t = f[lang];
      return '<div class="fcard"><div class="fcard__ico">'+f.ico+'</div>'+
        '<h4>'+esc(t.t)+'</h4><p>'+esc(t.d)+'</p></div>';
    }).join("");
    el("why").querySelector(".pull p").textContent = L(C.why.positioning);
  }

  /* ---- 03 History ---- */
  function renderHistory(){
    el("historyBody").innerHTML = L(C.history.body).map(function(p){
      return "<p>"+esc(p)+"</p>"; }).join("");
    var f = C.history.facts;
    el("historyFacts").innerHTML = "<h4>"+esc(L(f.title))+"</h4>"+
      f.items.map(function(it){ var t=it[lang];
        return '<div class="factrow"><div class="fico">'+it.ico+'</div><div>'+
          '<b>'+esc(t.t)+'</b><span>'+esc(t.s)+'</span></div></div>'; }).join("");
  }

  /* ---- 04 Itinerary ---- */
  function renderItinerary(){
    el("timeline").innerHTML = C.itinerary.days.map(function(d){
      var meta = d.meta.map(function(m){ return '<span>'+m.ico+' '+esc(L(m))+'</span>'; }).join("");
      var acts = L(d.acts).map(function(a){ return "<li>"+esc(a)+"</li>"; }).join("");
      var callout = "";
      if(d.callout){
        var cls = d.callout.type==="warn" ? "callout callout--warn" : "callout";
        callout = '<div class="'+cls+'">'+L(d.callout)+'</div>'; // trusted inline HTML (<b>)
      }
      return '<article class="day">'+
        '<div class="day__head"><div class="day__num">'+esc(d.num)+'</div>'+
          '<div><div class="day__date">'+esc(L(d.date))+'</div>'+
          '<div class="day__title">'+esc(L(d.title))+'</div></div>'+
          '<span class="day__tag">'+esc(L(d.tag))+'</span></div>'+
        '<div class="day__body"><div class="day__meta">'+meta+'</div>'+
          '<ul class="acts">'+acts+'</ul>'+callout+'</div></article>';
    }).join("");
  }

  /* ---- 05 Tours ---- */
  function renderTours(){
    el("toursGrid").innerHTML = C.tours.cards.map(function(c){
      var items = L(c.items).map(function(i){ return "<li>"+esc(i)+"</li>"; }).join("");
      return '<div class="tcard"><div class="tcard__top"><div class="tcard__ico">'+c.ico+'</div>'+
        '<h3>'+esc(L(c.title))+'</h3></div><ul>'+items+'</ul></div>';
    }).join("");
  }

  /* ---- 06 Stay ---- */
  function renderStay(){
    el("stayTiers").innerHTML = C.stay.tiers.map(function(t){
      return '<div class="tier'+(t.featured?' tier--featured':'')+'">'+
        '<span class="tier__badge">'+esc(L(t.badge))+'</span>'+
        '<h3>'+esc(L(t.title))+'</h3>'+
        '<div class="tier__orig">'+esc(L(t.orig))+'</div>'+
        '<div class="tier__calc">'+esc(L(t.calc))+'</div>'+
        '<div class="tier__pp"><div class="pp-label">'+(lang==="pt"?"Por pessoa":"Per person")+'</div>'+
          '<div class="pp-value">'+esc(L(t.pp))+'</div>'+
          '<div class="pp-sub">'+esc(L(t.sub))+'</div></div></div>';
    }).join("");
    el("stayMaps").innerHTML = C.stay.maps.map(function(m){
      return '<a class="mapcard" href="'+esc(m.url)+'" target="_blank" rel="noopener">'+
        '<div class="mapcard__ico">'+m.ico+'</div><div><b>'+esc(m.name)+'</b><br>'+
        '<span>'+esc(L(m.desc))+'</span></div><span class="go">'+esc(L(m.go))+' ↗</span></a>';
    }).join("");
    el("stayNotes").innerHTML = L(C.stay.notes).map(function(n){ return "<li>"+esc(n)+"</li>"; }).join("");
  }

  /* ---- 07 Food ---- */
  function renderFood(){
    el("foodDishes").innerHTML = C.food.dishes.map(function(d){ var t=d[lang];
      return '<div class="chip">'+esc(t.t)+'<small>'+esc(t.s)+'</small></div>'; }).join("");
    el("foodPrices").innerHTML = C.food.prices.map(function(p){ var t=p[lang];
      return '<div class="pcard"><h4>'+esc(t.t)+'</h4>'+
        '<div class="pp-value">'+esc(L(p.pp))+'</div>'+
        '<div class="pp-sub">'+esc(L(p.sub))+'</div></div>'; }).join("");
    el("foodNotes").innerHTML = L(C.food.notes).map(function(n){ return "<li>"+esc(n)+"</li>"; }).join("");
  }

  /* ---- 08 Budget ---- */
  function renderBudget(){
    var b = C.budget;
    var head = "<thead><tr>"+L(b.table.head).map(function(h){ return "<th>"+esc(h)+"</th>"; }).join("")+"</tr></thead>";
    var body = "<tbody>"+b.table.rows.map(function(r){
      return "<tr><td>"+esc(L(r.c))+"</td><td class='grp'>"+esc(L(r.g))+"</td>"+
        "<td class='ind'>"+esc(L(r.i))+"</td></tr>"; }).join("")+"</tbody>";
    var foot = "<tfoot><tr>"+L(b.table.foot).map(function(f,i){
      return "<td class='"+(i===2?"ind":"")+"'>"+esc(f)+"</td>"; }).join("")+"</tr></tfoot>";
    el("budgetTable").innerHTML = head+body+foot;

    el("budgetScenarios").innerHTML = b.scenarios.map(function(s){
      return '<div class="scn scn--'+s.cls+'"><div class="scn__tag">'+esc(L(s.tag))+'</div>'+
        '<h3>'+esc(L(s.title))+'</h3><div class="scn__pp">'+esc(L(s.pp))+'</div>'+
        '<div class="scn__grp">'+esc(L(s.grp))+'</div><p>'+esc(L(s.desc))+'</p></div>';
    }).join("");
    el("budgetNote").textContent = L(b.note);
  }

  /* ---- 09 Videos (facade → iframe) ---- */
  function renderVideos(){
    el("videoGrid").innerHTML = C.videos.items.map(function(v){
      var thumb = "https://img.youtube.com/vi/"+v.id+"/hqdefault.jpg";
      var shortTag = v.short ? '<span class="vshort-tag">Short</span>' : '';
      var thumbCls = v.short ? "vthumb vthumb--short" : "vthumb";
      return '<div class="vcard">'+
        '<div class="'+thumbCls+'" data-id="'+v.id+'" data-short="'+(v.short?1:0)+'" role="button" tabindex="0">'+
          '<img loading="lazy" src="'+thumb+'" alt="'+esc(L(v.title))+'">'+shortTag+
          '<div class="vplay"><span></span></div></div>'+
        '<div class="vcard__body"><div class="vcard__topic">'+esc(L(v.topic))+'</div>'+
          '<h3>'+esc(L(v.title))+'</h3><p>'+esc(L(v.desc))+'</p>'+
          '<div class="vcard__meta"><a class="vtag" href="https://www.youtube.com/watch?v='+v.id+'" target="_blank" rel="noopener">▶ YouTube ↗</a></div>'+
        '</div></div>';
    }).join("");
  }

  // play button → swap facade for iframe
  document.addEventListener("click", function(e){
    var t = e.target.closest ? e.target.closest(".vthumb") : null;
    if(!t) return;
    playVideo(t);
  });
  document.addEventListener("keydown", function(e){
    if((e.key==="Enter"||e.key===" ") && e.target.classList && e.target.classList.contains("vthumb")){
      e.preventDefault(); playVideo(e.target);
    }
  });
  function playVideo(t){
    var id = t.getAttribute("data-id");
    var isShort = t.getAttribute("data-short")==="1";
    var ifr = document.createElement("iframe");
    ifr.src = "https://www.youtube.com/embed/"+id+"?autoplay=1&rel=0";
    ifr.title = "YouTube video";
    ifr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    ifr.allowFullscreen = true;
    if(isShort){ ifr.className = "short"; }
    t.replaceWith(ifr);
  }

  /* ---- 10 Tips ---- */
  function renderTips(){
    el("tipsGrid").innerHTML = C.tips.items.map(function(t){
      return '<div class="tip"><div class="tico">'+t.ico+'</div><p>'+esc(L(t))+'</p></div>';
    }).join("");
  }

  /* ---- 11 Links ---- */
  function renderLinks(){
    el("linkGrid").innerHTML = C.links.items.map(function(l){
      return '<div class="lcard"><div class="lcard__cat">'+esc(L(l.cat))+'</div>'+
        '<h3>'+esc(L(l.title))+'</h3><p>'+esc(L(l.desc))+'</p>'+
        '<a href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(L(l.btn))+' ↗</a></div>';
    }).join("");
  }

  /* ---- render all ---- */
  function renderAll(){
    document.documentElement.lang = lang;
    applyAttrs();
    renderWhy(); renderHistory(); renderItinerary(); renderTours();
    renderStay(); renderFood(); renderBudget(); renderVideos();
    renderTips(); renderLinks();
  }

  /* ---- language toggle ---- */
  function syncButtons(){
    document.querySelectorAll(".lang__btn").forEach(function(b){
      b.classList.toggle("is-active", b.getAttribute("data-lang")===lang); });
  }
  function setLang(next){
    lang = (next==="pt") ? "pt" : "en";
    try { localStorage.setItem("cananeia-lang", lang); } catch(e){}
    // Reflect the language in the URL so it is shareable and reload-stable,
    // without scrolling the page or adding a history entry.
    if(history.replaceState){ history.replaceState(null, "", "#"+lang); }
    else { location.hash = lang; }
    syncButtons();
    renderAll();
  }
  document.querySelectorAll(".lang__btn").forEach(function(btn){
    btn.addEventListener("click", function(){ setLang(btn.getAttribute("data-lang")); });
  });
  // Allow pasting a #en / #pt link to switch languages live.
  window.addEventListener("hashchange", function(){
    var v = readLang();
    if(v !== lang){ lang = v; syncButtons(); renderAll(); }
  });

  syncButtons();
  renderAll();
})();
