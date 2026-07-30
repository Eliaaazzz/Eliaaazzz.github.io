/* elia liu — site behaviors: theme, code copy, live Watch instrument */
(function () {
  "use strict";

  /* ----- google analytics (GA4) ----- */
  var GA_ID = "G-33TX21502X";
  if (GA_ID && GA_ID.indexOf("PENDING") === -1 && location.hostname !== "localhost") {
    var gs = document.createElement("script");
    gs.async = true;
    gs.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

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

  /* ----- reveal on scroll ----- */
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var revealables = document.querySelectorAll(
      ".fig, .manifesto .shell > *, .now-panel"
    );
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach(function (el) {
      el.classList.add("rv");
      io.observe(el);
    });

    /* stagger the rows inside each list */
    document.querySelectorAll(".rows").forEach(function (list) {
      var rows = list.querySelectorAll(".row");
      rows.forEach(function (row, i) {
        row.classList.add("rv");
        row.style.transitionDelay = Math.min(i * 70, 420) + "ms";
        io.observe(row);
      });
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

  /* ----- FIG. 0 — the journey timeline (home page) ----- */
  var journey = document.getElementById("journey");
  if (journey) {
    var jNodes = journey.querySelectorAll(".j-node");
    var jDot = journey.querySelector(".j-dot");
    var jReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var jLight = function (i) {
      jNodes[i].classList.add("lit");
      if (jDot) jDot.style.left = (i / (jNodes.length - 1)) * 100 + "%";
    };
    var jAll = function () {
      jNodes.forEach(function (n) { n.classList.add("lit"); });
      if (jDot) jDot.style.left = "100%";
    };
    if (jReduced || !("IntersectionObserver" in window)) {
      jAll();
    } else {
      var jStarted = false;
      var jio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !jStarted) {
              jStarted = true;
              jio.disconnect();
              var i = 0;
              jLight(0);
              var timer = setInterval(function () {
                i++;
                if (i >= jNodes.length) { clearInterval(timer); return; }
                jLight(i);
              }, 850);
            }
          });
        },
        { threshold: 0.35 }
      );
      jio.observe(journey);
    }
  }

  /* ----- reading progress bar (post pages) ----- */
  if (document.querySelector(".post-layout")) {
    var bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var onScroll = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- voice message from elia (appears only when audio exists) ----- */
  var vm = document.getElementById("voicemsg");
  if (vm && !sessionStorage.getItem("vm-dismissed")) {
    var vmAudio = document.getElementById("vmAudio");
    var vmPlay = document.getElementById("vmPlay");
    var vmIcon = document.getElementById("vmIcon");
    var vmTime = document.getElementById("vmTime");
    var vmClose = document.getElementById("vmClose");

    var vmFmt = function (s) {
      s = Math.max(0, Math.floor(s || 0));
      return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
    };

    vmAudio.addEventListener("loadedmetadata", function () {
      vmTime.textContent = vmFmt(vmAudio.duration);
      vm.hidden = false;
      setTimeout(function () { vm.classList.add("on"); }, 1200);
    });
    /* no audio file yet -> widget stays hidden */

    vmPlay.addEventListener("click", function (e) {
      if (e.target === vmClose) return;
      if (vmAudio.paused) {
        vmAudio.play();
        vm.classList.add("playing");
        vmIcon.textContent = "❚❚";
      } else {
        vmAudio.pause();
        vm.classList.remove("playing");
        vmIcon.textContent = "▶";
      }
    });
    vmAudio.addEventListener("timeupdate", function () {
      if (!vmAudio.paused) vmTime.textContent = vmFmt(vmAudio.currentTime);
    });
    vmAudio.addEventListener("ended", function () {
      vm.classList.remove("playing");
      vmIcon.textContent = "▶";
      vmTime.textContent = vmFmt(vmAudio.duration);
    });
    vmClose.addEventListener("click", function (e) {
      e.stopPropagation();
      vmAudio.pause();
      vm.classList.remove("on");
      try { sessionStorage.setItem("vm-dismissed", "1"); } catch (err) {}
      setTimeout(function () { vm.hidden = true; }, 400);
    });
  }

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
