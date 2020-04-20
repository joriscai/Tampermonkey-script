// ==UserScript==
// @name         Weread Copy Code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy Code
// @author       Joris Cai
// @match        https://weread.qq.com/web/reader/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {
    const body = $('body');
    const btn = $('<div id="copy-code">复制</div>');
    btn.hide();
    btn.css({
        position: 'absolute',
        'z-index': 1000,
        background: 'black',
        padding: '2px 4px',
    })
    body.append(btn);
    body.on('click', '#copy-code', (event) => {
        console.log('copy');
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
    });


    body.on('hover', 'pre.ziti1',  (e) => {
        const type = e.type;

        const target = $(e.target);
        console.log('target: ', target);

        const offset = target.offset();
        const rect = target[0].getBoundingClientRect();
        console.log('hover', type);

        const isInHor = (e.clientX >= rect.x) && (e.clientX < (rect.x + rect.width))
        const isInVer = (e.clientY >= rect.y) && (e.clientY < (rect.y + rect.height))

        if (isInHor && isInVer) {
            let left = offset.left + target.width();
            left = left > $(window).width() ? $(window).width() : left;
            btn.css({
                top: offset.top,
                left,
            });
            btn.attr('data-clipboard-text', target.text());
            btn.show();
        } else {
            btn.hide();
        }

        // if (type === 'mouseleave') {
        //     btn.hide();
        //     console.log('hide');
        // } else if (type === 'mouseenter') {
        //     console.log('show', offset);
        //     let left = offset.left + target.width();
        //     left = left > $(window).width() ? $(window).width() : left;
        //     btn.css({
        //         top: offset.top,
        //         left,
        //     });
        //     btn.attr('data-clipboard-text', target.text());
        //     btn.show();
        // }
    });

})();