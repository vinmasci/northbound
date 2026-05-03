(function () {
  var KEY = "northbound:lastChapter";
  var SCROLL_KEY_PREFIX = "northbound:scroll:";

  var path = window.location.pathname;
  var match = path.match(/chapter-(\d{2})\.html/);

  if (match) {
    var ch = match[1];
    try { localStorage.setItem(KEY, ch); } catch (e) {}

    var scrollKey = SCROLL_KEY_PREFIX + ch;
    try {
      var saved = parseInt(localStorage.getItem(scrollKey) || "0", 10);
      if (saved > 0 && !window.location.hash) {
        window.scrollTo(0, saved);
      }
    } catch (e) {}

    var saveScroll = function () {
      try { localStorage.setItem(scrollKey, String(window.scrollY)); } catch (e) {}
    };
    var t;
    window.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(saveScroll, 200);
    }, { passive: true });
    window.addEventListener("beforeunload", saveScroll);
  }

  if (path.endsWith("/") || path.endsWith("index.html") || path === "" || /\/northbound\/?$/.test(path)) {
    try {
      var last = localStorage.getItem(KEY);
      if (last) {
        var c = document.getElementById("continue");
        if (c) {
          c.style.display = "block";
          var link = c.querySelector("a");
          if (link) {
            link.href = "chapter-" + last + ".html";
            var label = c.querySelector(".chapter-label");
            if (label) label.textContent = "Chapter " + parseInt(last, 10);
          }
        }
      }
    } catch (e) {}
  }
})();
