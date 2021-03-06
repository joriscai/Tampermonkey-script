// ==UserScript==
// @name         Weread Open Image
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open Image
// @author       Joris Cai
// @match        https://weread.qq.com/web/reader/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {
    const body = $('body');
    const btn = $('<a id="open-image">打开</a>');
    btn.hide();
    btn.css({
        position: 'absolute',
        'z-index': 1000,
        background: 'black',
        padding: '4px 6px',
        cursor: 'pointer',
        color: 'white',
    });
    btn.attr('target', '_blank')
    body.append(btn);

    body.on('hover', 'img.wr_readerImage_opacity',  (e) => {
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
            btn.attr('href', target.attr('data-src'));
            btn.show();
        }
    });

    btn.on('mouseleave', () => {
        btn.hide()
    });

})();