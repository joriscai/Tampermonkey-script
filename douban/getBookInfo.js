// ==UserScript==
// @name         Douban Get Book Info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get Book Info
// @author       Joris Cai
// @match        https://book.douban.com/subject/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// ==/UserScript==

(function() {
    const target = $('#wrapper');
    console.log('target', target);
    const btn = $('<a id="get-book-info" class="j a_show_login lnk-sharing lnk-douban-sharing">复制信息</a>');
    btn.css({
        float: 'right',
    });
    target.prepend(btn);
    btn.on('click', (e) => {
        const data = getInfo();
        btn.attr('data-clipboard-text', generateTable(data));

        const clipboard = new ClipboardJS('#get-book-info');
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
        clipboard.onClick(e);
    });

    function getInfo() {
        const data = {};
        data.name = $('h1').text();
        const infoItem = $('#info .pl');
        const infoSet = {
            '作者': 'author',
            '出版社': 'publisher',
        };
        // info
        Array.from(infoItem).forEach(ele => {
            const item = $(ele);
            const label = item.text().replace(':', '').trim();
            const value = infoSet[label];
            if (value) {
                const list = nextUntil(ele, '.pl');
                data[value] = $(list).text();
            }
        });

        // score
        data.score = $('.rating_num ').text();

        // trim data
        for (const key in data) {
            let value = data[key];
            value = value.replace(/(\r\n|\n|\r)/g, '');
            value = value.trim();
            if (key === 'author') {
                value = value.replace(':', '');
                const arr = value.split('/');
                value = arr.map(ele => ele.trim());
            }
            data[key] = value;
        }
        // url
        data.url = location.href;
        // pic
        data.pic = $('#mainpic img').attr('src');
        // intro
        data.intro = $('#link-report .intro').children();
        data.intro = Array.from(data.intro).map(ele => $(ele).text().trim()).join('\n');

        console.log('data', data);
        return data;
    }

    function nextUntil(curr, until, ret = []) {
        if (!curr.nextSibling || $(curr.nextSibling).is(until)) {
            return ret;
        } else {
            ret.push(curr.nextSibling);
            return nextUntil(curr.nextSibling, until, ret);
        }
    }

    function generateTable(data) {
        const { author = [] } = data;
        const authorTxt = author.map(ele => `[${ele}](https://book.douban.com/search/${ele})`).join('/');
        const date = new Date();
        const readDate = `${date.getFullYear()}年${date.getMonth() + 1}月`;

        const template = [
            `![${data.name}](${data.pic}#align=left&display=inline&width=196)`,
            `## 关于本书`,
            `| **书名** | [《${data.name}》](${data.url}) | **作者** | ${authorTxt} |`,
            `| --- | --- | --- | --- |`,
            `| **出版社** | ${data.publisher} | **阅读日期** | ${readDate} |`,
            `| **豆瓣评分** | **${data.score}** | **我的评分** | **0.0** |`,
            `## 内容简介`,
            `${data.intro}`,
        ];

        return template.join('\n');
    }
})();