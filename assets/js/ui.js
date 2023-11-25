window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  comboFunc();
});
window.addEventListener("load", () => {
  layoutFunc();
});

$(function() {})

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf("samsung") > -1) {
    browserAdd("samsung");
  }

  if (
    navigator.platform.indexOf("Win") > -1 ||
    navigator.platform.indexOf("win") > -1
  ) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }

  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/*
  resize
*/
function resizeAction(callback) {
  let windowWid = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWid) {
      if (callback) {
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}

/**
 * 레이아웃
 */
function layoutFunc() {
  function headerMenu(){
    const btn_header_menu = document.querySelector(".btn_header_menu");
    const nav_layer = document.querySelector(".nav_layer");
    eventListener(btn_header_menu,"click",(e)=>{
      e.preventDefault();
      nav_layer.classList.toggle("active");
    });
    eventListener(nav_layer,"click",(e)=>{
      if(!e.target.closest(".nav_contents")){
        nav_layer.classList.remove("active");
      }
    });
  }
  function pageTopgo(){
    const btn_bottom_layer = document.querySelector(".btn_bottom_layer");
    const footer_wrap = document.querySelector(".footer_wrap");
    const body_dom = document.querySelector("body");
    const btn_topgo = document.querySelector(".btn_topgo");

    /* action();
    window.addEventListener("scroll",()=>{
      action();
    }); */

    if(!!btn_topgo){
      btn_topgo.addEventListener("click",(e)=>{
        e.preventDefault();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior : "smooth"
        })
      })
    }

    function action(){
      const bottomPos = body_dom.getBoundingClientRect().height - window.innerHeight;
      const footer_wrap_height = footer_wrap.getBoundingClientRect().height;
      if(window.scrollY > bottomPos - footer_wrap_height){
        btn_bottom_layer.style.display = "none";
      }else{
        btn_bottom_layer.style.display = "block";
      }
    }
  }
  pageTopgo();
  headerMenu();
}

function eventListener(element,type,callback){
  if(!!element){
    element.addEventListener(type,callback);
  }
}

/**
 * menu rock
 */
function menuRock(target) {
  const targetDom = document.querySelector(target);
  if (!!targetDom) {
    targetDom.classList.add("active");
  }
}

function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function(e) {
    return e != t;
  });
}

/* popup */

/**
 * 디자인 팝업
 * @param {*} option
 */
function DesignPopup(option) {
  this.option = option;
  this.selector = this.option.selector;

  if (this.selector !== undefined) {
    this.selector = document.querySelector(this.option.selector);
  }
  this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.layer_wrap_parent = null;
  this.btn_closeTrigger = null;
  this.btn_close = null;
  this.bg_design_popup = null;
  this.scrollValue = 0;

  this.btn_closeTrigger = null;
  this.btn_close = null;

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  if (
    !this.layer_wrap_parent &&
    !document.querySelector(".layer_wrap_parent")
  ) {
    this.pagewrap.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

  // console.log(this.selector.querySelectorAll(".close_trigger"));

  this.bindEvent();
}

DesignPopup.prototype.dimCheck = function() {
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if (!!popupActive[0]) {
    popupActive[0].classList.add("active_first");
  }
  if (popupActive.length > 1) {
    this.layer_wrap_parent.classList.add("has_active_multi");
  } else {
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
};
DesignPopup.prototype.popupShow = function() {
  this.design_popup_wrap_active =
    document.querySelectorAll(".popup_wrap.active");

  if (this.selector == null) {
    return;
  }
  this.domHtml.classList.add("touchDis");

  this.selector.classList.add("active");
  setTimeout(() => {
    this.selector.classList.add("motion_end");
  }, 30);
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  if ("callback" in this.option) {
    this.option.callback();
  }
  if (!!this.design_popup_wrap_active) {
    this.design_popup_wrap_active.forEach((element, index) => {
      if (this.design_popup_wrap_active !== this.selector) {
        element.classList.remove("active");
      }
    });
  }
  //animateIng = true;

  this.layer_wrap_parent.append(this.selector);

  this.dimCheck();

  // this.layer_wrap_parent

  // ****** 주소 해시 설정 ****** //
  // location.hash = this.selector.id
  // modalCount++
  // modalHash[modalCount] = '#' + this.selector.id
};
DesignPopup.prototype.popupHide = function() {
  var target = this.option.selector;
  if (target !== undefined) {
    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }
    //remove
    this.selector.classList.remove("motion_end");
    setTimeout(() => {
      this.selector.classList.remove("active");
    }, 400);
    this.design_popup_wrap_active =
      document.querySelectorAll(".popup_wrap.active");
    this.dimCheck();
    if ("closeCallback" in this.option) {
      this.option.closeCallback();
    }
    if (this.design_popup_wrap_active.length == 1) {
      this.domHtml.classList.remove("touchDis");
    }
  }
};

DesignPopup.prototype.bindEvent = function() {
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");
  var closeItemArray = [...this.btn_close];

  // this.selector.querySelector(".popup_content_row").addEventListener("scroll",(e)=>{
  //   console.log(this.selector.querySelector(".popup_content_row").scrollTop)
  // });
  if (!!this.selector.querySelectorAll(".close_trigger")) {
    this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
    closeItemArray.push(...this.btn_closeTrigger);
  }
  // if (!!this.bg_design_popup) {
  //   closeItemArray.push(this.bg_design_popup);
  // }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        },
        false
      );
    });
  }
};


function comboFunc(){
  // const combo_item_target = document.querySelectorAll(".combo_item_target");
  // if(!!combo_item_target){
  //   combo_item_target.addEventListener("click",(e)=>{
  //     e.preventDefault();
  //     let eventTarget = e.currentTarget;
  //     let eventParent = eventTarget.closest(".combo_item_group");
  //     eventParent.classList.toggle("eventParent");
  //   });
  // }

  addDynamicEventListener(document.body, 'click', '.combo_item_target', function(e) {
    e.preventDefault();
    let eventTarget = e.target;
    let eventParent = eventTarget.closest(".combo_item_group");
    eventParent.classList.toggle("active");
  });

  addDynamicEventListener(document.body, 'click', '.combo_option', function(e) {
    e.preventDefault();
    let eventTarget = e.target;
    let eventParent = eventTarget.closest(".combo_item_group");
    let eventParentTarget = eventParent.querySelector(".combo_item_target");
    eventParent.classList.remove("active");
    eventParentTarget.textContent = eventTarget.textContent;
  });
}


function comboChangeCallback(option) {
  addDynamicEventListener(document.body, 'click', `${option.target} .combo_option`, function(e) {
    let thisEventObj = e.target;
    let thisEventObjValue = thisEventObj.getAttribute("data-value");
    if ("callback" in option) {
      option.callback(thisEventObjValue);
    }
  });
}
