// ==UserScript==
// @name         fobes unblock?
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.forbes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forbes.com
// @grant        none
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
