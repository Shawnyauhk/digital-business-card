document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed. Initializing script...');

    // --- 獲取所有會用到的 DOM 元素引用 ---
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const bodyEl = document.body;
    const htmlEl = document.documentElement;
    const currentYearElement = document.getElementById('currentYear');

    // Tabs
    const tabLinks = document.querySelectorAll('.tabs-nav .tab-link');
    const tabPanelsContainer = document.querySelector('.tabs-content');

    // Action Buttons (from your image and previous code)
    const showStaticWebsiteQRBtn = document.getElementById('showStaticWebsiteQR');
    const addToFavoritesBtn = document.getElementById('addToFavoritesBtn'); // HTML 中 ID 應為 addToFavoritesBtn
    const saveToDesktopBtn = document.getElementById('saveToDesktopBtn');   // HTML 中 ID 應為 saveToDesktopBtn
    const shareUrlBtn = document.getElementById('shareUrlBtn');             // HTML 中 ID 應為 shareUrlBtn
    const downloadVCardBtn = document.getElementById('downloadVCard');
    const showVCardQRBtn = document.getElementById('showVCardQR');

    // QR Code Modal Elements
    const qrModal = document.getElementById('qrModal');
    const qrModalTitleEl = document.getElementById('qrModalTitle');
    const qrcodeDisplayArea = document.getElementById('qrcodeDisplayArea');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn'); // Generic close for all modals
    const instructionModal = document.getElementById('instructionModal'); // For "Save to Desktop"

    console.log('[Init] langToggleBtn:', langToggleBtn);
    console.log('[Init] qrModal:', qrModal);
    console.log('[Init] qrModalTitleEl:', qrModalTitleEl);
    console.log('[Init] qrcodeDisplayArea:', qrcodeDisplayArea);
    console.log('[Init] showStaticWebsiteQRBtn:', showStaticWebsiteQRBtn);


    // --- Language Toggle Functionality ---
    function setLanguage(lang) {
        console.log('[Language] Setting language to:', lang);
        if (lang === 'zh') {
            bodyEl.classList.add('lang-active-zh');
            bodyEl.classList.remove('lang-active-en');
            htmlEl.lang = 'zh-TW';
        } else {
            bodyEl.classList.remove('lang-active-zh');
            bodyEl.classList.add('lang-active-en');
            htmlEl.lang = 'en';
        }
        localStorage.setItem('preferredLanguage', lang);
        // updateDynamicAriaLabels(); // 如果你有這個函數
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            setLanguage(currentLangIsZh ? 'en' : 'zh');
        });
    } else { console.warn('[Language] Toggle button #lang-toggle-btn not found.');}
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(preferredLanguage);


    // --- Update current year in footer ---
    if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();

    // --- Tabs Functionality ---
    if (tabLinks.length > 0 && tabPanelsContainer) {
        // Initial active tab setup
        const initialActiveLink = document.querySelector('.tabs-nav .tab-link.active');
        if (initialActiveLink) {
            const initialTargetId = initialActiveLink.dataset.tabTarget;
            if (initialTargetId) {
                const initialActivePanel = tabPanelsContainer.querySelector(initialTargetId);
                if (initialActivePanel && !initialActivePanel.classList.contains('active')) {
                    initialActivePanel.classList.add('active');
                } else if (!initialActivePanel) {
                     console.error('[Tabs] Initial active panel for target', initialTargetId, 'not found!');
                }
            }
        }

        tabLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.dataset.tabTarget;
                if (!targetId) { console.error('[Tabs] Tab link missing data-tab-target.'); return; }

                tabLinks.forEach(item => item.classList.remove('active'));
                tabPanelsContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

                link.classList.add('active');
                const targetPanel = tabPanelsContainer.querySelector(targetId);
                if (targetPanel) targetPanel.classList.add('active');
                else console.error('[Tabs] Target panel not found for selector:', targetId);
            });
        });
    } else { console.warn('[Tabs] Tab links or panels container not found.'); }


    // --- QR Code Modal Logic ---
    const qrModalTitles = { /* ... (與上一版相同，包含 websiteImage, vcard, page) ... */
        en: { page: 'Scan to visit current page', vcard: 'Scan to add contact (vCard)', websiteImage: 'Scan to Visit Our Website' },
        zh: { page: '掃描以瀏覽當前網頁', vcard: '掃描以加入聯絡資訊 (vCard)', websiteImage: '掃描以訪問我們的網站' }
    };

    function showQrModalWithContent(type, contentValue) {
        console.log('[Modal] Showing content. Type:', type, 'Value:', contentValue);
        if (!qrModal || !qrModalTitleEl || !qrcodeDisplayArea) {
            console.error('[Modal] Critical modal elements (qrModal, qrModalTitleEl, or qrcodeDisplayArea) are missing.');
            return;
        }
        const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
        const langForTitle = currentLangIsZh ? 'zh' : 'en';
        qrModalTitleEl.textContent = qrModalTitles[langForTitle][type] || 'QR Code';
        qrcodeDisplayArea.innerHTML = '';

        if (type === 'websiteImage') {
            const img = document.createElement('img');
            img.src = contentValue;
            img.alt = qrModalTitles[langForTitle][type];
            img.classList.add('qr-code-image-in-modal');
            qrcodeDisplayArea.appendChild(img);
        } else { // Dynamic QR
            try {
                new QRCode(qrcodeDisplayArea, {
                    text: contentValue, width: 220, height: 220,
                    colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H
                });
            } catch (e) { console.error("[Modal] Error generating dynamic QR Code:", e); qrcodeDisplayArea.innerHTML = 'Error.'; }
        }
        qrModal.style.display = 'flex';
        bodyEl.classList.add('modal-open');
    }

    // --- Button Event Listeners ---
    const staticWebsiteQrImagePath = 'photo/QR.png';
    if (showStaticWebsiteQRBtn) {
        showStaticWebsiteQRBtn.addEventListener('click', () => {
            console.log('[Static QR] "Show Static Website QR" button clicked.');
            showQrModalWithContent('websiteImage', staticWebsiteQrImagePath);
        });
    } else { console.warn('[Static QR] Button #showStaticWebsiteQR not found.'); }

    const vCardData = { /* ... (你的 vCardData 對象) ... */
        firstName: 'Shawn', lastName: 'Yau', fullNameDisplayEn: 'Shawn Yau',
        fullNameDisplayZh: '邱永生 (Shawn Yau)', titleEn: 'Senior Application Specialist',
        titleZh: '高級應用專員', organizationEn: 'Foresys Co., Ltd.',
        organizationZh: '科先系統有限公司', telWork: '39194000', faxWork: '39194099',
        email: 'shawnyau@foresys.com', website: 'http://www.foresys.com.hk',
        addressEn: { street: 'Room 505, Golden Bear Industrial Centre, 73 Chai Wan Kok Street', city: 'Tsuen Wan', country: 'Hong Kong' },
        addressZh: { full: '荃灣柴灣角街73號金岸科技中心505室', street: '柴灣角街73號金岸科技中心505室', city: '荃灣', country: '香港' }
    };
    function generateVCard(data, lang) { /* ... (你的 generateVCard 函數) ... */
        const fullName = lang === 'zh' ? data.fullNameDisplayZh : data.fullNameDisplayEn;
        return [
            'BEGIN:VCARD', 'VERSION:3.0', `N:${data.lastName};${data.firstName};;;`,
            `FN:${fullName}`, `ORG:${data.organizationEn}`, `TITLE:${data.titleEn}`,
            `TEL;TYPE=WORK,VOICE:${data.telWork}`, `TEL;TYPE=WORK,FAX:${data.faxWork}`,
            `EMAIL;TYPE=INTERNET:${data.email}`, `URL:${data.website}`,
            `ADR;TYPE=WORK:;;${data.addressEn.street};${data.addressEn.city};;${data.addressEn.country}`,
            'END:VCARD'
        ].join('\n');
    }

    if (showVCardQRBtn) {
        showVCardQRBtn.addEventListener('click', () => {
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            const langForVCard = currentLangIsZh ? 'zh' : 'en';
            const vCardString = generateVCard(vCardData, langForVCard);
            showQrModalWithContent('vcard', vCardString);
        });
    } else { console.warn('[QR] Button #showVCardQR not found.');}


    // --- Copy to Clipboard Functionality ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function(event) { /* ... (與上一版相同的複製邏輯) ... */
            event.preventDefault();
            const contactItem = this.closest('.contact-item');
            if (!contactItem) return;
            let textToCopy = '';
            const emailLink = contactItem.querySelector('a[href^="mailto:"]');
            const copyTargetSpan = contactItem.querySelector('.copy-target-text'); // General target for TEL, FAX, Address

            if (emailLink) {
                textToCopy = emailLink.textContent.trim();
            } else if (copyTargetSpan) {
                if (copyTargetSpan.classList.contains('address-text')) { // Special handling for address
                    const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
                    const langClass = currentLangIsZh ? '.lang-zh' : '.lang-en';
                    const langSpan = copyTargetSpan.querySelector(langClass);
                    if (langSpan) textToCopy = langSpan.textContent.trim();
                } else { // For TEL, FAX
                    textToCopy = copyTargetSpan.textContent.trim();
                }
            }
            if (textToCopy) copyToClipboard(textToCopy, this); // copyToClipboard 需在全局或此作用域定義
            else console.warn('[Copy] No text found to copy for button in item:', contactItem);
        });
    });


    // --- Other Action Buttons ---
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener('click', (event) => { /* ... (與上一版相同的 addToFavorites 邏輯) ... */
            event.preventDefault();
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            const message = currentLangIsZh
                ? '請按 Ctrl+D (電腦) 或使用瀏覽器選單中的「加入書籤」功能。'
                : 'Please press Ctrl+D (on Desktop) or use the "Add Bookmark" feature in your browser menu.';
            alert(message);
        });
    } else { console.warn('[Action] Button #addToFavoritesBtn not found.'); }

    if (saveToDesktopBtn && instructionModal) {
        saveToDesktopBtn.addEventListener('click', (event) => { /* ... (與上一版相同的 saveToDesktop 邏輯) ... */
            event.preventDefault();
            instructionModal.style.display = 'flex';
            bodyEl.classList.add('modal-open');
        });
    } else {
        if(!saveToDesktopBtn) console.warn('[Action] Button #saveToDesktopBtn not found.');
        if(!instructionModal) console.warn('[Action] Modal #instructionModal for saveToDesktop not found.');
    }

    if (shareUrlBtn) {
        shareUrlBtn.addEventListener('click', async (event) => { /* ... (與上一版相同的 shareUrlBtn 邏輯) ... */
            event.preventDefault();
            const shareData = {
                title: 'Shawn Yau - Foresys Co., Ltd.', text: 'Check out this digital business card.',
                url: 'https://foresyscard.netlify.app/' // 你的實際網址
            };
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            try {
                if (navigator.share) { await navigator.share(shareData); }
                else { await navigator.clipboard.writeText(shareData.url); alert(currentLangIsZh ? '網址已複製！' : 'URL copied!'); }
            } catch (err) { console.error('Share failed:', err); alert(currentLangIsZh ? '分享失敗。' : 'Sharing failed.'); }
        });
    } else { console.warn('[Action] Button #shareUrlBtn not found.'); }


    // --- Generic Modal Closing Logic for ALL modals ---
    const allModals = document.querySelectorAll('.modal'); // 包括 #qrModal 和 #instructionModal
    console.log('[Modal] Found all modals:', allModals.length);

    function hideAllModals() {
        allModals.forEach(modal => modal.style.display = 'none');
        bodyEl.classList.remove('modal-open');
        console.log('[Modal] All modals hidden.');
    }

    // closeModalBtns 是 NodeList，包含所有 class 为 .close-modal-btn 的元素
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', hideAllModals);
    });

    window.addEventListener('click', (event) => { // 點擊模態框外部關閉
        allModals.forEach(modal => {
            if (event.target == modal) { // 確保點擊的是模態框背景本身
                hideAllModals();
            }
        });
    });
    
    window.addEventListener('keydown', (event) => { // ESC 鍵關閉
        if (event.key === 'Escape') {
            let modalIsOpen = false;
            allModals.forEach(modal => {
                if (modal.style.display === 'flex') modalIsOpen = true;
            });
            if (modalIsOpen) hideAllModals();
        }
    });

    // --- Function to update dynamic aria-labels (if you use them) ---
    function updateDynamicAriaLabels() { /* ... */ }
    updateDynamicAriaLabels();

    console.log('Script initialization finished.');
}); // End DOMContentLoaded


// --- Global Copy to Clipboard Helper Function ---
// (這個函數可以放在 DOMContentLoaded 外部，因為它不直接操作初始加載時的 DOM)
function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = buttonElement.innerHTML;
        const iconHTML = '<i class="fas fa-check"></i>';
        const currentLangIsZh = document.body.classList.contains('lang-active-zh'); // 假設 bodyEl 可全局訪問或重新獲取
        const copiedText = currentLangIsZh ? '已複製!' : 'Copied!';
        
        buttonElement.innerHTML = `${iconHTML} ${copiedText}`;
        buttonElement.classList.add('copied');
        buttonElement.disabled = true;

        setTimeout(() => {
            buttonElement.innerHTML = originalHTML;
            buttonElement.classList.remove('copied');
            buttonElement.disabled = false;
        }, 2000);
    }).catch(err => {
        console.error('[Copy] Failed: ', err);
        const originalHTML = buttonElement.innerHTML;
        const currentLangIsZh = document.body.classList.contains('lang-active-zh');
        const errorText = currentLangIsZh ? '複製失敗' : 'Error';
        buttonElement.innerHTML = errorText;
        setTimeout(() => { buttonElement.innerHTML = originalHTML; }, 2000);
    });
}