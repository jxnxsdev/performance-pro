// Produktion farben
const current_scene_color = document.getElementById('current_scene_color');
const next_scene_color = document.getElementById('next_scene_color');
const following_scene_color = document.getElementById('following_scene_color');

const color_save = document.getElementById('save_colors');
const color_reset = document.getElementById('reset_colors');

let defaultCurrent = '#00487d';
let defaultNext = '#008f00';
let defaultFollowing = '#424242';

async function checkStorage() {
    if (localStorage.getItem('current_scene_color') === null) {
        localStorage.setItem('current_scene_color', defaultCurrent);
    }

    if (localStorage.getItem('next_scene_color') === null) {
        localStorage.setItem('next_scene_color', defaultNext);
    }

    if (localStorage.getItem('following_scene_color') === null) {
        localStorage.setItem('following_scene_color', defaultFollowing);
    }
}

async function loadColors() {
    current_scene_color.value = localStorage.getItem('current_scene_color');
    next_scene_color.value = localStorage.getItem('next_scene_color');
    following_scene_color.value = localStorage.getItem('following_scene_color');
    color_save.style.opacity = 0.5;
    color_save.style.cursor = 'not-allowed';
}

async function saveColors() {
    localStorage.setItem('current_scene_color', current_scene_color.value);
    localStorage.setItem('next_scene_color', next_scene_color.value);
    localStorage.setItem('following_scene_color', following_scene_color.value);
    color_save.style.opacity = 0.5;
    color_save.style.cursor = 'not-allowed';
}

async function resetColors() {
    localStorage.setItem('current_scene_color', defaultCurrent);
    localStorage.setItem('next_scene_color', defaultNext);
    localStorage.setItem('following_scene_color', defaultFollowing);
    loadColors();
}

async function onChange() {
    color_save.style.opacity = 1;
    color_save.style.cursor = 'pointer';
}

async function setupColorSettong() {
    await checkStorage();
    await loadColors();

    color_save.addEventListener('click', () => {
        saveColors();
    });

    color_reset.addEventListener('click', () => {
        resetColors();
    });

    current_scene_color.addEventListener('change', () => {
        onChange();
    });

    next_scene_color.addEventListener('change', () => {
        onChange();
    });

    following_scene_color.addEventListener('change', () => {
        onChange();
    });
}

setupColorSettong();