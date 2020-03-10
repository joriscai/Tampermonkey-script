// ==UserScript==
// @name         Weread full-screen catalog-count
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       JorisCai
// @match        https://weread.qq.com/web/reader/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    const list = document.querySelectorAll('li.chapterItem');

    const chapter = Array.from(list);
    const start = chapter.findIndex(ele => Array.from(ele.classList).includes('chapterItem_current'));

    const end = list.length;
    const target = chapter.slice(start, end);
    console.log(getMd(target));


    function getMd(list = [], pre = '##') {
        const arr = [];
        list.forEach(ele => {
            const a = ele.querySelector('a');
            const text = a.innerText;
            const classList = Array.from(a.classList);
            let prefix = pre;
            if (classList.includes('chapterItem_level2')) {
                prefix += '#'
            }
            arr.push(`${prefix} ${text}`)
        });
        return arr.join('\n');
    }
})();