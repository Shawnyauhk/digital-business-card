document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed. Initializing Wired.com theme script...');

    // --- Language Toggle Functionality ---
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const bodyEl = document.body;
    const htmlEl = document.documentElement;

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
        localStorage.setItem('preferredLanguage_wired', lang); // Use unique key for this theme
        // updateDynamicAriaLabelsIfUsed(); // If you use aria-labels that need switching
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            console.log('[Language] Toggle button clicked.');
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            setLanguage(currentLangIsZh ? 'en' : 'zh');
        });
    } else {
        console.error('[Language] Toggle button #lang-toggle-btn not found!');
    }
    const preferredLanguage = localStorage.getItem('preferredLanguage_wired') || 'en';
    setLanguage(preferredLanguage);

    // --- Update current year in footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();

    // --- vCard Data & Functionality ---
    const vCardData = { /* ... (保持不變) ... */
        firstName: 'Shawn', lastName: 'Yau', fullNameDisplayEn: 'Shawn Yau',
        fullNameDisplayZh: '邱永生 (Shawn Yau)', titleEn: 'Senior Application Specialist',
        titleZh: '高級應用專員', organizationEn: 'Foresys Co., Ltd.',
        organizationZh: '科先系統有限公司', telWork: '39194000', faxWork: '39194099',
        email: 'shawnyau@foresys.com', website: 'http://www.foresys.com.hk',
        addressEn: { street: 'Rm 505, Cameron Sino Technology Centre, 73 Chai Wan Kok St, Tsuen Wan', city: 'Tsuen Wan', country: 'Hong Kong' },
        addressZh: { full: '荃灣柴灣角街73號金岸科技中心505室', street: '柴灣角街73號金岸科技中心505室', city: '荃灣', country: '香港' }
    };
    function generateVCard(data, lang) { /* ... (保持不變) ... */
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
    const downloadVCardBtn = document.getElementById('downloadVCard');
    if (downloadVCardBtn) { /* ... (保持不變) ... */
         downloadVCardBtn.addEventListener('click', () => {
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            const langForVCard = currentLangIsZh ? 'zh' : 'en';
            const vCardString = generateVCard(vCardData, langForVCard);
            const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filenameBase = currentLangIsZh ? vCardData.fullNameDisplayZh.split(' ')[0] : vCardData.fullNameDisplayEn.replace(/\s+/g, '_');
            const companyNameBase = currentLangIsZh ? "科先系統" : "Foresys";
            a.download = `${filenameBase}_${companyNameBase}.vcf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // --- QR Code Modal Logic ---
    const qrModal = document.getElementById('qrModal');
    const qrModalTitleEl = document.getElementById('qrModalTitle');
    const qrcodeDisplayArea = document.getElementById('qrcodeDisplayArea'); // Updated ID
    const closeModalBtn = qrModal ? qrModal.querySelector('.close-modal-btn') : null;
    const qrTitles = {
        en: { page: 'Scan to visit this page', vcard: 'Scan to add contact (vCard)' },
        zh: { page: '掃描以瀏覽此網頁', vcard: '掃描以加入聯絡資訊 (vCard)' }
    };
    function showQrCode(type, text) {
        if (!qrModal || !qrModalTitleEl || !qrcodeDisplayArea) {
             console.error('[QR] Modal sub-elements not found.'); return;
        }
        const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
        const langForTitle = currentLangIsZh ? 'zh' : 'en';
        qrModalTitleEl.textContent = qrTitles[langForTitle][type];
        qrcodeDisplayArea.innerHTML = ''; // Clear previous QR
        try {
            new QRCode(qrcodeDisplayArea, { // Use qrcodeDisplayArea
                text: text, width: 200, height: 200, // Adjust size as needed
                colorDark : "#000000", colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } catch (e) { console.error("[QR] Error generating QR Code:", e); qrcodeDisplayArea.innerHTML = 'Error.'; }
        qrModal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
    function hideQrModal() { /* ... (保持不變) ... */
        if (!qrModal) return;
        qrModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', hideQrModal);
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && qrModal && qrModal.style.display === 'flex') hideQrModal(); });

    const showPageQRBtn = document.getElementById('showPageQR');
    if (showPageQRBtn) showPageQRBtn.addEventListener('click', () => showQrCode('page', window.location.href));
    const showVCardQRBtn = document.getElementById('showVCardQR');
    if (showVCardQRBtn) {
        showVCardQRBtn.addEventListener('click', () => {
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            const langForVCard = currentLangIsZh ? 'zh' : 'en';
            const vCardString = generateVCard(vCardData, langForVCard);
            showQrCode('vcard', vCardString);
        });
    }

    // --- Copy to Clipboard Functionality ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const contactItem = this.closest('.contact-item');
            if (!contactItem) { console.warn('[Copy] No parent .contact-item found.'); return; }
            let textToCopy = '';
            const copyTarget = contactItem.querySelector('.copy-target-text');

            if (copyTarget) {
                if (copyTarget.classList.contains('address-text')) {
                    const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
                    const langClass = currentLangIsZh ? '.lang-zh' : '.lang-en';
                    const langSpan = copyTarget.querySelector(langClass);
                    if (langSpan) textToCopy = langSpan.textContent.trim();
                } else if (copyTarget.classList.contains('whatsapp-number')) {
                    textToCopy = copyTarget.dataset.rawNumber || copyTarget.textContent.trim(); // Use raw number for copying
                } else {
                    textToCopy = copyTarget.textContent.trim();
                }
            }
            if (textToCopy) {
                console.log('[Copy] Attempting to copy:', textToCopy);
                copyToClipboard(textToCopy, this);
            } else {
                console.warn('[Copy] No text to copy for button in item:', contactItem);
            }
        });
    });


    // --- Tabs Functionality ---
    console.log('[Tabs] Initializing Tabs...');
    const tabLinks = document.querySelectorAll('.tabs-nav .tab-link');
    const tabPanelsContainer = document.querySelector('.tabs-content');
    console.log('[Tabs] Found tab links:', tabLinks.length, tabLinks);
    console.log('[Tabs] Found tab panels container:', tabPanelsContainer);

    if (tabLinks.length > 0 && tabPanelsContainer) {
        // Set initial active state
        const initialActiveLink = document.querySelector('.tabs-nav .tab-link.active');
        if (initialActiveLink) {
            const initialTargetId = initialActiveLink.dataset.tabTarget;
            if (initialTargetId) {
                const initialActivePanel = tabPanelsContainer.querySelector(initialTargetId);
                if (initialActivePanel && !initialActivePanel.classList.contains('active')) {
                    initialActivePanel.classList.add('active');
                }
            }
        }

        tabLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.dataset.tabTarget;
                if (!targetId) { console.error('[Tabs] Tab link missing data-tab-target.'); return; }
                const targetPanel = tabPanelsContainer.querySelector(targetId);

                tabLinks.forEach(item => item.classList.remove('active'));
                tabPanelsContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

                link.classList.add('active');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('[Tabs] Activated tab:', link.textContent.trim(), 'and panel:', targetId);
                } else {
                    console.error('[Tabs] Target panel NOT FOUND for selector:', targetId);
                }
            });
        });
    } else {
        console.error('[Tabs] Tab links or panels container not found. Tabs will NOT work.');
    }
    console.log('[Tabs] Tabs initialization complete.');

    // --- Function to update dynamic aria-labels (if you use them) ---
    // function updateDynamicAriaLabelsIfUsed() { ... }
    // updateDynamicAriaLabelsIfUsed();

    console.log('Script initialization finished for Wired.com theme.');
}); // End DOMContentLoaded

// --- Global Copy to Clipboard Function ---
function copyToClipboard(text, buttonElement) { /* ... (保持不變) ... */
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = buttonElement.innerHTML;
        const iconHTML = '<i class="fas fa-check"></i>';
        const currentLangIsZh = document.body.classList.contains('lang-active-zh');
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
        // ... (錯誤提示) ...
    });
}