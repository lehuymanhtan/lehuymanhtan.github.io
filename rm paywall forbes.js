// ==UserScript==
// @name         fobes unblock?
// @namespace    https://github.com/lehuymanhtan
// @version      0.2
// @description  remove paywall on forbes.com
// @author       You
// @match        https://*.forbes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forbes.com
// @grant        none
// @downloadURL  https://lehuymanhtan.github.io/rm%20paywall%20forbes.js
// @updateURL    https://lehuymanhtan.github.io/rm%20paywall%20forbes.js
// ==/UserScript==

(function() {
    'use strict';
    function rm_paywall() {
    let back_drop = document.querySelector('.zephr-article-modal-backdrop.zephr-backdrop')
    let pop_up = document.querySelector('.zephr-article-modal-modal.zephr-generic-modal.no-close')
    if (!(back_drop || pop_up)) setTimeout(rm_paywall, 1000)
    if (back_drop) back_drop.remove()
    if (pop_up) pop_up.remove()
    let style = document.createElement('style')
    style.innerHTML = `
    .zephr-modal-open{
        overflow: unset;
    }
    `
    document.querySelector('head').appendChild(style)

}
rm_paywall()
    // Your code here...
})();
