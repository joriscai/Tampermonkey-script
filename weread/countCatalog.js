// ==UserScript==
// @name         Weread Count Catalog
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Count catalog for weread
// @author       Joris Cai
// @match        https://weread.qq.com/web/reader/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    catalog();

    let observer = new MutationObserver((mutationsList) => {
        for(let mutation of mutationsList) {
            let { type, target, attributeName } = mutation;
            if (type === 'attributes' && attributeName === 'class' && $(target).hasClass('chapterItem_current')) {
                console.log('target: ', target);
                catalog();
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe($('.readerCatalog_list')[0], {
        attributes: true,
        childList: true,
        subtree: true,
    });

    function catalog() {
        const chapterList = $('.readerCatalog_list li.chapterItem');
        let level1 = 0;
        let level2 = 0;
        let currLevel1 = null;
        let currLevel2 = null;
        for (let i = 0; i < chapterList.length; i++) {
            const ele = $(chapterList[i]);
            const isLevel1 = !!ele.find('a.chapterItem_level1').length;
            if (isLevel1) {
                level1++;
            } else {
                level2++;
            }
            if (!currLevel2 && ele.hasClass('chapterItem_current')) {
                currLevel1 = level1;
                currLevel2 = level2;
            }
        }
        console.log(`${level1}, ${level2}, ${currLevel1}, ${currLevel2}`);

        const body = $('body');
        const target = $('#count-text');
        const text = `current: ${currLevel1}-${currLevel2}, remain: ${level1 - currLevel1}-${level2 - currLevel2}, total: ${level1}-${level2}`;
        if (target.length) {
            target.text(text);
        } else {
            body.prepend('<div id="count-text" style="position: fixed; left: 50%; transform: translate(-50%); z-index: 1001;">'
                         + text + '</div>');
        }
    }
})();