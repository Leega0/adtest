(function(){
    var docEl = document.documentElement,
       resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
       recalc = function() {
           docEl.style.fontSize = 40 * (docEl.clientWidth / 750) + 'px';
       };
   window.addEventListener(resizeEvt, recalc, false);
   document.addEventListener('DOMContentLoaded', recalc, false);
})();
