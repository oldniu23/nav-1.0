const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
// console.log(x)  第一次是个null
const xObject = JSON.parse(x)
// 把字符串变成对象   第一次也是个null
//下边这个代码  因为第一次(用户没用过的时候)的xObject是空的  需要一个初始值 所以用了 ||
const hashMap = xObject || [      
    // 如果xObject存在就用xObject 不存在就用默认数组
    { logo:'A',url:'https://www.acfun.cn' },
    { logo:'B',url:'https://www.bilibili.com' },
]

const simplifyUrl = (url)=>{  
    //简化url  去除https:// http://和www.
    return url.replace('https://','')
    .replace('http://','')
    .replace('www.','')
    .replace(/\/.*/,'')
    //正则表达式  删除/开头的内容   \是用来转义的
}

const render = ()=>{
    $siteList.find('li:not(.last)').remove()
// 找到li  删除除了class为last的li标签   x渲染hash的时候先把之前的li删掉 然后在渲染新的
    hashMap.forEach((node,index)=>{
        const $li = $(`<li>
          <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${simplifyUrl(node.url)}</div>
            <div class="close">
                <svg class="icon" >
                    <use xlink:href="#icon-close"></use>
                </svg>
            </div>
          </div>
        </a>
      </li>
        `).insertBefore($lastLi)
    $li.on('click',()=>{
        window.open(node.url)
        // 用open代替a标签打开新窗口
    })
    $li.on('click','.close',(e)=>{
        e.stopPropagation()  
        // 阻止冒泡 避免点击x的时候跳转新页面
        hashMap.splice(index,1)
        // 从hashmap里删一个索引为index的  1是删除个数
        render()
        // 删完后重新渲染一下
    })
    })
}
render()
// 先render
$('.addButton')
.on('click',()=>{
   let url =  window.prompt('请问您要添加的网址是什么？') 
//    这里的url是用户输入的内容
    if(url.indexOf('http') !==0 ){
        url = 'https://' + url
        // 如果用户输入的url开头不是http 就帮它加上
    }
    console.log(url)
    hashMap.push({
        logo:simplifyUrl(url)[0].toUpperCase(), 
        //简化url 取简化的url第一个字母转成大写当logo
        url:url
        
    })
    render()
    // 点了之后push进去再render
})
window.onbeforeunload = ()=>{
    //在这个函数里把hashMap存下来
    const string = JSON.stringify(hashMap)
    // // localStorage只能存字符串  所以用json.stringify把对象()转成字符串
    localStorage.setItem('x',string)
    // 接受两个值 一个key一个value  在本地的存储里设置一个x 它的值就是string
}

$(document).on('keypress',(e)=>{  
    // 监听键盘事件
    const {key} = e
    //上边是 const key = e.key的简写
    for(let i = 0;i <hashMap.length;i++){
        if(hashMap[i].logo.toLowerCase() === key)
        window.open(hashMap[i].url)
        // 遍历hashmap  如果hash的第i个元素的logo的小写等于键盘输入的
        // 就打开hash的第i个元素的url 
    }
})