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

  /* ----- zh/EN toggle (home page) ----- */
  var langBtn = document.getElementById("langBtn");
  if (langBtn) {
    var ZH = {
      ".tblock .role":
        '我教批处理系统<span class="gs">永远</span>跑下去 —— 为 <a href="https://github.com/apache/beam/pulls?q=is%3Apr+author%3AEliaaazzz">Apache Beam</a> 构建的 unbounded sources 与 <span class="gs">Watch</span> transform，Google Summer of Code 2026。流式系统、机器学习研究、亚毫秒热路径。',
      ".tblock .cta .btn.primary": "读 GSoC 全文 →",
      ".tblock .cta .btn:not(.primary)": "看工程履历",
      ".tblock .meta > div:nth-child(1)": "<b>图纸</b>eliaaazzz.github.io",
      ".tblock .meta > div:nth-child(2)": "<b>版本</b>2026-07 · GSoC 版",
      ".tblock .meta > div:nth-child(3)": "<b>坐标</b>澳大利亚 · 墨尔本",
      ".tblock .meta > div:nth-child(4)": "<b>状态</b>开放 2027 应届机会",
      ".crumbs-row .crumbs a:nth-child(1)": "博客",
      ".crumbs-row .crumbs a:nth-child(2)": "工程",
      ".crumbs-row .crumbs a:nth-child(3)": "研究",
      ".crumbs-row .crumbs a:nth-child(6)": "邮箱",
      "#fig0 span:nth-child(2)":
        "实时 —— 我合进 Beam 的 Watch transform（PR #39023），来喂它。",
      ".sim-head .t":
        "Watch(<b>list_bucket</b>, poll_interval=3s) —— 每个文件<b>恰好发射一次</b>",
      ".sim-body .lane:nth-child(1) h4": "存储桶 ./landing",
      ".sim-body .lane:nth-child(3) h4": "已发射（下游）",
      "#log": "待命 —— 往桶里丢个文件试试。",
      "#add": "+ 丢一个新文件",
      "#dup": "+ 丢一个重复文件",
      ".sim-controls .hint": "去重 = blake2b(key) 对照已存档状态",
      ".sim-note":
        '这个小部件和真实语义一致：每次轮询都重新列出整个桶，但状态记得已经发射过什么 —— 重复的被划掉，崩溃重启也不会重发。<a href="/blog/beam-python-watch-transform/">看真实实现 →</a>',
      "#fig1 span:nth-child(2)": "写作",
      "#fig1 a": "全部文章 →",
      "#fig2 span:nth-child(2)": "精选作品",
      "#fig2 a": "工程页 →",
      "#fig3 span:nth-child(2)": "研究",
      "#fig3 a": "研究页 →",
      "#fig4 span:nth-child(2)": "此刻",
      ".manifesto .shell > p:first-child":
        '教批处理系统<span class="gs">永远</span>跑下去。unbounded sources、诚实的<span class="gs">水印</span>、每个文件恰好<span class="gs">一次</span> —— 已合入 Apache Beam。',
      ".manifesto .sig": "—— GSOC 2026 · PYTHON SDK · 经 BEAM PMC 主席评审",
      ".now-panel .now-row:nth-child(1) .k": "在建",
      ".now-panel .now-row:nth-child(2) .k": "评审中",
      ".now-panel .now-row:nth-child(3) .k": "在研",
      ".now-panel .now-row:nth-child(4) .k": "状态",
      ".now-panel .now-row:nth-child(4) .v":
        "墨尔本大学计算机科学大四在读 —— 开放 2027 应届机会",
      ".foot-big": '一起造点能<span class="gs">永远</span>跑下去的东西。',
      ".foot-links a:nth-child(2)": "领英",
      ".foot-links a:nth-child(3)": "邮箱",
      ".foot-links a:nth-child(5)": "博客",
      ".foot-fine span:nth-child(2)": "纯手写 —— 无框架",
      ".foot-fine span:nth-child(3)": "澳大利亚 · 墨尔本",
    };
    var applyLang = function (zh) {
      Object.keys(ZH).forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        if (zh) {
          if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
          el.innerHTML = ZH[sel];
        } else if (el.dataset.en !== undefined) {
          el.innerHTML = el.dataset.en;
        }
      });
      document.documentElement.classList.toggle("zh", zh);
      document.documentElement.setAttribute("lang", zh ? "zh-CN" : "en");
      langBtn.textContent = zh ? "EN" : "中";
      langBtn.setAttribute(
        "aria-label",
        zh ? "Switch to English" : "切换到中文"
      );
    };
    var zhOn = false;
    try {
      zhOn = localStorage.getItem("lang") === "zh";
    } catch (e) {}
    if (zhOn) applyLang(true);
    langBtn.addEventListener("click", function () {
      zhOn = !zhOn;
      try {
        localStorage.setItem("lang", zhOn ? "zh" : "en");
      } catch (e) {}
      applyLang(zhOn);
    });
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
