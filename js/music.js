// var anzhiyu = {
//   // 音乐节目切换背景
//   changeMusicBg: function (isChangeBg = true) {
//     if (window.location.pathname != "/music/") {
//       return;
//     }
//     const anMusicBg = document.getElementById("an_music_bg");
//     console.log(anMusicBg);

//     if (isChangeBg) {
//       // player listswitch 会进入此处
//       const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
//       anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
//     } else {
//       // 第一次进入，绑定事件，改背景
//       let timer = setInterval(() => {
//         const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
//         // 确保player加载完成
//         console.info(anMusicBg);
//         if (musiccover) {
//           clearInterval(timer);
//           anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
//           // 绑定事件
//           anzhiyu.addEventListenerChangeMusicBg();

//           // 暂停nav的音乐
//           if (
//             document.querySelector("#nav-music meting-js").aplayer &&
//             !document.querySelector("#nav-music meting-js").aplayer.audio.paused
//           ) {
//             anzhiyu.musicToggle();
//           }
//         }
//       }, 100);
//     }
//   },
//   addEventListenerChangeMusicBg: function () {
//     const anMusicPage = document.getElementById("anMusic-page");
//     const aplayerIconMenu = anMusicPage.querySelector(
//       ".aplayer-info .aplayer-time .aplayer-icon-menu"
//     );

//     anMusicPage
//       .querySelector("meting-js")
//       .aplayer.on("loadeddata", function () {
//         anzhiyu.changeMusicBg();
//         console.info("player loadeddata");
//       });

//     aplayerIconMenu.addEventListener("click", function () {
//       document.getElementById("menu-mask").style.display = "block";
//       document.getElementById("menu-mask").style.animation =
//         "0.5s ease 0s 1 normal none running to_show";
//     });

//     document.getElementById("menu-mask").addEventListener("click", function () {
//       if (window.location.pathname != "/music/") return;
//       anMusicPage
//         .querySelector(".aplayer-list")
//         .classList.remove("aplayer-list-hide");
//     });
//   },
// };

// // 调用
// anzhiyu.changeMusicBg(true);

var anzhiyu = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    if (window.location.pathname != "/music/") {
      return;
    }
    const anMusicBg = document.getElementById("an_music_bg");

    if (isChangeBg) {
      // player listswitch 会进入此处
      const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
      if (musiccover && anMusicBg) {
        anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
      }
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(() => {
        const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
        // 确保player加载完成
        // console.info(anMusicBg);
        if (musiccover) {
          clearInterval(timer);
          if (anMusicBg) {
            anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
          }
          // 绑定事件
          anzhiyu.addEventListenerChangeMusicBg();

          // 暂停nav的音乐
          const navMusicPlayer = document.querySelector(
            "#nav-music meting-js"
          )?.aplayer;
          if (navMusicPlayer && !navMusicPlayer.audio.paused) {
            anzhiyu.musicToggle();
          }
        }
      }, 100);
    }
  },
  addEventListenerChangeMusicBg: function () {
    const anMusicPage = document.getElementById("anMusic-page");
    if (!anMusicPage) return;

    const aplayerIconMenu = anMusicPage.querySelector(
      ".aplayer-info .aplayer-time .aplayer-icon-menu"
    );

    const metingPlayer = anMusicPage.querySelector("meting-js")?.aplayer;
    if (metingPlayer) {
      metingPlayer.on("loadeddata", function () {
        anzhiyu.changeMusicBg();
      });
    }

    if (aplayerIconMenu) {
      aplayerIconMenu.addEventListener("click", function () {
        const menuMask = document.getElementById("menu-mask");
        if (menuMask) {
          menuMask.style.display = "block";
          menuMask.style.animation =
            "0.5s ease 0s 1 normal none running to_show";
        }
      });
    }

    const menuMask = document.getElementById("menu-mask");
    if (menuMask) {
      menuMask.addEventListener("click", function () {
        if (window.location.pathname != "/music/") return;
        const aplayerList = anMusicPage.querySelector(".aplayer-list");
        if (aplayerList) {
          aplayerList.classList.remove("aplayer-list-hide");
        }
      });
    }
  },
  // 假设的音乐切换逻辑
  musicToggle: function () {
    console.log("Music toggled!");
    // 实现音乐暂停/播放逻辑
  },
};

// 监听 PJAX 成功事件，重新绑定逻辑
document.addEventListener("pjax:success", function () {
  // console.log("PJAX loaded");
  anzhiyu.changeMusicBg(false); // 初始化背景切换
});

// 页面加载完成后的初始调用
document.addEventListener("DOMContentLoaded", function () {
  anzhiyu.changeMusicBg(false);
});
