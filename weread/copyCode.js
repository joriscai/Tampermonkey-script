// ==UserScript==
// @name         Weread Copy Code
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        padding: '4px 6px',
        cursor: 'pointer',
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


    body.on('hover', 'pre.ziti1, pre.wr_absolute',  (e) => {
        const type = e.type;
        const target = $(e.target);

        const offset = target.offset();
        const btnRect = btn[0].getBoundingClientRect();
        const targetRect = e.target.getBoundingClientRect();
        const isInHor = (e.clientX >= btnRect.left) && (e.clientX < (btnRect.right))
        const isInVer = (e.clientY >= btnRect.top) && (e.clientY < (btnRect.bottom))

        if (type === 'mouseleave' && !(isInHor && isInVer)) {
            btn.hide();
        } else if (type === 'mouseenter') {
            const winWidth = $(window).width();
            let right = winWidth - targetRect.right;
            right = right < 0 ? 0 : right;

            btn.css({
                top: offset.top,
                right,
            });
            btn.attr('data-clipboard-text', target.text());
            btn.show();
        }
    });

    btn.on('mouseleave', () => {
        btn.hide()
    });

})();