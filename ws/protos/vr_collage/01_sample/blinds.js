!function(t){var i=function(){var i,s;this.__defineSetter__("fps",function(t){this._fps=t,this._tsdiff=1e3/t}),this.shade=function(t,i){var s,e;s=90-Math.abs(90-i),e=.4+.5*(s/90),t.children[0].style.opacity=e},this.rotate=function(t){var e,n,h;for(n=i.children,e=0;e<n.length;e++)h=n[e],h.style[s]="rotateY("+t+"deg)",this.shade(h,t)},this._update=function(){this.paused||(this.deg+=this.incr,(this.deg<0||this.deg>180)&&(this.incr*=-1,this._ts+=2e3),this.rotate(this.deg))},this._animate=function(i){var s,e;s=this,e=i-this._ts,this._ts&&e>this._tsdiff&&(this._ts=i,this._update()),i&&!this._ts&&(this._ts=i+2e3),t.requestAnimationFrame(function(t){s._animate(t)})},this._init=function(){this._ts=0,this.incr=2,this.deg=0,this.fps=15,this.paused=!1,i=document.querySelectorAll("#blinds1")[0],s="transform","undefined"!=typeof i.style.webkitTransform&&(s="webkitTransform"),this._animate(0)},this._init()};t.ivxBlinds=new i}(window);