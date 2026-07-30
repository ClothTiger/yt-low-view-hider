// ==UserScript==
// @name         YouTube Low View & Live Hider
// @namespace    https://github.com/ClothTiger/yt-low-view-hider
// @version      1.5.0
// @description  Hides YouTube videos across feeds and search results with fewer views/viewers than specified.
// @author       You
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @updateURL    https://raw.githubusercontent.com/ClothTiger/yt-low-view-hider/main/yt-low-view-hider.user.js
// @downloadURL  https://raw.githubusercontent.com/ClothTiger/yt-low-view-hider/main/yt-low-view-hider.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const MIN_VIEWS = 3000;

    function parseViews(text) {
        if (!text) return null;

        const cleanText = text.replace(/\u00a0/g, ' ').replace(/,/g, '');

        if (/no views/i.test(cleanText)) return 0;

        const match = cleanText.match(/([\d.]+)\s*([KMBkmb]?)\s*(?:views?|watching)/i);
        if (!match) return null;

        let num = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        if (unit === 'K') num *= 1000;
        else if (unit === 'M') num *= 1000000;
        else if (unit === 'B') num *= 1000000000;

        return num;
    }

    function processVideos() {
        const cards = document.querySelectorAll(`
            ytd-rich-item-renderer,
            ytd-video-renderer,
            ytd-compact-video-renderer,
            ytd-grid-video-renderer
        `);

        cards.forEach(card => {
            const cardText = card.textContent;
            const views = parseViews(cardText);

            if (views !== null && views < MIN_VIEWS) {
                card.style.setProperty('display', 'none', 'important');
            }
        });
    }

    const observer = new MutationObserver(() => processVideos());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-finish', processVideos);

    processVideos();
})();
