// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x');
// console.log(x)  第一次是个null
var xObject = JSON.parse(x);
// 把字符串变成对象   第一次也是个null
//下边这个代码  因为第一次(用户没用过的时候)的xObject是空的  需要一个初始值 所以用了 ||
var hashMap = xObject || [
// 如果xObject存在就用xObject 不存在就用默认数组
{ logo: 'A', url: 'https://www.acfun.cn' }, { logo: 'B', url: 'https://www.bilibili.com' }];

var simplifyUrl = function simplifyUrl(url) {
    //简化url  去除https:// http://和www.
    return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '');
    //正则表达式  删除/开头的内容   \是用来转义的
};

var render = function render() {
    $siteList.find('li:not(.last)').remove();
    // 找到li  删除除了class为last的li标签   x渲染hash的时候先把之前的li删掉 然后在渲染新的
    hashMap.forEach(function (node, index) {
        var $li = $('<li>\n          <div class="site">\n            <div class="logo">' + node.logo + '</div>\n            <div class="link">' + simplifyUrl(node.url) + '</div>\n            <div class="close">\n                <svg class="icon" >\n                    <use xlink:href="#icon-close"></use>\n                </svg>\n            </div>\n          </div>\n        </a>\n      </li>\n        ').insertBefore($lastLi);
        $li.on('click', function () {
            window.open(node.url);
            // 用open代替a标签打开新窗口
        });
        $li.on('click', '.close', function (e) {
            e.stopPropagation();
            // 阻止冒泡 避免点击x的时候跳转新页面
            hashMap.splice(index, 1);
            // 从hashmap里删一个索引为index的  1是删除个数
            render();
            // 删完后重新渲染一下
        });
    });
};
render();
// 先render
$('.addButton').on('click', function () {
    var url = window.prompt('请问您要添加的网址是什么？');
    //    这里的url是用户输入的内容
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
        // 如果用户输入的url开头不是http 就帮它加上
    }
    console.log(url);
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        //简化url 取简化的url第一个字母转成大写当logo
        url: url

    });
    render();
    // 点了之后push进去再render
});
window.onbeforeunload = function () {
    //在这个函数里把hashMap存下来
    var string = JSON.stringify(hashMap);
    // // localStorage只能存字符串  所以用json.stringify把对象()转成字符串
    localStorage.setItem('x', string);
    // 接受两个值 一个key一个value  在本地的存储里设置一个x 它的值就是string
};

$(document).on('keypress', function (e) {
    // 监听键盘事件
    var key = e.key;
    //上边是 const key = e.key的简写

    for (var i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) window.open(hashMap[i].url);
        // 遍历hashmap  如果hash的第i个元素的logo的小写等于键盘输入的
        // 就打开hash的第i个元素的url 
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.30685e57.map