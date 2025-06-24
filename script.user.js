// ==UserScript==
// @name         Enhanced WPManager System
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhanced WPManager System
// @author       You
// @match        https://sv.wptool.co/posts
// @match        https://tool.lowimedia.com/posts
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let __date = new Date()
    let __date_next_day = new Date()
    __date_next_day.setTime(__date_next_day.getTime() + 60*60*24*1000)
    let __today = (__date.getMonth() + 1) + '/' + __date.getDate() + '/' + __date.getFullYear()
    let __tomorrow = (__date_next_day.getMonth() + 1) + '/' + (__date_next_day.getDate()) + '/' + __date_next_day.getFullYear()

    // global init
    let optimize_layout = true
    //let select_webCatalog_index = 44 // this is for vietwedding. 6 for amazingtoday
    let select_webCatalog_index = 6
    //let select_webCatalog_index = randomIntFromInterval(1, 63)
    let select_website_index = 2
    let select_domain_index = 2
    let select_post_language_index = 2
    let input_fbImg_value = 'https://sv.wptool.co/media/04e1c71d677a43638281c380bcf5ac98.png'
    let input_permalink_postfix = '-tanfpt'

    let custom_time_1 = '23:00'
    let custom_time_2 = '2:00'
    let custom_time_3 = '6:00'
    let custom_time_4 = '18:00'

    let custom_date_1 = __today
    let custom_date_2 = __tomorrow
    let custom_date_3 = __tomorrow
    let custom_date_4 = __tomorrow

    let custom_text_1 = 'En savoir plus: '
    let custom_text_2 = 'Continuez à lire: '
    let custom_text_3 = 'Tous les détails: '
    let custom_text_4 = 'Lire: '

    //-----------
    const observer_config = { attributes: false, childList: true, subtree: false }

    //Tối ưu giao diện
    if (optimize_layout) {
        let aa = document.createElement('style')
        aa.innerHTML = `.input-group.mb-3 > textarea { height: 15rem; }`
        document.querySelector('head').appendChild(aa)
        // Format lại bảng
        // xóa cột 4, 5
        let thead = document.querySelector('thead')
        let tfoot = document.querySelector('tfoot')
        thead.querySelector('tr>th:nth-child(1)').style.maxWidth = '2rem'
        thead.querySelector('tr>th:nth-child(3)').style.maxWidth = '2rem'
        thead.querySelector('tr>th:nth-child(4)').style.overflow = 'hidden'
        tfoot.querySelector('tr>th:nth-child(4)').style.overflow = 'hidden'
        thead.querySelector('tr>th:nth-child(4)').style.maxWidth = '0'
        thead.querySelector('tr>th:nth-child(4)').style.padding = '0'
        thead.querySelector('tr>th:nth-child(5)').style.overflow = 'hidden'
        tfoot.querySelector('tr>th:nth-child(5)').style.overflow = 'hidden'
        thead.querySelector('tr>th:nth-child(5)').style.padding = '0'
        thead.querySelector('tr>th:nth-child(5)').style.maxWidth = '0'
        thead.querySelector('tr>th:nth-child(6)').style.width = '15rem'
        //
        // document.querySelector('select[name="tbPosts_length"]').appendChild(newOption(100))
        // document.querySelector('select[name="tbPosts_length"]').appendChild(newOption(200))
        // document.querySelector('select[name="tbPosts_length"]').appendChild(newOption(500))
        document.querySelector('select[name="tbPosts_length"]').innerHTML = '<option value="100">100</option><option value="200">200</option><option value="500">500</option>'
        document.querySelector('select[name="tbPosts_length"]').dispatchEvent(new Event('change'))
    }

    //### Begin Thêm bài đăng / Tìm kiếm bài đăng ####
    //event show modal
    let newPostModal = document.querySelector('#modelPost')
    let newPostModal_monitor_interval = null
    if (newPostModal) {
        let select_website = newPostModal.querySelector('select#websites')
        let select_webCatalog = newPostModal.querySelector('select#categories')
        let select_language = newPostModal.querySelector('select#out-language')
        let input_fbImg = newPostModal.querySelector('input#txt-thumbnail-image')
        let input_postImg = newPostModal.querySelector('input#txt-feature-image')
        let input_permalink = newPostModal.querySelector('.modal-body > div:nth-child(2) > div > div:nth-child(2) > input')
        let input_title = newPostModal.querySelector('input#title')
        let wrapper_postImg_select = input_postImg.parentElement
        // ===mod ui===
        // select post img
        wrapper_postImg_select.querySelector('button#btn-open-file-feature').innerText = '📁'
        wrapper_postImg_select.querySelector('button#btn-open-file-feature').classList.remove('btn-secondary')
        wrapper_postImg_select.querySelector('button#btn-open-file-feature').classList.add('btn-outline-secondary')
        if (!wrapper_postImg_select.querySelector('button#btn_select_postImg1')) {
            let btn_select_postImg1 = document.createElement('button')
            btn_select_postImg1.innerHTML = 'wwe'
            btn_select_postImg1.id = 'btn_select_postImg1'
            btn_select_postImg1.classList.add('btn', 'btn-outline-secondary')
            btn_select_postImg1.addEventListener('click', (e) => {
                e.preventDefault()
                input_postImg.value = 'https://cdn.77ne.com/storage/042025/8dc8a51388bf41fab2e304dc881fae7c.jpg'
            })
            wrapper_postImg_select.insertBefore(btn_select_postImg1, wrapper_postImg_select.querySelector('button#btn-open-file-feature'))
        }
        if (!wrapper_postImg_select.querySelector('button#btn_select_postImg2')) {
            let btn_select_postImg2 = document.createElement('button')
            btn_select_postImg2.innerHTML = 'news'
            btn_select_postImg2.id = 'btn_select_postImg2'
            btn_select_postImg2.classList.add('btn', 'btn-outline-secondary')
            btn_select_postImg2.addEventListener('click', (e) => {
                e.preventDefault()
                input_postImg.value = 'https://cdn.77ne.com/storage/042025/5c0bb0d31cd94e5c814517f8f4120552.jpg'
            })
            wrapper_postImg_select.insertBefore(btn_select_postImg2, wrapper_postImg_select.querySelector('button#btn-open-file-feature'))
        }

        newPostModal.addEventListener('shown.bs.modal', () => {
            let old_value = input_permalink.value

            // ===auto set website, catalog and language===
            select_website.selectedIndex = select_website_index
            select_website.dispatchEvent(new Event('change'))
            select_language.selectedIndex = select_post_language_index
            select_language.dispatchEvent(new Event('change'))

            // init MutationObserver
            // Callback function to execute when mutations are observed
            const callback = (mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        if (mutation.addedNodes.length) {
                            // select_webCatalog.selectedIndex = select_webCatalog_index
                            select_webCatalog.selectedIndex = select_webCatalog_index ? select_webCatalog_index : randomIntFromInterval(1, 63)
                        }
                    }
                }
                console.log('MutationObserver callback done!')
            };
            let observer = new MutationObserver(callback);
            observer.observe(select_webCatalog, observer_config);

            // ===auto set img===
            input_fbImg.value = input_fbImg_value


            // ===auto fix permalink===
            newPostModal_monitor_interval = setInterval(function () {
                if (input_permalink.value != old_value) {
                    let length = randomIntFromInterval(60, 95)
                    let new_value = input_permalink.value.slice(0, length)
                    new_value = new_value + input_permalink_postfix
                    input_permalink.value = new_value
                    old_value = new_value
                }
            }, 100);
            console.log('new interval:', newPostModal_monitor_interval)

        })
        //event close modal
        newPostModal.addEventListener('hidden.bs.modal', () => {
            clearInterval(newPostModal_monitor_interval)
            console.log('clear interval:', newPostModal_monitor_interval)
        })

    } else {
        console.log('newPostModal not found!')
    }

    //### End Thêm bài đăng / Tìm kiếm bài đăng ####
    //### Begin Đăng page ####
    let addFanPageModal = document.querySelector('#modalAddFanpage')
    let addFanPageModal_monitor_interval = null
    if (addFanPageModal) {
        let select_account = addFanPageModal.querySelector('select#via-accounts-images')
        let select_page = addFanPageModal.querySelector('select#pages')
        let select_website = addFanPageModal.querySelector('select#websites-posts-images')
        let select_domain = addFanPageModal.querySelector('select#post-vercel-images')
        let textarea_comments = addFanPageModal.querySelector('textarea#comments')
        let input_time_post = addFanPageModal.querySelector('input#scheduled-hours-images')
        let input_date_post = addFanPageModal.querySelector('input#scheduled-date-images')
        let input_time_comment = addFanPageModal.querySelector('input#scheduled-hours-comments')
        let input_date_comment = addFanPageModal.querySelector('input#scheduled-date-comments')
        let input_is_published__form_group = addFanPageModal.querySelector('input#is_published').parentElement.parentElement
        let textarea_comments__form_group = textarea_comments.parentElement
        // ===Mod ui===
        // custom time btn
        let wrapper_custom_time_btn = document.createElement('div')
        wrapper_custom_time_btn.classList.add('form-group')
        wrapper_custom_time_btn.classList.add('mb-4')
        wrapper_custom_time_btn.innerHTML = `
        <div class="d-flex">
            <div class="input-group">
                <button id="custom_time_btn_1" style="flex: 1 1 auto" class="btn btn-outline-secondary"></button>
                <button id="custom_time_btn_2" style="flex: 1 1 auto" class="btn btn-outline-secondary"></button>
                <button id="custom_time_btn_3" style="flex: 1 1 auto" class="btn btn-outline-secondary"></button>
                <button id="custom_time_btn_4" style="flex: 1 1 auto" class="btn btn-outline-secondary"></button>
            </div>
        </div>
        `
        let btn_custom_time_1 = wrapper_custom_time_btn.querySelector('button#custom_time_btn_1')
        btn_custom_time_1.innerText = custom_time_1
        btn_custom_time_1.addEventListener('click', (e) => {
            e.preventDefault()
            input_time_post.value = custom_time_1
            input_date_post.value = custom_date_1
            input_time_post.dispatchEvent(new Event('blur'))
        })
        let btn_custom_time_2 = wrapper_custom_time_btn.querySelector('button#custom_time_btn_2')
        btn_custom_time_2.innerText = custom_time_2
        btn_custom_time_2.addEventListener('click', (e) => {
            e.preventDefault()
            input_time_post.value = custom_time_2
            input_date_post.value = custom_date_2
            input_time_post.dispatchEvent(new Event('blur'))
        })
        let btn_custom_time_3 = wrapper_custom_time_btn.querySelector('button#custom_time_btn_3')
        btn_custom_time_3.innerText = custom_time_3
        btn_custom_time_3.addEventListener('click', (e) => {
            e.preventDefault()
            input_time_post.value = custom_time_3
            input_date_post.value = custom_date_3
            input_time_post.dispatchEvent(new Event('blur'))
        })
        let btn_custom_time_4 = wrapper_custom_time_btn.querySelector('button#custom_time_btn_4')
        btn_custom_time_4.innerText = custom_time_4
        btn_custom_time_4.addEventListener('click', (e) => {
            e.preventDefault()
            input_time_post.value = custom_time_4
            input_date_post.value = custom_date_4
            input_time_post.dispatchEvent(new Event('blur'))
        })
        input_is_published__form_group.parentElement.insertBefore(wrapper_custom_time_btn, input_is_published__form_group.nextSibling)

        // custom text btn
        let wrapper_custom_text_btn = document.createElement('div')
        wrapper_custom_text_btn.classList.add('input-group')
        wrapper_custom_text_btn.style.paddingTop = '1rem'
        wrapper_custom_text_btn.innerHTML = `
            <button id="custom_text_btn_1" style="flex: 1 1 auto" class="btn btn-outline-secondary">1</button>
            <button id="custom_text_btn_2" style="flex: 1 1 auto" class="btn btn-outline-secondary">2</button>
            <button id="custom_text_btn_3" style="flex: 1 1 auto" class="btn btn-outline-secondary">3</button>
            <button id="custom_text_btn_4" style="flex: 1 1 auto" class="btn btn-outline-secondary">4</button>
        `
        let btn_custom_text_1 = wrapper_custom_text_btn.querySelector('button#custom_text_btn_1')
        btn_custom_text_1.addEventListener('click', (e) => {
            e.preventDefault()
            textarea_comments.value = custom_text_1 + clean_url(get_url(textarea_comments.value))
        })
        let btn_custom_text_2 = wrapper_custom_text_btn.querySelector('button#custom_text_btn_2')
        btn_custom_text_2.addEventListener('click', (e) => {
            e.preventDefault()
            textarea_comments.value = custom_text_2 + clean_url(get_url(textarea_comments.value))
        })
        let btn_custom_text_3 = wrapper_custom_text_btn.querySelector('button#custom_text_btn_3')
        btn_custom_text_3.addEventListener('click', (e) => {
            e.preventDefault()
            textarea_comments.value = custom_text_3 + clean_url(get_url(textarea_comments.value))
        })
        let btn_custom_text_4 = wrapper_custom_text_btn.querySelector('button#custom_text_btn_4')
        btn_custom_text_4.addEventListener('click', (e) => {
            e.preventDefault()
            textarea_comments.value = custom_text_4 + clean_url(get_url(textarea_comments.value))
        })
        textarea_comments__form_group.parentElement.append(wrapper_custom_text_btn)




        addFanPageModal.addEventListener('shown.bs.modal', () => {
            //===auto sync time post and comment
            let input_date_post_old_value = input_date_post.value
            let input_date_comment_old_value = input_date_comment.value
            let textarea_comments_old_value = textarea_comments.value
            addFanPageModal_monitor_interval = setInterval(function () {
                if (input_date_post.value != input_date_post_old_value) {
                    input_date_post_old_value = input_date_post.value;
                    input_date_post.dispatchEvent(new Event('change'));
                }

                if (input_date_comment.value != input_date_comment_old_value) {
                    input_date_comment_old_value = input_date_comment.value;
                    input_date_comment.dispatchEvent(new Event('change'));
                }

                if (textarea_comments.value != textarea_comments_old_value) {
                    textarea_comments_old_value = textarea_comments.value;
                    textarea_comments.dispatchEvent(new Event('change'));
                }
            }, 100);
            console.log('new interval:', addFanPageModal_monitor_interval)

            input_time_post.addEventListener('change', () => {
                input_time_comment.value = input_time_post.value;
            });
            input_date_post.addEventListener('change', () => {
                input_date_comment.value = input_date_post.value;
            });
            input_time_comment.addEventListener('change', () => {
                input_time_post.value = input_time_comment.value;
            });
            input_date_comment.addEventListener('change', () => {
                input_date_post.value = input_date_comment.value;
            });


            //===auto set website and domain====
            // init MutationObserver
            // Callback function to execute when select domain is updated
            const callback = (mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        if (mutation.addedNodes.length) {
                            select_domain.selectedIndex = select_domain_index
                            select_domain.dispatchEvent(new Event('change'))
                        }
                    }
                }
                console.log('MutationObserver callback set domain done!')
            };
            let observer = new MutationObserver(callback);
            observer.observe(select_domain, observer_config);

            select_website.selectedIndex = select_website_index
            select_website.dispatchEvent(new Event('change'))



            //===auto set fb account===
            // select_account.selectedIndex = 1
            // select_account.dispatchEvent(new Event('change'))
            // const callback2 = (mutationList, observer) => {
            //     for (const mutation of mutationList) {
            //         if (mutation.type === "childList") {
            //             console.log('mutation.addedNodes.length: ' + mutation.addedNodes.length)
            //             if (mutation.addedNodes.length) {
            //                 select_account.selectedIndex = 1
            //                 select_account.dispatchEvent(new Event('change'))
            //                 console.log('set fb account!')
            //             }
            //         }
            //     }
            //     console.log('MutationObserver callback set fb account done!')
            // };
            // let observer2 = new MutationObserver(callback2);
            // observer2.observe(select_account, observer_config);

            //===auto remove querry string in url and change http to https in comment===
            textarea_comments.addEventListener('change', () => {
                textarea_comments.value = clean_url(textarea_comments.value)
            })


        })
        //event close modal
        addFanPageModal.addEventListener('hidden.bs.modal', () => {
            clearInterval(addFanPageModal_monitor_interval)
            console.log('clear interval:', addFanPageModal_monitor_interval)
        })
    } else {
        console.log('addFanPageModal not found!')
    }

    //### End Đăng page ####
    //### Begin Đăng thread ####
    let addThreadModal_monitor_interval = null
    let addThreadModal = document.querySelector('#modalAddThreads')
    if (addThreadModal) {
        let select_account = addThreadModal.querySelector('select#thread_accounts')
        let select_website = addThreadModal.querySelector('select#websites-posts-threads')
        let select_domain = addThreadModal.querySelector('select#post-vercel-threads')
        let textarea_comments = addThreadModal.querySelector('textarea#comments_threads')
        let input_time_post = addThreadModal.querySelector('input#scheduled-hours-threads')
        let input_date_post = addThreadModal.querySelector('input#scheduled-date-threads')
        let input_time_comment = addThreadModal.querySelector('input#scheduled-hours-comments-threads')
        let input_date_comment = addThreadModal.querySelector('input#scheduled-date-comments-threads')
        let input_date_post_old_value = input_date_post.value
        let input_date_comment_old_value = input_date_comment.value
        let textarea_comments_old_value = textarea_comments.value
        addThreadModal.addEventListener('shown.bs.modal', () => {

            addFanPageModal_monitor_interval = setInterval(function () {
                if (input_date_post.value != input_date_post_old_value) {
                    input_date_post_old_value = input_date_post.value;
                    input_date_post.dispatchEvent(new Event('change'));
                }

                if (input_date_comment.value != input_date_comment_old_value) {
                    input_date_comment_old_value = input_date_comment.value;
                    input_date_comment.dispatchEvent(new Event('change'));
                }

                if (textarea_comments.value != textarea_comments_old_value) {
                    textarea_comments_old_value = textarea_comments.value;
                    textarea_comments.dispatchEvent(new Event('change'));
                }
            }, 100);

            //===auto sync time post and comment
            input_time_post.addEventListener('change', () => {
                input_time_comment.value = input_time_post.value;
            });
            input_date_post.addEventListener('change', () => {
                input_date_comment.value = input_date_post.value;
            });
            input_time_comment.addEventListener('change', () => {
                input_time_post.value = input_time_comment.value;
            });
            input_date_comment.addEventListener('change', () => {
                input_date_post.value = input_date_comment.value;
            });

            console.log('new interval:', addThreadModal_monitor_interval)

            //===auto set website and domain====
            select_website.selectedIndex = select_website_index
            select_website.dispatchEvent(new Event('change'))

            // init MutationObserver
            // Callback function to execute when mutations are observed
            const callback = (mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        if (mutation.addedNodes.length) {
                            select_domain.selectedIndex = select_domain_index
                            select_domain.dispatchEvent(new Event('change'))
                        }
                    }
                }
                console.log('MutationObserver callback done!')
            };
            let observer = new MutationObserver(callback);
            observer.observe(select_domain, observer_config);

            //===auto remove querry string in url and change http to https in comment===
            textarea_comments.addEventListener('change', () => {
                textarea_comments.value = clean_url(textarea_comments.value)
            })


        })
        addThreadModal.addEventListener('hidden.bs.modal', () => {
            clearInterval(addThreadModal_monitor_interval)
            console.log('clear interval:', addThreadModal_monitor_interval)
        })
    } else {
        console.log('addThreadModal not found!')
    }

    //### End Đăng thread ####

    //### Global function ####
    function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function get_url(text){
        let url = text.match(/(https?:\/\/[^\s]+)/g)
        if (url) {
            return url[0]
        } else {
            return ''
        }
    }

    function clean_url(text){
        return text.replace(/(https?:\/\/[^\s]+)/g, function (x) {
            let url = new URL(x)
            let new_origin = url.origin.replace(/^http:/, 'https:')
            let new_url = new_origin + url.pathname
            return new_url
        });
    }




})();
