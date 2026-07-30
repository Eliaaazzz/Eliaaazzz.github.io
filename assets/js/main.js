/* elia liu — site behaviors: theme, code copy, live Watch instrument */
(function () {
  "use strict";

  /* ----- theme toggle (initial theme set inline in <head>) ----- */
  var toggle = document.querySelector(".theme-btn");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ----- syntax highlighting ----- */
  if (window.hljs) {
    document.querySelectorAll(".codeblock pre code").forEach(function (el) {
      window.hljs.highlightElement(el);
    });
  }

  /* ----- copy buttons on code blocks ----- */
  document.querySelectorAll(".codeblock").forEach(function (block) {
    var bar = block.querySelector(".codeblock-bar");
    var code = block.querySelector("pre code");
    if (!bar || !code || !navigator.clipboard) return;
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.textContent = "copied";
        btn.classList.add("done");
        setTimeout(function () {
          btn.textContent = "copy";
          btn.classList.remove("done");
        }, 1600);
      });
    });
    bar.appendChild(btn);
  });

  /* ----- FIG. 0 — the live Watch instrument (home page only) ----- */
  var sim = document.getElementById("sim");
  if (sim) {
    var NAMES = ["a.csv", "b.csv", "c.csv", "d.csv", "e.csv", "f.csv", "g.csv"];
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bucket = [];
    var seen = {};
    var polls = 0;
    var nextIdx = 0;
    var lastDropped = null;

    var $ = function (id) { return document.getElementById(id); };
    var fmt = function (d) { return d.toTimeString().slice(0, 8); };

    var chip = function (name, cls) {
      var s = document.createElement("span");
      s.className = "chip" + (cls ? " " + cls : "");
      s.textContent = name;
      return s;
    };

    var render = function () {
      var b = $("bucket");
      b.innerHTML = "";
      var counts = {};
      bucket.forEach(function (f) {
        counts[f] = (counts[f] || 0) + 1;
        b.appendChild(chip(f, counts[f] > 1 || seen[f] ? "dup" : ""));
      });
    };

    $("add").addEventListener("click", function () {
      if (nextIdx >= NAMES.length) {
        $("log").textContent =
          "bucket is full — this demo caps at " + NAMES.length + " files.";
        return;
      }
      lastDropped = NAMES[nextIdx++];
      bucket.push(lastDropped);
      render();
      $("log").textContent =
        "dropped " + lastDropped + " into ./landing — next poll will see it.";
    });

    $("dup").addEventListener("click", function () {
      if (!lastDropped) {
        $("log").textContent = "drop a new file first, then try a duplicate.";
        return;
      }
      bucket.push(lastDropped);
      render();
      $("log").textContent =
        "dropped " + lastDropped + " AGAIN — watch the dedup catch it.";
    });

    setInterval(function () {
      polls++;
      $("pollno").textContent = "poll #" + polls;
      if (!bucket.length) return;

      var doEmit = function () {
        var news = 0;
        var dups = 0;
        bucket.forEach(function (f) {
          if (seen[f]) {
            dups++;
          } else {
            seen[f] = 1;
            news++;
            var c = chip(f, "new");
            var t = document.createElement("span");
            t.className = "ts";
            t.textContent = fmt(new Date());
            c.appendChild(t);
            $("out").appendChild(c);
          }
        });
        render();
        if (news > 0) $("wm").textContent = "watermark " + fmt(new Date());
        $("log").innerHTML =
          "poll #" + polls + " → " + bucket.length +
          ' file(s) listed, <span class="ok">' + news +
          " new emitted</span>, " + dups + " duplicate(s) dropped.";
      };

      if (reduced) {
        doEmit();
      } else {
        var chips = $("bucket").children;
        for (var i = 0; i < chips.length; i++) chips[i].classList.add("scan");
        setTimeout(doEmit, 420);
      }
    }, 3000);
  }
})();
