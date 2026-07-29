// mood-storage.js - Handles saving and loading mood preference

const MOOD_STORAGE_KEY = 'lumen_mood_preference';

function saveMood(mood) {
    localStorage.setItem(MOOD_STORAGE_KEY, mood);
}

function loadSavedMood() {
    return localStorage.getItem(MOOD_STORAGE_KEY);
}

function hasSavedMood() {
    return loadSavedMood() !== null;
}

function clearSavedMood() {
    localStorage.removeItem(MOOD_STORAGE_KEY);
}