!function(t){var e=function(){var t=this;t.eventClick=function(e){var i,n,c,o;i=e.target,n=i.getAttribute("src"),c=n.split("/"),o=c.slice(c.length-1),t.objectElement.setAttribute("data",ivxcfg.fm.objurl+"?img="+o)},t._init=function(){var e,i,n;for(e=document.querySelector("section"),i=e.querySelectorAll("img"),n=0;n<i.length;n++)i[n].onclick=function(e){t.eventClick(e)};t.imgList=i,t.objectElement=e.querySelector("object")},t._init()};t.ivxImgClick=new e}(window);