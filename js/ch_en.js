document.addEventListener("DOMContentLoaded",(function(){const{defaultEncoding:e,translateDelay:t,msgToSimplifiedChinese:n}=GLOBAL_CONFIG.translate;GLOBAL_CONFIG.Snackbar;let o;void 0===btf.saveToLocal.get("translate-en-chn")||Number(btf.saveToLocal.get("translate-en-chn"));const l=window.location.href.includes("/en/");function a(){let e=window.location.href;if(l){o.textContent=n;let t=e.replace("/en/","/");console.log(`Redirect to ${t}`),window.location.href=t}else{o.textContent="EN";let t=e.replace(/^(https?:\/\/[^\/]+)(\/)?/,"$1/en/");console.log(`Redirect to ${t}`),window.location.href=t}}function c(){o=document.getElementById("translateLink"),o&&(o.textContent=l?n:"EN",o.addEventListener("click",a,!1))}console.log(l),document.addEventListener("pjax:complete",c),c()}));