// mood-selector.js - Handles mood selection UI and applying themes

// Function to apply mood theme
function applyMoodTheme(mood) {
    // Remove fallback CSS if it exists
    const fallbackCSS = document.getElementById('fallbackMoodCSS');
    if (fallbackCSS) {
        fallbackCSS.remove();
    }
    
    // Remove existing mood CSS if any
    const existingMoodCSS = document.querySelector('link[data-mood-css]');
    if (existingMoodCSS) {
        existingMoodCSS.remove();
    }
    
    // Determine correct path to CSS folder
    let path = '';
    if (window.location.pathname.includes('/pages/')) {
        path = '../css/';
    } else {
        path = 'css/';
    }
    
    // Create new link element for the selected mood CSS
    const moodCSS = document.createElement('link');
    moodCSS.rel = 'stylesheet';
    moodCSS.href = `${path}mood-${mood}.css`;
    moodCSS.setAttribute('data-mood-css', mood);
    
    // Append to head
    document.head.appendChild(moodCSS);
    
    // Save mood preference
    if (typeof saveMood === 'function') {
        saveMood(mood);
    } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lumen_mood_preference', mood);
    }
    
    console.log(`Applied mood: ${mood} from path: ${path}`);
}

// Function to show the mood selector overlay (for Change Mood button)
function showMoodSelectorOverlay() {
    const moodOverlay = document.getElementById('moodOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (moodOverlay && mainContent) {
        // Remove current mood CSS to show default selector theme
        const existingMoodCSS = document.querySelector('link[data-mood-css]');
        if (existingMoodCSS) {
            existingMoodCSS.remove();
        }
        
        // Load default theme for selector
        let path = '';
        if (window.location.pathname.includes('/pages/')) {
            path = '../css/';
        } else {
            path = 'css/';
        }
        
        const defaultCSS = document.createElement('link');
        defaultCSS.rel = 'stylesheet';
        defaultCSS.href = `${path}mood-default.css`;
        defaultCSS.setAttribute('data-mood-css', 'default');
        document.head.appendChild(defaultCSS);
        
        // Show overlay, hide main content
        moodOverlay.classList.remove('hide');
        moodOverlay.style.display = 'flex';
        mainContent.classList.add('hidden');
        
        // Re-attach mood button listeners
        attachMoodButtonListeners();
    }
}

// Function to hide mood selector and show main content
function hideMoodSelectorAndShowContent() {
    const moodOverlay = document.getElementById('moodOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (moodOverlay && mainContent) {
        moodOverlay.classList.add('hide');
        setTimeout(() => {
            moodOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 500);
    }
}

// Attach listeners to mood buttons in the overlay
function attachMoodButtonListeners() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodOverlay = document.getElementById('moodOverlay');
    const mainContent = document.getElementById('mainContent');
    
    moodButtons.forEach(button => {
        // Remove existing listener to avoid duplicates
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
            const selectedMood = newButton.getAttribute('data-mood');
            applyMoodTheme(selectedMood);
            
            // Save mood
            if (typeof saveMood === 'function') {
                saveMood(selectedMood);
            } else if (typeof localStorage !== 'undefined') {
                localStorage.setItem('lumen_mood_preference', selectedMood);
            }
            
            // Hide overlay and show content
            if (moodOverlay && mainContent) {
                moodOverlay.classList.add('hide');
                setTimeout(() => {
                    moodOverlay.style.display = 'none';
                    mainContent.classList.remove('hidden');
                }, 500);
            }
        });
    });
}

// Initialize mood on page load
function initMood() {
    // Try to get saved mood
    let savedMood = null;
    if (typeof loadSavedMood === 'function') {
        savedMood = loadSavedMood();
    } else if (typeof localStorage !== 'undefined') {
        savedMood = localStorage.getItem('lumen_mood_preference');
    }
    
    // Check if we are on the main page (has moodOverlay)
    const hasMoodOverlay = document.getElementById('moodOverlay');
    
    if (savedMood && savedMood !== 'null') {
        // Apply saved mood
        applyMoodTheme(savedMood);
        
        // If on main page and mood overlay exists, hide it
        if (hasMoodOverlay) {
            const moodOverlay = document.getElementById('moodOverlay');
            const mainContent = document.getElementById('mainContent');
            if (moodOverlay && mainContent) {
                moodOverlay.style.display = 'none';
                mainContent.classList.remove('hidden');
            }
        }
    } else if (hasMoodOverlay) {
        // No saved mood and on main page - show selector
        // Load default theme for selector
        let path = '';
        if (window.location.pathname.includes('/pages/')) {
            path = '../css/';
        } else {
            path = 'css/';
        }
        
        const defaultCSS = document.createElement('link');
        defaultCSS.rel = 'stylesheet';
        defaultCSS.href = `${path}mood-default.css`;
        defaultCSS.setAttribute('data-mood-css', 'default');
        document.head.appendChild(defaultCSS);
        
        const moodOverlay = document.getElementById('moodOverlay');
        const mainContent = document.getElementById('mainContent');
        if (moodOverlay && mainContent) {
            moodOverlay.classList.remove('hide');
            moodOverlay.style.display = 'flex';
            mainContent.classList.add('hidden');
        }
        
        // Attach listeners to mood buttons
        attachMoodButtonListeners();
    } else {
        // On sub-page (like login), apply saved mood or default
        if (savedMood && savedMood !== 'null') {
            applyMoodTheme(savedMood);
        } else {
            applyMoodTheme('default');
        }
    }
    
    // Add change mood button listener if exists (for home page)
    const changeMoodBtn = document.getElementById('changeMoodBtn');
    if (changeMoodBtn) {
        // Remove existing listener
        const newBtn = changeMoodBtn.cloneNode(true);
        changeMoodBtn.parentNode.replaceChild(newBtn, changeMoodBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMoodSelectorOverlay();
        });
    }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initMood);