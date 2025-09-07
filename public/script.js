class SVGGenerator {
    constructor() {
        this.baseUrl = window.location.origin;
        this.form = document.getElementById('svg-generator-form');
        this.previewImg = document.getElementById('preview-img');
        this.previewPlaceholder = document.getElementById('preview-placeholder');
        this.debounceTimer = null;
        
        this.initializeEventListeners();
        this.initializeTabs();
        this.initializeColorPicker();
        this.updatePreview();
    }

    initializeEventListeners() {
        // Form input listeners
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.debounceUpdate());
            input.addEventListener('change', () => this.debounceUpdate());
        });

        // Multiline removed

        // Copy button listeners
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyToClipboard(e));
        });
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active states
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    initializeColorPicker() {
        const colorPicker = document.getElementById('color');
        const colorText = document.getElementById('color-text');

        colorPicker.addEventListener('input', (e) => {
            colorText.value = e.target.value;
            this.debounceUpdate();
        });

        colorText.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.isValidHexColor(value)) {
                colorPicker.value = value;
                this.debounceUpdate();
            }
        });
    }

    debounceUpdate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.updatePreview(), 300);
    }

    updatePreview() {
        const params = this.getFormParams();
        
        if (!params.user.trim()) {
            this.showPlaceholder();
            this.updateCodeBlocks('');
            return;
        }

        const url = this.buildUrl(params);
        this.showPreview(url);
        this.updateCodeBlocks(url);
    }

    getFormParams() {
        const formData = new FormData(this.form);
        const params = {
            user: document.getElementById('username').value,
            type: document.getElementById('type').value,
            theme: document.getElementById('theme').value,
            size: document.getElementById('size').value,
            speed: document.getElementById('speed').value,
            width: document.getElementById('width').value,
            height: document.getElementById('height').value,
            color: document.getElementById('color-text').value,
            cursor: document.getElementById('cursor').checked,
            repeat: document.getElementById('repeat').checked,
            // multiline removed
        };
        // multiline removed

        return params;
    }

    buildUrl(params) {
        const url = new URL('/typing', this.baseUrl);
        
        // Add required parameters
        url.searchParams.set('user', params.user);
        url.searchParams.set('type', params.type);

        // Add optional parameters only if they differ from defaults
        if (params.theme !== 'dark') url.searchParams.set('theme', params.theme);
        if (params.size !== '14') url.searchParams.set('size', params.size);
        if (params.speed !== '50') url.searchParams.set('speed', params.speed);
        if (params.width !== '400') url.searchParams.set('width', params.width);
        if (params.height !== '50') url.searchParams.set('height', params.height);
        // Normalize color to always start with '#', and let URLSearchParams encode it
        if (params.color) {
            const normalizedColor = params.color.startsWith('#') ? params.color : `#${params.color}`;
            if (normalizedColor.toLowerCase() !== '#58a6ff') {
                url.searchParams.set('color', normalizedColor);
            }
        }
        if (!params.cursor) url.searchParams.set('cursor', 'false');
        if (!params.repeat) url.searchParams.set('repeat', 'false');
        // multiline removed

        return url.toString();
    }

    showPreview(url) {
        this.previewPlaceholder.style.display = 'none';
        this.previewImg.style.display = 'block';
        this.previewImg.src = url;
        
        // Add loading state
        this.previewImg.classList.add('loading');
        
        this.previewImg.onload = () => {
            this.previewImg.classList.remove('loading');
            this.previewImg.classList.add('fade-in');
        };
        
        this.previewImg.onerror = () => {
            this.previewImg.classList.remove('loading');
            this.showError('Failed to load preview. Please check your username.');
        };
    }

    showPlaceholder() {
        this.previewImg.style.display = 'none';
        this.previewPlaceholder.style.display = 'block';
    }

    showError(message) {
        this.previewPlaceholder.textContent = message;
        this.previewPlaceholder.style.display = 'block';
        this.previewImg.style.display = 'none';
    }

    updateCodeBlocks(url) {
        if (!url) {
            document.getElementById('html-code').textContent = '<img src="" alt="GitHub Stats" />';
            document.getElementById('markdown-code').textContent = '![GitHub Stats]()';
            document.getElementById('url-code').textContent = '';
            return;
        }

        const username = document.getElementById('username').value;
        const type = document.getElementById('type').value;
        const altText = `${username}'s GitHub ${type}`;

        // HTML code
        const htmlCode = `<img src="${url}" alt="${altText}" />`;
        document.getElementById('html-code').textContent = htmlCode;

        // Markdown code
        const markdownCode = `![${altText}](${url})`;
        document.getElementById('markdown-code').textContent = markdownCode;

        // URL only
        document.getElementById('url-code').textContent = url;
    }

    async copyToClipboard(event) {
        const btn = event.target;
        const targetId = btn.dataset.target;
        const text = document.getElementById(targetId).textContent;

        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(text, btn);
        }
    }

    fallbackCopyTextToClipboard(text, btn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const originalText = btn.textContent;
                btn.textContent = '✅ Copied!';
                btn.classList.add('copied');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    isValidHexColor(hex) {
        return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
}

// Utility functions for form validation
function validateUsername(username) {
    const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-(?!-))*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
    return username.length <= 39 && githubUsernameRegex.test(username);
}

function addInputValidation() {
    const usernameInput = document.getElementById('username');
    
    usernameInput.addEventListener('input', (e) => {
        const username = e.target.value;
        
        if (username && !validateUsername(username)) {
            usernameInput.classList.add('error');
            usernameInput.title = 'Invalid GitHub username format';
        } else {
            usernameInput.classList.remove('error');
            usernameInput.title = '';
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SVGGenerator();
    addInputValidation();
    
    // Add some example usernames for quick testing
    const exampleUsernames = ['octocat', 'torvalds', 'gaearon', 'sindresorhus'];
    const usernameInput = document.getElementById('username');
    
    usernameInput.addEventListener('focus', (e) => {
        if (!e.target.value) {
            e.target.placeholder = exampleUsernames[Math.floor(Math.random() * exampleUsernames.length)];
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to focus username input
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('username').focus();
        e.preventDefault();
    }
    
    // Escape to clear username
    if (e.key === 'Escape') {
        document.getElementById('username').value = '';
        document.getElementById('username').dispatchEvent(new Event('input'));
    }
});
