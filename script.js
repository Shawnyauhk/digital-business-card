document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // --- Language Toggle Functionality ---
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const bodyEl = document.body;
    const htmlEl = document.documentElement;

    function setLanguage(lang) {
        if (lang === 'zh') {
            bodyEl.classList.add('lang-active-zh');
            htmlEl.lang = 'zh-TW';
        } else {
            bodyEl.classList.remove('lang-active-zh');
            htmlEl.lang = 'en';
        }
        localStorage.setItem('preferredLanguage', lang);
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            setLanguage(currentLangIsZh ? 'en' : 'zh');
        });
    }

    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(preferredLanguage);


    // --- Update current year in footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // --- Tabs Functionality ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanelsContainer = document.querySelector('.tabs-content');
    if (tabLinks.length > 0 && tabPanelsContainer) {
        tabLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.dataset.tabTarget;
                tabLinks.forEach(item => item.classList.remove('active'));
                tabPanelsContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                link.classList.add('active');
                if (targetId) {
                    const targetPanel = tabPanelsContainer.querySelector(targetId);
                    if(targetPanel) targetPanel.classList.add('active');
                }
            });
        });
    }

    // --- Copy to Clipboard Functionality for Contact Items ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const contactItem = this.closest('.contact-item');
            if (!contactItem) return;
            let textToCopy = '';
            const link = contactItem.querySelector('a');
            const faxSpan = contactItem.querySelector('.fax-number');
            const addressSpan = contactItem.querySelector('.address-text');
            
            if (link) {
                textToCopy = link.textContent;
            } else if (faxSpan) {
                textToCopy = faxSpan.textContent;
            } else if (addressSpan) {
                const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
                const langClass = currentLangIsZh ? '.lang-zh' : '.lang-en';
                const langSpan = addressSpan.querySelector(langClass);
                if (langSpan) textToCopy = langSpan.textContent.trim();
            }
            if (textToCopy) copyToClipboard(textToCopy, this);
        });
    });

    // --- NEW ACTION BUTTON LOGIC (Correctly implemented) ---

    // 1. Add to Favorites Button
    const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');
            const message = currentLangIsZh
                ? '請按 Ctrl+D (電腦) 或使用瀏覽器選單中的「加入書籤」功能。'
                : 'Please press Ctrl+D (on Desktop) or use the "Add Bookmark" feature in your browser menu.';
            alert(message);
        });
    }

    // 2. Save to Desktop Button (Shows Instruction Modal)
    const saveToDesktopBtn = document.getElementById('saveToDesktopBtn');
    const instructionModal = document.getElementById('instructionModal');
    if (saveToDesktopBtn && instructionModal) {
        saveToDesktopBtn.addEventListener('click', (event) => {
            event.preventDefault();
            instructionModal.style.display = 'flex';
            bodyEl.classList.add('modal-open');
        });
    }

    // 3. Share URL Button
    const shareUrlBtn = document.getElementById('shareUrlBtn');
    if (shareUrlBtn) {
        shareUrlBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const shareData = {
                title: 'Shawn Yau - Foresys Co., Ltd.',
                text: 'Check out this digital business card.',
                url: 'https://www.wired.com' // Placeholder URL
            };
            
            const currentLangIsZh = bodyEl.classList.contains('lang-active-zh');

            try {
                if (navigator.share) { // Use Web Share API if available
                    await navigator.share(shareData);
                } else { // Fallback for desktop: copy URL
                    await navigator.clipboard.writeText(shareData.url);
                    alert(currentLangIsZh ? '網址已複製到剪貼簿！' : 'URL copied to clipboard!');
                }
            } catch (err) {
                console.error('Share failed:', err);
                alert(currentLangIsZh ? '分享失敗。' : 'Sharing failed.');
            }
        });
    }


    // --- Generic Modal Closing Logic for ALL modals ---
    const allModals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    function hideAllModals() {
        allModals.forEach(modal => modal.style.display = 'none');
        bodyEl.classList.remove('modal-open');
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', hideAllModals);
    });

    window.addEventListener('click', (event) => {
        allModals.forEach(modal => {
            if (event.target == modal) {
                hideAllModals();
            }
        });
    });
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hideAllModals();
        }
    });


    // --- Global Copy to Clipboard Helper Function ---
    function copyToClipboard(text, buttonElement) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = buttonElement.innerHTML;
            buttonElement.innerHTML = '<i class="fas fa-check"></i>';
            buttonElement.classList.add('copied');
            buttonElement.disabled = true;

            setTimeout(() => {
                buttonElement.innerHTML = originalHTML;
                buttonElement.classList.remove('copied');
                buttonElement.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Copy to clipboard failed: ', err);
        });
    }
});