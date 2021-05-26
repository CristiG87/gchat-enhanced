const BASE_ROOM_PATH = `https://chat.google.com/room`

const quoteSvgIcon = `
        <svg viewBox="0 0 24 24" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" style="margin-top: 4px">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 8v3.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5zm6 0v3.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5z"/>
        </svg>`

const extensionCss = `
    .x-chat-copy {
        margin-left: 4px;
        border: 1px solid #dadce0;
        background-color: transparent;
        border-radius: 12px;
        box-sizing: border-box;
        font-family: 'Google Sans',Arial,sans-serif;
        font-size: .875rem;
        font-weight: 500;
        line-height: 1.25rem;
        color: #1967d2;
        padding: 0 12px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        transition: filter 0.3s ease 0.3s;
    }

    .x-chat-copy:hover {
        border-color: transparent;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.30), 0 1px 3px 1px rgba(60,64,67,0.15);
    }

    .x-chat-copy:active {
        background-color: rgba(26,115,232,0.122);
    }

    .x-chat-copy[data-tooltip] {
        position: relative;
    }

    /* Base styles for the entire tooltip */
    .x-chat-copy[data-tooltip]:before,
    .x-chat-copy[data-tooltip]:after {
        position: absolute;
        visibility: hidden;
        opacity: 0;
        transition:
            opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out,
            transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        transform:         translate3d(0, 0, 0);
        pointer-events: none;
    }

    /* Show the entire tooltip on hover and focus */
    .x-chat-copy[data-tooltip]:hover:before,
    .x-chat-copy[data-tooltip]:hover:after,
    .x-chat-copy[data-tooltip]:focus:before,
    .x-chat-copy[data-tooltip]:focus:after {
        visibility: visible;
        opacity: 1;
    }

    /* Base styles for the tooltip's directional arrow */
    .x-chat-copy[data-tooltip]:before {
        z-index: 1001;
        border: 6px solid transparent;
        background: transparent;
        content: "";
    }

    /* Base styles for the tooltip's content area */
    .x-chat-copy[data-tooltip]:after {
        z-index: 1000;
        padding: 8px;
        background-color: #000;
        background-color: hsla(0, 0%, 20%, 0.9);
        color: #fff;
        content: attr(data-tooltip);
        font-size: 14px;
        line-height: 1.2;
    }

    /* Align tooltips */

    .x-chat-copy[data-tooltip]:before,
    .x-chat-copy[data-tooltip]:after {
        bottom: 100%;
        left: 50%;
    }

    .x-chat-copy[data-tooltip]:before {
        margin-left: -6px;
        margin-bottom: -12px;
        border-top-color: #000;
        border-top-color: hsla(0, 0%, 20%, 0.9);
    }

    .x-chat-copy[data-tooltip]:after {
        margin-left: -30px;
    }

    .x-chat-copy[data-tooltip]:hover:before,
    .x-chat-copy[data-tooltip]:hover:after,
    .x-chat-copy[data-tooltip]:focus:before,
    .x-chat-copy[data-tooltip]:focus:after {
        -webkit-transform: translateY(-12px);
        -moz-transform:    translateY(-12px);
        transform:         translateY(-12px);
    }

    #x-clipboard {
        opacity: .01;
        height:0;
        position:absolute;
        z-index: -1;
    }

    a[aria-label="Build software better, together, Web Page."],
    a[aria-label="Sign in - Google Accounts, Web Page."],
    a[aria-label="Google Accounts, Web Page."] {
        display: none;
    }

    .FMTudf {
        padding:10px !important;
        font-size: .7rem !important;
        line-height: 0.9rem !important;
        background:#f1f1f1 !important;
    }
    `

function addStyle(css) {
    var styleElement = document.createElement('style', { type: 'text/css' });
    styleElement.appendChild(document.createTextNode(css));

    document.head.appendChild(styleElement);
}

function addThreadClipboard() {
    var element = document.createElement('textarea');
    element.setAttribute("id", "x-clipboard");

    document.body.appendChild(element);
}

function main() {
    const clipboard = document.querySelector("#x-clipboard")
    const threads = document.querySelectorAll("c-wiz[data-topic-id][data-local-topic-id]")

    threads.forEach((thread) => {
        // FEATURE: Copy thread links
        let copy = thread.querySelector('.x-chat-copy');
        if (thread.getAttribute("data-topic-id") && !copy) {
            // Adding copy thread link buttons to thread
            copy = document.createElement("div");
            copy.className = "x-chat-copy";
            copy.innerHTML = `Copy`;
            copy.addEventListener('click', function () {
                const roomId = document.querySelector("c-wiz[data-group-id]").getAttribute("data-group-id").split("/")[1];
                const threadId = thread.getAttribute("data-topic-id");

                clipboard.value = `${BASE_ROOM_PATH}/${roomId}/${threadId}`;
                clipboard.select();
                document.execCommand('copy');

                copy.classList.toggle("bg-active");
                copy.innerHTML = `Copied`;
                setTimeout(() => {
                    copy.innerHTML = `Copy`;
                    copy.classList.toggle("bg-active");
                }, 200);
            });

            var actions = thread.querySelector('div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)');
            if (
                actions &&
                actions.children.length === 2 &&
                actions.children[0].tagName === 'SPAN' &&
                actions.children[1].tagName === 'SPAN'
            ) {
                actions.style = 'display: inline-block;';

                actions.parentElement.style = 'display: inline-block; width: unset; opacity: 1;';
                actions.parentElement.parentElement.appendChild(copy);
                actions.parentElement.parentElement.parentElement.parentElement.style = 'padding-top: 56px;';
            }
        }

        // FEATURE: tweet-sized quotes

        // Iterating on each message in the thread jscontroller="VXdfxd"
        const messages = thread.querySelectorAll('div[jscontroller="VXdfxd"]')

        messages.forEach((message) => {
            const alreadyDefined = message.parentElement.parentElement.querySelector('[data-tooltip*="Quote Message"')
            const existingReactAction = message.parentElement.parentElement.children.length === 1

            if (alreadyDefined || existingReactAction) return

            const container = document.createElement('div');
            // Quote svg icon
            container.innerHTML = quoteSvgIcon;
            container.className = message.className;
            container.setAttribute('data-tooltip', 'Quote Message');
            const quoteSVG = container.children[0]
            const svg = message.querySelector('svg');
            if (svg) {
                svg.classList.forEach(c => quoteSVG.classList.add(c));
            } else {
                return;
            }

            var elRef = message;
            // Find parent container of the message
            // These messages are then grouped together when they are from the recipient
            // and the upper most one has the name and time of the message
            while (!(elRef.className && elRef.className.includes('nF6pT')) && elRef.parentElement) {
                elRef = elRef.parentElement;
            }
            if (elRef.className.includes('nF6pT')) {

                var messageIndex, author;
                [...elRef.parentElement.children].forEach((messageEl, index) => {
                    if (messageEl === elRef) {
                        messageIndex = index;
                    }
                });

                message.parentElement.parentElement.appendChild(container);
                container.addEventListener('click', () => {
                    while (messageIndex >= 0) {
                        if (elRef.parentElement.children[messageIndex].className.includes('AnmYv')) {
                            const nameContainer = elRef.parentElement.children[messageIndex].querySelector('[data-hovercard-id], [data-member-id]');
                            author = nameContainer.getAttribute('data-name');
                            break;
                        }
                        messageIndex -= 1;
                    }

                    var reply = message.parentElement.parentElement.parentElement.parentElement.children[0];
                    var quote = getQuotedReply(reply);

                    let input = thread.querySelector('div[contenteditable="true"]'); // This fetches the input element in channels
                    let dmInput = document.body.querySelectorAll('div[contenteditable="true"]'); // This fetches the input in DMs
                    input = input ? input : dmInput[dmInput.length - 1];
                    if (!input) {
                        return;
                    }

                    input.innerHTML = formatResponseContent(author, quote, input);
                    input.scrollIntoView();
                    input.click();
                    moveCursorToEnd(input);
                });
            }
        }
        );
    }
    );
}

function formatResponseContent(author, quoteText, inputEl) {
    var isDirectMessage = window.location.href.includes('/dm/');

    const quote = `${isDirectMessage ? "" : `${author}:`}\n${quoteText}\n`

    return ("```" + quote + "```\n" + inputEl.innerHTML)
}

function getQuotedReply(message) {
    const text = extractTextContent(message);
    const meet = message.querySelector('a[href*="https://meet.google.com/"]');
    const thread = message.querySelector('a[href*="https://chat.google.com/"]');
    const image = message.querySelector('a img[alt]');

    // TODO: tweed size it only text, and append all media to text content
    var quote = text
        || (meet ? `🎥: ${meet.href}` : "")
        || (image ? `📷: ${image.alt}` : "")
        || (thread ? `💬: ${thread.href}` : "")

    return quote.length < 280 ? quote : `${quote.substring(0, 280)} \n[...]`
}

function extractTextContent(message) {
    const MULTILNE_MARKUP_CLASS = 'FMTudf';
    const INLINE_MARKUP_CHAR_CLASS = "jn351e"
    let text = '';
    const childNodes = message.children[0].childNodes;

    for (var i = 0; i < childNodes.length; i += 1) {
        if (childNodes[i].nodeType === Node.TEXT_NODE) {
            text += childNodes[i].textContent;
        } else if (childNodes[i].className === INLINE_MARKUP_CHAR_CLASS) {
            continue;
        } else if (childNodes[i].className === MULTILNE_MARKUP_CLASS) {
            text += '...\n';
        } else if (childNodes[i].tagName === 'IMG') {
            text += childNodes[i].alt;
        } else {
            text += childNodes[i].innerHTML;
        }
    }

    return text;
}

function moveCursorToEnd(input) {
    // adapted from https://css-tricks.com/snippets/javascript/move-cursor-to-end-of-input/
    input.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(input);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        range.insertNode(document.createElement('br'));
        range.collapse();
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(input);
        textRange.collapse(false);
        textRange.select();
    }
}

function initialize() {
    addStyle(extensionCss);

    addThreadClipboard();
}

/************************
* Chat Extended         *
************************/
(function () {
    'use strict';

    initialize();

    main();

    document.documentElement.addEventListener('DOMSubtreeModified', main);
})();
