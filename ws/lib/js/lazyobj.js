!function(t){var e=function(e){var o,r;o=this,o._loadIframe=function(t){var e,r;e=o.objArr[t],r=e.getAttribute("ivx-src"),e.setAttribute("src",r),e.setAttribute("active",!0)},o._loadObject=function(t){var e,r,i,n;e=o.objArr[t],r=e.getAttribute("ivx-src"),n=e.cloneNode(),n.setAttribute("data",r),n.setAttribute("active","true"),i=e.parentElement,i.insertBefore(n,e),i.removeChild(e),o.objArr[t]=n},o._load=o._loadIframe,o._update=function(){var e,r,i,n;e=o.objArr,n=0,i=t.innerHeight+(document.body.scrollTop||t.pageYOffset);for(var a=0;a<e.length;a++)r=e[a],r.getAttribute("active")?n+=1:r.offsetTop<i&&o._load(a);n===e.length&&(o.finished=!0)},o._loop=function(t){!o.paused&&o.ts<t&&(o._update(),o.ts=t+o.delay),o.finished||(o._id=r(function(t){o._loop(t)}))},o._init=function(){var i,n,a;for(o.paused=!1,o.finished=!1,o.delay=500,o.ts=0,n=[],i=document.querySelectorAll(e),a=0;a<i.length;a++)n[a]=i[a];o.objArr=n,"object"===e&&(o._load=o._loadObject),r=t.requestFrame("request"),t.addEventListener("load",function(){o._loop(0)})},o._init()};t.IvxLazy=e}(window);