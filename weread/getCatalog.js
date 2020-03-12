// ==UserScript==
// @name         Weread Get Catalog
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get Catalog
// @author       Joris Cai
// @match        https://weread.qq.com/web/reader/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {

    const body = $('body');
    const btn = $('<button id="get-catalog">获取目录</button>');
    btn.css({
        position: 'absolute',
        right: 0,
    })
    body.prepend(btn);
    body.on('click', '#get-catalog', (e) => {
        const pre = prompt('MarkDown首级标题', '###');
        start(pre, e);
    });

    function start(pre, event) {
        const list = document.querySelectorAll('li.chapterItem');
        const chapter = Array.from(list);
        const start = chapter.findIndex(ele => Array.from(ele.classList).includes('chapterItem_current'));
        const end = list.length;
        const target = chapter.slice(start, end);

        const mdText = getMd(target, pre);
        $(event.target).attr('data-clipboard-text', mdText);
        console.log('md: ', mdText);

        const clipboard = new ClipboardJS('#get-catalog');
        clipboard.on('success', (e) => {
            alert('复制成功');
            console.log('复制成功');
            clipboard.destroy();
        });
        clipboard.on('error', (e) => {
            alert('复制失败');
            console.log('复制失败，请再次尝试');
            clipboard.destroy();
        });
        // 触发执行复制
        const newEv = Object.assign(event, {
            delegateTarget: null,
        });
        clipboard.onClick(newEv);
    }

    function getMd(list = [], pre = '##') {
        const arr = [];
        list.forEach(ele => {
            const a = ele.querySelector('a');
            const text = a.innerText;
            const classList = Array.from(a.classList);
            let prefix = pre;
            const isLevel2 = classList.includes('chapterItem_level2');
            if (isLevel2) {
                prefix += '#';
            }
            arr.push(`${prefix} ${text}`);
            isLevel2 && arr.push(`- 写下重点吧`);
            isLevel2 && arr.push(`${prefix + '#'} 总结`);
        });
        return arr.join('\n');
    }
})();