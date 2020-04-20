// ==UserScript==
// @name         Weread Full Screen
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Joris Cai
// @match        https://weread.qq.com/web/reader/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    fullScreen();

    function fullScreen() {
        const body = $('body');
        body.prepend('<button id="tranform" style="position: fixed; left: 0; z-index: 1000;">全屏</button>');
        body.on('click', '#tranform', (e) => {
            console.log(e);
            const target = $(e.target);
            const isFull = target.hasClass('full');
            const content = $('.app_content');
            const topBar = $('.readerTopBar');
            const readerCtrl = $('.readerControls');
            let btnTxt = '还原';

            if (isFull) {
                content.removeAttr('style');
                topBar.removeAttr('style');
                readerCtrl.removeAttr('style');
                btnTxt = '全屏';
            } else {
                const height = readerCtrl.height()
                content.css({
                    'max-width': 'unset',
                    'padding-bottom': height + 'px',
                });

                topBar.css({
                    'max-width': 'unset',
                });
                readerCtrl.css({
                    right: '20px',
                    left: 'unset',
                });
            }

            target.toggleClass('full');
            window.dispatchEvent(new Event('resize'));
            $('#tranform').text(btnTxt);
        });

        $(window).on('resize', (e) => {
            const scrollY = window.scrollY;
            const height = $('.app_content').height();
            console.log('resize', scrollY, height);
        })
    }
})();

