/**
 * toc.js - TOC scroll-spy, smooth scroll, collapse & percentage
 * Ported from Butterfly theme (source/js/main.js scrollFnToDo), adapted for Cactus:
 *   - native JS, no pjax dependency
 *   - article container: .content.e-content
 *   - TOC containers: #toc (desktop) / #toc-footer (mobile)
 *
 * Key differences from the old implementation (both now match Butterfly):
 *   1. Detection threshold: fixed 80px offset (was 25% viewport — too early)
 *   2. No atBottom hack — the fixed offset handles bottom naturally
 *   3. Return early on top === 0 (no heading active at the very top)
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var desktopToc = document.getElementById('toc');
    var mobileToc = document.getElementById('toc-footer');
    if (!desktopToc && !mobileToc) return;

    var article = document.querySelector('.post .content.e-content') ||
                  document.querySelector('.content.e-content');
    if (!article) return;

    var headings = article.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) return;

    var containers = [];
    if (desktopToc) containers.push(desktopToc);
    if (mobileToc) containers.push(mobileToc);

    var percentEl = desktopToc ? desktopToc.querySelector('.toc-percentage') : null;

    function getEleTop(el) {
      return el.getBoundingClientRect().top +
             (window.pageYOffset || document.documentElement.scrollTop);
    }

    // reading progress within the article body (0% .. 100%)
    function getScrollPercent(currentTop) {
      var articleTop = getEleTop(article);
      // Use scrollHeight — more reliable than offsetHeight for flex containers
      var articleHeight = article.scrollHeight;
      var winH = window.innerHeight;
      if (articleHeight <= winH) return '0%';
      if (currentTop + winH >= articleTop + articleHeight) return '100%';
      if (currentTop <= articleTop) return '0%';
      var p = (currentTop - articleTop) / (articleHeight - winH);
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      return Math.round(p * 100) + '%';
    }

    // cache heading positions (recomputed on resize / content change)
    var headerList = [];
    function updateHeaderPositions() {
      headerList = Array.prototype.slice.call(headings).map(function (ele) {
        return { ele: ele, top: getEleTop(ele), id: ele.id };
      });
    }
    updateHeaderPositions();

    var resizeTimer = null;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateHeaderPositions, 200);
    }
    window.addEventListener('resize', onResize);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(onResize);
      ro.observe(article);
    }

    // expose full heading text as a hover tooltip, since the visible label is
    // truncated with ellipsis when it overflows the sidebar width
    containers.forEach(function (c) {
      c.querySelectorAll('.toc-link').forEach(function (link) {
        var text = link.querySelector('.toc-text');
        if (text && !link.getAttribute('title')) {
          link.setAttribute('title', text.textContent.trim());
        }
      });
    });

    // click .toc-link -> smooth scroll to the heading
    containers.forEach(function (c) {
      c.addEventListener('click', function (e) {
        var target = e.target.closest('.toc-link');
        if (!target) return;
        e.preventDefault();
        var id = decodeURIComponent(target.getAttribute('href').replace(/^#/, ''));
        var dest = document.getElementById(id);
        if (!dest) return;
        window.scrollTo({ top: getEleTop(dest) - 20, behavior: 'smooth' });
        // mobile: close the TOC popup after navigating
        if (window.innerWidth < 900 && mobileToc) {
          mobileToc.style.display = 'none';
        }
      });
    });

    // ── scroll-spy: match Butterfly's findHeadPosition ──────────────
    // Uses a fixed 80px offset (same as Butterfly).  A heading becomes
    // active once the scroll position is 80px past its top — this keeps
    // the highlight in sync with what the reader is actually looking at.
    var detectIndex = '';

    function findHeadPosition(top) {
      if (top === 0) {
        // At the very top of the page — no heading should be active
        updateActiveClass(-1);
        return;
      }

      var currentIndex = -1;

      for (var i = 0; i < headerList.length; i++) {
        if (top > headerList[i].top - 80) {
          currentIndex = i;
        } else {
          break;
        }
      }

      if (detectIndex === currentIndex) return;
      detectIndex = currentIndex;
      updateActiveClass(currentIndex);
      scrollTocToFollow(currentIndex);
    }

    function updateActiveClass(currentIndex) {
      containers.forEach(function (c) {
        c.querySelectorAll('.active').forEach(function (el) {
          el.classList.remove('active');
        });
        if (currentIndex < 0) return;
        var links = c.querySelectorAll('.toc-link');
        var active = links[currentIndex];
        if (!active) return;
        active.classList.add('active');
      });
    }

    // auto-scroll TOC so the active item stays visible in the sidebar
    // Simplified to match Butterfly's autoScrollToc: center the active item
    function scrollTocToFollow(currentIndex) {
      if (currentIndex < 0) return;
      containers.forEach(function (c) {
        var containerHeight = c.clientHeight;
        var scrollMax = c.scrollHeight - containerHeight;
        if (scrollMax <= 0) return;
        var links = c.querySelectorAll('.toc-link');
        var active = links[currentIndex];
        if (!active) return;
        var itemOffsetTop = active.offsetTop;
        var itemHeight = active.clientHeight;
        var scrollTop = c.scrollTop;
        var offset = itemOffsetTop - scrollTop;
        var middlePosition = (containerHeight - itemHeight) / 2;
        if (offset !== middlePosition) {
          c.scrollTop = scrollTop + (offset - middlePosition);
        }
      });
    }

    // ── scroll handler ─────────────────────────────────────────────
    function onScroll() {
      var currentTop = window.scrollY || document.documentElement.scrollTop;
      if (percentEl) percentEl.textContent = getScrollPercent(currentTop);
      findHeadPosition(currentTop);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          try {
            onScroll();
          } catch (e) {
            // prevent ticking from getting stuck on error
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    onScroll();
  });
})();
