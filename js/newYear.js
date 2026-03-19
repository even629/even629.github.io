// function newYear() {
//   if (!document.querySelector("#newYear")) return;
//   // 新年时间戳 and 星期对象
//   let SpringFestival = new Date("2026-02-17 00:00:00");
//   let newYear = SpringFestival.getTime() / 1000,
//     week = {
//       0: "周日",
//       1: "周一",
//       2: "周二",
//       3: "周三",
//       4: "周四",
//       5: "周五",
//       6: "周六",
//     };
//   function nol(h) {
//     h = Number(h);
//     return h > 9 ? h : "0" + h;
//   }
//   time();

//   function time() {
//     // 现在 时间对象
//     let now = new Date();

//     // 右下角 今天
//     document.querySelector("#newYear .today").innerHTML =
//       now.getFullYear() +
//       "-" +
//       (now.getMonth() + 1) +
//       "-" +
//       now.getDate() +
//       " " +
//       week[now.getDay()];

//     // 现在与新年相差秒数
//     let second = newYear - Math.round(now.getTime() / 1000);

//     // 小于0则表示已经过年
//     if (second < 0) {
//       window.newYearTimer = null;
//       document.querySelector("#newYear .title").innerHTML = "Happy New Year!";
//       document.querySelector("#newYear .newYear-time").innerHTML =
//         '<span class="happyNewYear">新年快乐</span>';
//     } else {
//       // 大于0则还未过年
//       document.querySelector("#newYear .title").innerHTML =
//         "距离" + SpringFestival.getFullYear() + "年春节：";
//       // 大于一天则直接渲染天数
//       if (second > 86400) {
//         document.querySelector(
//           "#newYear .newYear-time"
//         ).innerHTML = `<span class="day">${Math.ceil(
//           second / 86400
//         )}</span><span class="unit">天</span>`;
//       } else {
//         // 小于一天则使用时分秒计时。
//         let h = nol(parseInt(second / 3600));
//         second %= 3600;
//         let m = nol(parseInt(second / 60));
//         second %= 60;
//         let s = nol(second);
//         document.querySelector(
//           "#newYear .newYear-time"
//         ).innerHTML = `<span class="time">${h}:${m}:${s}</span></span>`;
//         // 计时
//         if (!window.newYearTimer) window.newYearTimer = setInterval(time, 1000);
//       }
//     }
//   }
// }
function getSpringFestivalDate(year) {
  const solar = solarlunar.lunar2solar(year, 1, 1);
  if (!solar || solar === -1) {
    console.error("无法计算春节日期:", year);
    return null;
  }
  return new Date(solar.cYear, solar.cMonth - 1, solar.cDay);
}

function newYear() {
  const widget = document.querySelector("#newYear");
  if (!widget) return;

  const now = new Date();
  const currentYear = now.getFullYear();

  // 找出最接近当前时间的春节（可能是去年、今年或明年）
  let targetFestival = null;
  let targetYear = null;

  // 检查去年、今年、明年三个春节
  for (let y of [currentYear - 1, currentYear, currentYear + 1]) {
    const date = getSpringFestivalDate(y);
    if (!date) continue;
    // 如果当前时间 <= 春节后1个月，则这个春节是相关的
    const oneMonthAfter = new Date(date);
    oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
    if (now <= oneMonthAfter) {
      targetFestival = date;
      targetYear = y;
      break; // 找到第一个满足条件的（最近的）
    }
  }

  if (!targetFestival) {
    // 不在任何春节窗口期内 → 隐藏
    widget.style.display = "none";
    return;
  }

  // 计算窗口期
  const twoMonthsBefore = new Date(targetFestival);
  twoMonthsBefore.setMonth(twoMonthsBefore.getMonth() - 2);

  const oneMonthAfter = new Date(targetFestival);
  oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

  // 如果当前不在 [春节-2月, 春节+1月] → 隐藏
  if (now < twoMonthsBefore || now > oneMonthAfter) {
    widget.style.display = "none";
    return;
  }

  // 在窗口期内 → 显示
  widget.style.display = "";

  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  function updateTime() {
    const now = new Date();
    document.querySelector("#newYear .today").innerHTML =
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${week[now.getDay()]}`;

    const secondsLeft = Math.floor(targetFestival.getTime() / 1000) - Math.floor(now.getTime() / 1000);
    const titleEl = document.querySelector("#newYear .title");
    const timeEl = document.querySelector("#newYear .newYear-time");

    if (secondsLeft < 0) {
      // 春节已过，但仍在 +1 个月内 → 显示祝福
      if (window.newYearTimer) {
        clearInterval(window.newYearTimer);
        window.newYearTimer = null;
      }
      titleEl.innerHTML = "Happy New Year!";
      timeEl.innerHTML = '<span class="happyNewYear">新年快乐</span>';
    } else {
      // 春节未到
      titleEl.innerHTML = `距离${targetYear}年春节：`;
      if (secondsLeft > 86400) {
        const days = Math.ceil(secondsLeft / 86400);
        timeEl.innerHTML = `<span class="day">${days}</span><span class="unit">天</span>`;
        if (window.newYearTimer) {
          clearInterval(window.newYearTimer);
          window.newYearTimer = null;
        }
      } else {
        const h = padZero(Math.floor(secondsLeft / 3600));
        const m = padZero(Math.floor((secondsLeft % 3600) / 60));
        const s = padZero(secondsLeft % 60);
        timeEl.innerHTML = `<span class="time">${h}:${m}:${s}</span>`;
        if (!window.newYearTimer) {
          window.newYearTimer = setInterval(updateTime, 1000);
        }
      }
    }
  }

  updateTime();
}

// Swiper 初始化
function newYearSwiper() {
  var swiper = new Swiper(".newYear-slider", {
    passiveListeners: true,
    loop: true,
    autoplay: {
      disableOnInteraction: true,
      delay: 5000,
    },
    effect: "fade",
    mousewheel: true,
    autoHeight: true,
  });

  var container = document.querySelector(".newYear-slider");
  if (container) {
    container.onmouseenter = () => swiper.autoplay.stop();
    container.onmouseleave = () => swiper.autoplay.start();
  }
}

// PJAX 兼容
function whenDOMReady() {
  newYear();
  newYearSwiper();
}

whenDOMReady();
document.addEventListener("pjax:complete", whenDOMReady);