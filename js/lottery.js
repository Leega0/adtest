// 已有弹窗组件
var deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    deviceHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    baseFontsize = 16,
    $resizeShade,
    $body = $('body');


if (!window.jQuery) {
  var jQuery = Zepto;
}
/**
 * 空弹窗
 * @params {String} 引用弹窗ID,class字符串
 * @returns {Boolean}
 */
$.dialog = function(html) {
  var defaults = {
    type: 'dialog',
    isBtn: true,
    btn: '',
    onDialog: null,
    shutCallback: null,
    submitCallback: null,
    cancelCallback: null,
    closeCallback: null,
    redClose: false,
    neverAlert: false,
    neverFunc: null,
    submitText: '确认',
    cancelText: '取消',
    str: ''
  };

  var settings = arguments[1];

  if (typeof html != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);

  var $dialogContainer;

  switch(settings.type) {
    case 'alert':
      settings.str = html;
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-btn-whiteBlack ui-dialog-btn-submit">'+ settings.submitText + '</a>';
      break;
    case 'confirm':
      settings.str = html;
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-dialog-btn-submit ui-btn-inline ui-btn-whiteBlack">'+ settings.submitText + '</a>' +
                      '<a href="javascript:void(0);" class="ui-btn ui-dialog-btn-cancel ui-btn-inline ui-btn-whiteBlack">'+ settings.cancelText + '</a>';
      break;
    default :
      settings.btn = '<a href="javascript:void(0);" class="ui-btn ui-btn-whiteBlack ui-dialog-btn-submit">确定</a>';
      break;
  }

  if(settings.type == 'alert' || settings.type == 'confirm') {
    $dialogContainer = $('<div class="ui-dialog ui-dialog-alert">' +
                            '<i class="ui-dialog-close"></i>' +
                            '<p class="ui-dialog-text">' + settings.str + '</p>' +
                            (settings.neverAlert ? '<div class="ui-checkbox-wrap"><input class="ui-checkbox" type="checkbox"/><span class="ui-checkbox-label">不再提示</span></div>' : '') +
                            '<div class="ui-dialog-btnWrap">' +
                            settings.btn +
                            '</div>' +
                          '</div>');
  } else {

    var $dialog = $(html);
    $dialogContainer = $('<div class="ui-dialog"><i class="' + (settings.redClose ? 'ui-dialog-close-red' : 'ui-dialog-close') + '"></i></div>');

    $dialog.css('display', 'block').appendTo($dialogContainer);

    if(settings.isBtn) {
      $dialogContainer.append('<div class="ui-dialog-btnWrap">' +
        settings.btn  +
        '</div>');
    }
  }

  var $shade = $('<div class="ui-shade"></div>');
  var $dialogWrap = $('<div class="ui-dialog-wrap"></div>');

  $dialogWrap.append($dialogContainer)
             .append($shade);

  $body.append($dialogWrap);
  $dialogWrap.css('display', 'block');
  $shade.height(deviceHeight > $body.height() ? deviceHeight : $body.height()).css('display', 'block');
  dialogOffset($dialogContainer);


  var $submit = $('.ui-dialog-btn-submit', $dialogContainer),
      $cancel = $('.ui-dialog-btn-cancel', $dialogContainer),
      $close = $('.ui-dialog-close,.ui-dialog-close-red', $dialogContainer),
      $never = $('.ui-checkbox', $dialogContainer);

  $close.on('touchend', function(e) {
    e.preventDefault();
    $dialogWrap.dialogOff();

    if (settings.shutCallback && settings.shutCallback.call($dialogWrap, $never) === false) {
      return false;
    }
  });

  $submit.on('touchend', function(e) {
    e.preventDefault();

    if (settings.submitCallback && settings.submitCallback.call($dialogWrap, $never) === false) {
      return false;
    }

    $dialogWrap.dialogOff();
  });

  $cancel.on('touchend', function(e) {
    e.preventDefault();
    $dialogWrap.dialogOff();

    if (settings.cancelCallback && settings.cancelCallback.call($dialogWrap, $never) === false) {
      return false;
    }
  });

  $.fn.dialogOff = function() {
    if(settings.type == 'alert' || settings.type == 'confirm') {
      $dialogWrap.remove();
    } else {
      $dialog.css('display', 'none').appendTo('body');
      $dialogWrap.remove();
    }

    if (settings.closeCallback && settings.closeCallback.call($dialogWrap, $never) === false) {
      return false;
    }
  };

  if (settings.onDialog && settings.onDialog.call($dialogWrap, $never) === false) {
    return false;
  }
};

/**
 * 基本信息弹窗
 */
$.alert = function() {
  var str = arguments[0];

  var defaults = {
    type: 'alert',
    submitCallback: null,
    closeCallback: null,
    neverAlert: false,
    neverFunc: null,
    submitText: '确认'
  };

  var settings = arguments[1];

  if (typeof str != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);
  $.dialog(str, settings);
}
/**
 * 确认弹窗
 */

$.confirm = function () {
  var str = arguments[0];
  var defaults = {
    type: 'confirm',
    submitCallback: null,
    closeCallback: null,
    neverAlert: false,
    neverFunc: null,
    submitText: '确认'
  };

  var settings = arguments[1];

  if (typeof str != 'string') {
    console.error('引用内容错误');
    return false;
  }

  if(settings) {
    if(typeof settings != 'object') {
      console.error('参数错误');
      return false;
    }
  }

  settings = $.extend({}, defaults, settings);
  $.dialog(str, settings);
}
/**
 * 遮罩
 * @param {jQuery} $dialog 引用弹窗
 * @param {Boolean} isClickOff 点击遮罩关闭
 * @returns {*|jQuery|HTMLElement}
 */
function showShade($dialog, isClickOff) {
  var $shade = $('.ui-shade'),
      isDialog = $dialog == undefined || $dialog == null || $dialog == '';

  if ($shade[0]) {
    $shade.show();
  } else {
    $shade = $('<div class="ui-shade"></div>');
    $shade.appendTo('body').show();
  }

  $shade.height(deviceHeight > $body.height() ? deviceHeight : $body.height());

  if (isClickOff === null || isClickOff === undefined || isClickOff === '' || isClickOff === true) {
    $shade.on('touchend', function() {
      if (!isDialog) {
        $dialog.remove();
      }
      $shade.remove();
    });
  }
  $resizeShade = $shade;
  return $shade;
}

/**
 * 弹窗定位
 * @param {String} $dialog 引用弹窗
 */
function dialogOffset($dialog) {

  var $dialogOption = {};

  if (window.Zepto) {
    $dialogOption.width = $dialog.width();
    $dialogOption.height = $dialog.height();
  } else {
    $dialogOption.width = $dialog.outerWidth();
    $dialogOption.height = $dialog.outerHeight();
  }
  $dialogOption.offsetTop = (deviceHeight - $dialogOption.height) / 2;
  $dialogOption.offsetLeft = ($(document).width() - $dialogOption.width) / 2;
  $dialog.css({
    'top': $dialogOption.offsetTop,
    'left': $dialogOption.offsetLeft
  });

  $(window).scrollTop(0);
}

// 修复只引用jquery时 按钮无acitve效果
document.body.addEventListener('touchstart', function () {}); 
// 抽奖plugin
;(function($) {
var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
jQuery.fn.extend({
    rotate:function(parameters)
    {
        if (this.length===0||typeof parameters=="undefined") return;
            if (typeof parameters=="number") parameters={angle:parameters};
        var returned=[];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);  
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var paramClone = $.extend(true, {}, parameters); 
                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                    returned.push($(newRotObject));
                }
                else {
                    element.Wilq32.PhotoEffect._handleRotation(parameters);
                }
            }
            return returned;
    },
    getRotateAngle: function(){
        var ret = [];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);  
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    ret[i] = element.Wilq32.PhotoEffect._angle;
                }
            }
            return ret;
    },
    stopRotate: function(){
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);  
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
    }
});
Wilq32=window.Wilq32||{};
Wilq32.PhotoEffect=(function(){

  if (supportedCSS) {
    return function(img,parameters){
      img.Wilq32 = {
        PhotoEffect: this
      };
            
            this._img = this._rootObj = this._eventObj = img;
            this._handleRotation(parameters);
    }
  } else {
    return function(img,parameters) {
            this._img = img;

      this._rootObj=document.createElement('span');
      this._rootObj.style.display="inline-block";
      this._rootObj.Wilq32 = 
        {
          PhotoEffect: this
        };
      img.parentNode.insertBefore(this._rootObj,img);
      
      if (img.complete) {
        this._Loader(parameters);
      } else {
        var self=this;
        jQuery(this._img).bind("load", function()
        {
          self._Loader(parameters);
        });
      }
    }
  }
})();

Wilq32.PhotoEffect.prototype={
    _setupParameters : function (parameters){
    this._parameters = this._parameters || {};
        if (typeof this._angle !== "number") this._angle = 0 ;
        if (typeof parameters.angle==="number") this._angle = parameters.angle;
        this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle); 

        this._parameters.step = parameters.step || this._parameters.step || null;
    this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }
    this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
        this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
        if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind); 
  },
  _handleRotation : function(parameters){
          this._setupParameters(parameters);
          if (this._angle==this._parameters.animateTo) {
              this._rotate(this._angle);
          }
          else { 
              this._animateStart();          
          }
  },

  _BindEvents:function(events){
    if (events && this._eventObj) 
    {
            if (this._parameters.bind){
                var oldEvents = this._parameters.bind;
                for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 
                        jQuery(this._eventObj).unbind(a,oldEvents[a]);
            }

            this._parameters.bind = events;
      for (var a in events) if (events.hasOwnProperty(a)) 
          jQuery(this._eventObj).bind(a,events[a]);
    }
  },

  _Loader:(function()
  {
    return function (parameters)
    {
      this._rootObj.setAttribute('id',this._img.getAttribute('id'));
      this._rootObj.className=this._img.className;
      
      this._width=this._img.width;
      this._height=this._img.height;
      this._widthHalf=this._width/2; 
      this._heightHalf=this._height/2;
      
      var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

      this._widthAdd = _widthMax - this._width;
      this._heightAdd = _widthMax - this._height;
      this._widthAddHalf=this._widthAdd/2; 
      this._heightAddHalf=this._heightAdd/2;
      
      this._img.parentNode.removeChild(this._img);  
      
      this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;
      this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;
      
      this._canvas=document.createElement('canvas');
      this._canvas.setAttribute('width',this._width);
      this._canvas.style.position="relative";
      this._canvas.style.left = -this._widthAddHalf + "px";
      this._canvas.style.top = -this._heightAddHalf + "px";
      this._canvas.Wilq32 = this._rootObj.Wilq32;
      
      this._rootObj.appendChild(this._canvas);
      this._rootObj.style.width=this._width+"px";
      this._rootObj.style.height=this._height+"px";
            this._eventObj = this._canvas;
      
      this._cnv=this._canvas.getContext('2d');
            this._handleRotation(parameters);
    }
  })(),

  _animateStart:function()
  { 
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._animateStartTime = +new Date;
    this._animateStartAngle = this._angle;
    this._animate();
  },
    _animate:function()
    {
         var actualTime = +new Date;
         var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

         if (checkEnd && !this._parameters.animatedGif) 
         {
             clearTimeout(this._timer);
         }
         else 
         {
             if (this._canvas||this._vimage||this._img) {
                 var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                 this._rotate((~~(angle*10))/10);
             }
             if (this._parameters.step) {
                this._parameters.step(this._angle);
             }
             var self = this;
             this._timer = setTimeout(function()
                     {
                     self._animate.call(self);
                     }, 10);
         }

         if (this._parameters.callback && checkEnd){
             this._angle = this._parameters.animateTo;
             this._rotate(this._angle);
             this._parameters.callback.call(this._rootObj);
         }
     },

  _rotate : (function()
  {
    var rad = Math.PI/180;
    if (supportedCSS)
    return function(angle){
            this._angle = angle;
      this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
    }
    else 
    return function(angle)
    {
            this._angle = angle;
      angle=(angle%360)* rad;
      // clear canvas 
      this._canvas.width = this._width+this._widthAdd;
      this._canvas.height = this._height+this._heightAdd;
            
      this._cnv.translate(this._widthAddHalf,this._heightAddHalf);  
      this._cnv.translate(this._widthHalf,this._heightHalf);   
      this._cnv.rotate(angle); 
      this._cnv.translate(-this._widthHalf,-this._heightHalf);
      this._cnv.scale(this._aspectW,this._aspectH); 
      this._cnv.drawImage(this._img, 0, 0);
    }

  })()
}
})(jQuery);
// 抽奖plugin end

var $lotterBtn = $('.lottery-btn'),
bRotate = false;
//抽奖plugin 方法调用
  var rotateFn = function (awards, angles, prizeTitle, prizeName, prizeDec ,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight){
    bRotate = !bRotate;
    $('#lottery-rotate').stopRotate();
    $('#lottery-rotate').rotate({
      angle:0,
      animateTo:angles+1440,
      duration:4000,
      callback:function (){
        // 中奖弹窗
        $.dialog('.lottery-award-dialog', {
                isBtn: false
              });
         $(".lottery-award-dialog").find(".title").html(prizeTitle);
         $(".lottery-award-dialog").find(".award-detial").html(prizeName);
         $(".lottery-award-dialog").find(".award-limit").html(prizeDec);
         $(".lottery-award-dialog").find(".award-enddate").html("过期时间："+prizeDate);
         $(".lottery-award-dialog").find("#alink_left").html(btnleftTxt).attr('href',linkLeft);
         $(".lottery-award-dialog").find("#alink_right").html(btnrightTxt).attr('href',linkRight);
        bRotate = !bRotate;
      }
    })
  };
  // 抽奖btn event 响应
  $lotterBtn.click(function (){
    // 中奖信息提取
    var timeC = $("#timeC"); 

    if(timeC.text()<1&&!bRotate){
      // 抽奖次数用完后
      alert("抽奖机会已用完")
      return ;
    }
    
    if(bRotate)return;
    else {
      $.ajax({
         // type: "POST",
         // url: "/luckyDraw/getPrize.jhtml?t="+Math.random(),
         type:"GET",
         url:"lottery.json?t="+Math.random(),
         async: true,
         dataType: "json",
         success: function(data){ 
            var code = data.code;
            if(code == "0") {
               prizeId = data.prizeId; //奖品id
               prizeTitle = data.prizeTitle; //奖品标题
               prizeName = data.prizeName; //奖品名称
               prizeDec = data.prizeDec; //中奖描述
               prizeDate = data.prizeDate; //奖品过期时间
               btnleftTxt = data.btnleftTxt; //中奖左侧按钮显示文字
               btnrightTxt = data.btnrightTxt; //中奖右侧按钮显示文字
               linkLeft = data.linkLeft; //中奖按钮链接
               linkRight = data.linkRight //中奖按钮链接
      switch (prizeId) {
      case 0:
        rotateFn(0, -25, prizeTitle, prizeName, prizeDec,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight);
        break;
      case 1:
        rotateFn(1, 35, prizeTitle, prizeName, prizeDec,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight);
        break;
      case 2:
        rotateFn(2, 92, prizeTitle, prizeName, prizeDec,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight);
        break;
      case 3:
        rotateFn(3, 159, prizeTitle, prizeName, prizeDec,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight);
        break;
      case 4:
        rotateFn(4, 221, prizeTitle, prizeName, prizeDec,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight);
        break;
      case 5:
        rotateFn(5, 283, prizeTitle, prizeName, prizeDec,prizeDate,btnleftTxt,btnrightTxt,linkLeft,linkRight);
        break;
    }
            timeC.text(timeC.text()-1);
             
            }else if(code == "-1") {
              alert(data.errMsg);
              return ;
            }else {
              alert("系统繁忙,请稍候再试..")
              return ;
            }       
         }
      });
      
    }
  });
// 中奖用户信息滚动

var speed=30;
var scrollWrap=document.getElementById("award_list_wrap");
var scrollOne=document.getElementById("award_list_origin");
var scrollTwo=document.getElementById("awrad_list_clone");
scrollTwo.innerHTML=scrollOne.innerHTML;

function Marquee(){
  if (scrollTwo.offsetWidth-scrollWrap.scrollLeft<=0) {
    scrollWrap.scrollLeft-=scrollOne.offsetWidth;
  } else {
    scrollWrap.scrollLeft++;
  }
}
// Marquee();
 var MyMar = setInterval(Marquee,speed);




