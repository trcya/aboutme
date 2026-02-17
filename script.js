/* --- 1. PARTICLES JS CONFIG --- */
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#3b82f6" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" },
            "onclick": { "enable": true, "mode": "push" }
        }
    },
    "retina_detect": true
});

/* --- 2. NAVIGATION LOGIC --- */
// Pastikan ID di HTML kamu adalah: hamburger-menu, side-nav, dan nav-overlay
const hamburger = document.getElementById('hamburger-menu');
const sideNav = document.getElementById('side-nav');
const overlay = document.getElementById('nav-overlay');

function toggleMenu() {
    if (!hamburger || !sideNav) return; // Mencegah error jika elemen tidak ditemukan
    
    hamburger.classList.toggle('active');
    sideNav.classList.toggle('active');
    
    // Menampilkan/Sembunyikan Overlay
    if (overlay) {
        overlay.style.display = sideNav.classList.contains('active') ? 'block' : 'none';
    }
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

/* --- 3. DISCORD STATUS (LANYARD API) --- */
const DISCORD_ID = "985719845314256907";

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await response.json();
        
        const dot = document.getElementById('status-dot');
        const card = document.querySelector('.discord-status-card');
        const activity = document.getElementById('discord-activity');

        if (!dot || !card || !activity) return;

        // Update dot & glow card
        dot.className = 'discord-indicator ' + data.discord_status;
        
        // Reset and Add Glow Class
        card.classList.remove('status-glow-online', 'status-glow-idle', 'status-glow-dnd', 'status-glow-offline');
        card.classList.add('status-glow-' + data.discord_status);

        // Update Text Activity
        if (data.listening_to_spotify) {
            activity.innerText = "Listening to Spotify 🎵";
        } else if (data.activities.length > 0) {
            // Mencari aktivitas bertipe game (type 0)
            const game = data.activities.find(act => act.type === 0);
            activity.innerText = game ? `Playing: ${game.name}` : data.discord_status.toUpperCase();
        } else {
            activity.innerText = data.discord_status.toUpperCase();
        }
    } catch (e) { 
        console.error("Discord API Error:", e); 
    }
}

// Jalankan update status setiap 10 detik
setInterval(updateDiscordStatus, 10000);
updateDiscordStatus();