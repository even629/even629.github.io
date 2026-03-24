function tonav() {
  const nameContainer = document.getElementById("name-container");
  const menusItems = document.querySelectorAll(".menus_items")[1];

  if (!nameContainer) return;

  // 使用 window 属性防止重复初始化
//   if (window.navModuleInitialized) return;
//   window.navModuleInitialized = true;

  // 初始隐藏
  nameContainer.style.display = "none";

  let lastScrollTop = window.scrollY;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop && currentScroll > 60) {
      nameContainer.style.display = "";
      if (menusItems) menusItems.style.display = "none";
    } else {
      nameContainer.style.display = "none";
      if (menusItems) menusItems.style.display = "";
    }

    lastScrollTop = currentScroll;
  };
  
  window.addEventListener("scroll", handleScroll, { passive: true });

}

// 绑定事件
document.addEventListener("DOMContentLoaded", tonav);
document.addEventListener("pjax:complete", () => {
  // PJAX 后重置状态，允许重新初始化
//   window.navModuleInitialized = false;
  tonav();
});

tonav();
document.getElementById("page-name").innerText = document.title.split(" | 常想一二，不思八九")[0];


// window.addEventListener('scroll', function() {
//           const threshold = window.innerHeight * 0.3;
//           if(window.scrollY > threshold) {
//             document.body.classList.add('scrolled');
//           } else {
//             document.body.classList.remove('scrolled');
//           }
//         });
