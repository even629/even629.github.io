(() => {
  // 判断是否为英文
  const isIncludeEN = (item) => {
    const key = "/en/";
    return item.includes(key);
  };

  // 建立 重新导向到不同语言的 url
  window.loadFullPage = (url) => {
    window.location.href = url;
  };

  // 重新导向
  const eventFn = (elements, includeEN) => {
    elements.forEach((item) => {
      if (!includeEN || !isIncludeEN(item.href)) {
        item.href = `javascript:loadFullPage('${item.href}');`;
      }
    });
  };

  // 判断目前是否为英文
  const nowIncludeEN = isIncludeEN(window.location.href);
  // 修改你的 url
  if (nowIncludeEN) {
    selector = document.querySelectorAll('a[href^="/en/"]');
    // document.getElementsByTagName('html')[0].getAttribute('current-language') == 'en'
    document.documentElement.setAttribute("current-language", "en");
    document.querySelectorAll(".rightMenu-item span").forEach(function (span) {
      span.textContent = span.getAttribute("data-en");
    });
    // console.log("en");
  } else {
    selector = document.querySelectorAll('a[href^="https://even629.com/"]');
    // document.getElementsByTagName('html')[0].getAttribute('current-language') == 'zh'
    document.documentElement.setAttribute("current-language", "zh");
    document.querySelectorAll(".rightMenu-item span").forEach(function (span) {
      span.textContent = span.getAttribute("data-zh");
    });
    // console.log("zh");
  }

  eventFn(selector, nowIncludeEN);
})();
