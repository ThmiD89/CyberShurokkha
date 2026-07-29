// qr-scanner.js - QR Scanner Frontend Logic

// ========================================
// STATE
// ========================================
let selectedFile = null;
let cameraStream = null;
let scanning = false;
let lastScanned = null;

// DOM Elements
const manualUrlInput = document.getElementById('manualUrlInput');
const resultsPanel = document.getElementById('resultsPanel');
const resultContent = document.getElementById('resultContent');
const loadingSpinner = document.getElementById('loadingSpinner');

// ========================================
// TAB SWITCHING
// ========================================
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Hide results when switching tabs
    hideResults();
}

// ========================================
// URL SCANNER
// ========================================
function setExampleUrl(url) {
    const input = document.getElementById('manualUrlInput');
    if (input) {
        input.value = url;
        document.getElementById('urlForm').submit();
    }
}

function scanManualUrl() {
    const url = manualUrlInput.value.trim();
    if (!url) {
        showMessage('Please enter a URL to scan', 'warning');
        return;
    }

    // Basic URL validation
    if (!url.match(/^https?:\/\//)) {
        // Try adding https
        manualUrlInput.value = 'https://' + url;
    }

    showLoading('Scanning URL...');
    // Submit the form
    document.getElementById('urlForm').submit();
}

// ========================================
// QR UPLOAD SCANNER
// ========================================
function handleFileUpload(file) {
    if (!file) return;

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
        showMessage('Please upload a valid image file (PNG, JPG, GIF, WEBP, BMP)', 'error');
        return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showMessage('File size must be less than 10MB', 'error');
        return;
    }

    selectedFile = file;

    // Show file info
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('uploadFileName');
    const fileSize = document.getElementById('uploadFileSize');

    fileInfo.classList.remove('hidden');
    fileName.textContent = file.name;
    fileSize.textContent = (file.size / 1024).toFixed(2) + ' KB';

    // Enable the scan button
    const scanBtn = document.getElementById('scanUploadBtn');
    scanBtn.disabled = false;
    scanBtn.style.opacity = '1';
    scanBtn.style.cursor = 'pointer';
}

function clearFile() {
    selectedFile = null;
    document.getElementById('fileInfo').classList.add('hidden');
    document.getElementById('fileInput').value = '';
    hideResults();
    const scanBtn = document.getElementById('scanUploadBtn');
    scanBtn.disabled = true;
    scanBtn.style.opacity = '0.5';
    scanBtn.style.cursor = 'not-allowed';
}

function triggerFileInput() {
    document.getElementById('fileInput').click();
}

// ========================================
// CAMERA SCANNER
// ========================================
async function startCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const statusEl = document.getElementById('cameraStatus');
    const resultDiv = document.getElementById('cameraResult');

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        video.srcObject = cameraStream;
        await video.play();

        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-flex';
        statusEl.innerHTML = '📷 Camera active - scanning for QR codes...';
        statusEl.style.color = '#4caf50';
        scanning = true;
        resultDiv.innerHTML = '';

        // Start scanning frames
        function scanFrame() {
            if (!scanning) return;

            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code && code.data !== lastScanned) {
                    lastScanned = code.data;
                    statusEl.innerHTML = '✅ QR Code detected! Analyzing...';
                    statusEl.style.color = '#ff9800';
                    
                    // Call your backend
                    fetch('/check_url', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: code.data })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            resultDiv.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> ' + data.error + '</div>';
                            statusEl.innerHTML = '❌ Invalid QR content';
                            statusEl.style.color = '#f44336';
                        } else {
                            resultDiv.innerHTML = `
                                <div class="result-card" style="margin-top:1rem;">
                                    <div class="result-header">
                                        <h3><i class="fas fa-qrcode"></i> QR Scan Result</h3>
                                        <span class="result-badge ${data.verdict === 'SAFE' ? 'safe' : 'unsafe'}">
                                            ${data.verdict === 'SAFE' ? '✅' : '⚠️'} ${data.verdict}
                                        </span>
                                    </div>
                                    <div class="result-body">
                                        <div class="result-url">
                                            <span>${data.url}</span>
                                            <button class="copy-url-btn" onclick="copyToClipboard('${data.url}')">
                                                <i class="fas fa-copy"></i> Copy
                                            </button>
                                        </div>
                                        <div class="result-confidence">
                                            <div class="confidence-label">
                                                <span>Confidence</span>
                                                <span>${data.confidence}%</span>
                                            </div>
                                            <div class="confidence-bar">
                                                <div class="confidence-fill ${data.confidence >= 70 ? 'high' : data.confidence >= 40 ? 'medium' : 'low'}" 
                                                     style="width: ${data.confidence}%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            statusEl.innerHTML = '✅ Scan complete!';
                            statusEl.style.color = '#4caf50';
                        }
                    })
                    .catch(error => {
                        resultDiv.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error: ' + error.message + '</div>';
                    });
                }
            }

            if (scanning) {
                requestAnimationFrame(scanFrame);
            }
        }

        requestAnimationFrame(scanFrame);

    } catch (error) {
        console.error('Camera error:', error);
        statusEl.innerHTML = '❌ Unable to access camera. Please check permissions.';
        statusEl.style.color = '#f44336';
        startBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'none';
    }
}

function stopCamera() {
    scanning = false;
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    const video = document.getElementById('video');
    video.srcObject = null;

    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const statusEl = document.getElementById('cameraStatus');
    
    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    statusEl.innerHTML = '📷 Camera stopped';
    statusEl.style.color = 'var(--text-secondary)';
}

// ========================================
// LOADING / MESSAGES
// ========================================
function showLoading(message) {
    const spinner = document.getElementById('loadingSpinner');
    const text = spinner.querySelector('p');
    spinner.classList.add('show');
    if (text) text.textContent = message || 'Scanning...';
    hideResults();
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('show');
}

function showMessage(message, type) {
    const existingMsg = document.querySelector('.success-message, .error-message, .warning-message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `${type}-message`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    msgDiv.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${message}`;

    const container = document.querySelector('.scanner-container');
    container.insertBefore(msgDiv, container.firstChild);

    setTimeout(() => {
        if (msgDiv) msgDiv.remove();
    }, 5000);
}

function hideResults() {
    const panel = document.getElementById('resultsPanel');
    if (panel) panel.classList.remove('show');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('URL copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showMessage('URL copied to clipboard!', 'success');
    });
}

// ========================================
// MOOD SELECTOR FUNCTIONS
// ========================================
function showMoodSelector() {
    const overlay = document.getElementById('moodOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.zIndex = '9999';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.classList.add('show');
    }
}

function hideMoodSelector() {
    const overlay = document.getElementById('moodOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('show');
    }
}

function initMoodButtons() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            applyMoodTheme(mood);
            hideMoodSelector();
        });
    });
}

function applyMoodTheme(mood) {
    // Remove existing mood CSS
    const existing = document.querySelector('link[data-mood-css]');
    if (existing) existing.remove();
    
    // Add new mood CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/static/css/mood-${mood}.css`;
    link.setAttribute('data-mood-css', mood);
    document.head.appendChild(link);
    
    // Save preference
    localStorage.setItem('lumen_mood_preference', mood);
}

// ========================================
// INITIALIZATION
// ========================================
function initQRScanner() {
    // Change mood button - Show mood selector
    const changeMoodBtn = document.getElementById('changeMoodBtn');
    if (changeMoodBtn) {
        changeMoodBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMoodSelector();
        });
    }

    // File input handler
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleFileUpload(e.target.files[0]);
        });
    }

    // Drag and drop
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) {
                const input = document.getElementById('fileInput');
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                input.dispatchEvent(new Event('change'));
            }
        });
    }

    // Initialize mood buttons
    initMoodButtons();

    // Load saved mood preference
    const savedMood = localStorage.getItem('lumen_mood_preference');
    if (savedMood && savedMood !== 'null') {
        applyMoodTheme(savedMood);
    }
}

// Make functions global for HTML onclick
window.switchTab = switchTab;
window.setExampleUrl = setExampleUrl;
window.scanManualUrl = scanManualUrl;
window.handleFileUpload = handleFileUpload;
window.clearFile = clearFile;
window.triggerFileInput = triggerFileInput;
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.copyToClipboard = copyToClipboard;
window.showMessage = showMessage;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initQRScanner);