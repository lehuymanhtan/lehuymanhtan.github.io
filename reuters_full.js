// ==UserScript==
// @name         reuters full
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  try to take over the world!
// @author       Tan Le :)
// @match        https://www.reuters.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reuters.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log('start!')
    const newElement = document.createElement('style');
    newElement.textContent = 'div#fusion-app>header+div { max-height: unset}\n div#fusion-app>header+div>div { max-height: unset}';
    document.body.appendChild(newElement);

    //document.querySelector('div#fusion-app>header+div').style.maxHeight = 'unset';
    // Your code here...
})();
