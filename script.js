/* ===== PARTICLES JS CONFIG ===== */
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#3b82f6" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { 
            enable: true, 
            distance: 150, 
            color: "#3b82f6", 
            opacity: 0.4, 
            width: 1 
        },
        move: { 
            enable: true, 
            speed: 2, 
            direction: "none", 
            random: false, 
            straight: false, 
            out_mode: "out", 
            bounce: false 
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" }
        }
    },
    retina_detect: true
});

/* ===== DISCORD STATUS WITH LANYARD API ===== */
const DISCORD_ID = "985719845314256907";

// Format durasi
function formatDuration(ms) {
    if (!ms || ms < 0) return "0m";
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
}

// Hitung durasi dari timestamp
function getDurationSince(timestamp) {
    if (!timestamp) return null;
    return formatDuration(Date.now() - timestamp);
}

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        if (!response.ok) throw new Error(`HTTP error!`);
        const data = await response.json();
        if (!data.success) throw new Error('API failed');

        const discordData = data.data;
        const dot = document.getElementById('statusDot');
        const card = document.querySelector('.discord-status-card');
        const activity = document.getElementById('discordActivity');

        if (!dot || !card || !activity) return;

        dot.className = 'discord-indicator ' + discordData.discord_status;
        
        card.classList.remove('status-glow-online', 'status-glow-idle', 'status-glow-dnd', 'status-glow-offline');
        card.classList.add('status-glow-' + discordData.discord_status);

        let statusText = '';
        
        if (discordData.listening_to_spotify && discordData.spotify) {
            const spotify = discordData.spotify;
            const duration = getDurationSince(spotify.timestamps?.start);
            statusText = `🎵 ${spotify.song} - ${spotify.artist} ${duration ? '· ' + duration : ''}`;
        } else {
            const game = discordData.activities.find(act => act.type === 0);
            if (game) {
                const duration = getDurationSince(game.timestamps?.start);
                statusText = `🎮 ${game.name} ${duration ? '· ' + duration : ''}`;
            } else {
                let statusName = '';
                let since = null;
                switch(discordData.discord_status) {
                    case 'online':
                        statusName = 'Online';
                        since = discordData.active_on_discord_web || discordData.active_on_discord_desktop;
                        break;
                    case 'idle': statusName = 'Idle'; break;
                    case 'dnd': statusName = 'Do Not Disturb'; break;
                    default: statusName = 'Offline';
                }
                const duration = since ? getDurationSince(since) : '';
                statusText = `${statusName} ${duration ? '· ' + duration : ''}`;
            }
        }

        activity.textContent = statusText;
    } catch (error) { 
        console.error("Discord API Error:", error);
        const dot = document.getElementById('statusDot');
        const activity = document.getElementById('discordActivity');
        if (dot) dot.className = 'discord-indicator offline';
        if (activity) activity.textContent = 'Offline';
    }
}

/* ===== GEAR SLIDER PROGRESS BAR ===== */
function updateGearProgress() {
    const track = document.getElementById('gearTrack');
    const progressBar = document.getElementById('gearProgressBar');
    
    if (!track || !progressBar || window.innerWidth <= 768) return;
    
    const cards = track.children.length;
    const visibleCards = window.innerWidth > 1024 ? 3 : 2;
    const maxProgress = ((cards - visibleCards) / cards) * 100;
    
    const transform = window.getComputedStyle(track).transform;
    let translateX = 0;
    
    if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        translateX = matrix.m41;
    }
    
    const cardWidth = 300;
    const gap = 20;
    const maxTranslate = -(cardWidth * (cards - visibleCards) + gap * (cards - visibleCards));
    
    let currentProgress = 0;
    if (maxTranslate !== 0) {
        currentProgress = Math.abs((translateX / maxTranslate) * maxProgress);
    }
    
    progressBar.style.width = Math.min(currentProgress, maxProgress) + '%';
}

/* ===== CLOCK FUNCTION ===== */
function updateClocks() {
    const now = new Date();
    
    const options = { 
        timeZone: 'Asia/Jakarta', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };
    
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const timeString = formatter.format(now);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;
    const minDeg = minutes * 6;
    const secDeg = seconds * 6;

    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    const digitalClock = document.getElementById('digitalClock');

    if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minDeg}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secDeg}deg)`;

    if (digitalClock) {
        digitalClock.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

/* ===== REVEAL ANIMATION ===== */
function initRevealAnimation() {
    const observerOptions = { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== HAMBURGER MENU ===== */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sideNav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const body = document.body;

    if (!hamburger || !sideNav || !overlay) return;

    function toggleMenu(force) {
        const isActive = force !== undefined ? force : !sideNav.classList.contains('active');
        
        if (isActive) {
            hamburger.classList.add('active');
            sideNav.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        } else {
            hamburger.classList.remove('active');
            sideNav.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    overlay.addEventListener('click', () => toggleMenu(false));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideNav.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Smooth scroll untuk nav items
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                if (window.innerWidth <= 768) {
                    toggleMenu(false);
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                } else {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

/* ===== INITIALIZE ALL FUNCTIONS ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Start clock updates
    updateClocks();
    setInterval(updateClocks, 1000);
    
    // Start Discord status updates
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 5000);
    
    // Start gear progress updates (desktop only)
    if (window.innerWidth > 768) {
        updateGearProgress();
        setInterval(updateGearProgress, 100);
    }
    
    // Initialize reveal animation
    initRevealAnimation();
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            updateGearProgress();
        }
    });
});