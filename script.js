/* ==========================================================================
   #DISCORD STATUS WITH LANYARD API
   ========================================================================== */
const DISCORD_ID = "985719845314256907";

/**
 * Format durasi dari milidetik ke format jam:menit:detik
 * @param {number} ms - Milidetik
 * @returns {string} Durasi terformat
 */
function formatDuration(ms) {
    if (!ms || ms < 0) return "0m";
    
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${seconds}s`;
}

/**
 * Mendapatkan durasi sejak timestamp tertentu
 * @param {number} timestamp - Timestamp dalam milidetik
 * @returns {string|null} Durasi terformat atau null
 */
function getDurationSince(timestamp) {
    if (!timestamp) return null;
    return formatDuration(Date.now() - timestamp);
}

/**
 * Update status Discord dari API Lanyard
 */
async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data.success) throw new Error('API response unsuccessful');

        const discordData = data.data;
        const dot = document.getElementById('statusDot');
        const card = document.querySelector('.discord-status-card');
        const activity = document.getElementById('discordActivity');

        if (!dot || !card || !activity) return;

        // Update status dot
        dot.className = 'discord-indicator ' + discordData.discord_status;
        
        // Update card glow
        card.classList.remove('status-glow-online', 'status-glow-idle', 'status-glow-dnd', 'status-glow-offline');
        card.classList.add('status-glow-' + discordData.discord_status);

        let statusText = '';
        
        // Cek Spotify
        if (discordData.listening_to_spotify && discordData.spotify) {
            const spotify = discordData.spotify;
            const duration = getDurationSince(spotify.timestamps?.start);
            statusText = `🎵 ${spotify.song} - ${spotify.artist} ${duration ? '· ' + duration : ''}`;
        } 
        // Cek aktivitas game
        else {
            const game = discordData.activities.find(act => act.type === 0);
            if (game) {
                const duration = getDurationSince(game.timestamps?.start);
                statusText = `🎮 ${game.name} ${duration ? '· ' + duration : ''}`;
            } 
            // Status biasa
            else {
                let statusName = '';
                let since = null;
                
                switch(discordData.discord_status) {
                    case 'online':
                        statusName = 'Online';
                        since = discordData.active_on_discord_web || discordData.active_on_discord_desktop;
                        break;
                    case 'idle': 
                        statusName = 'Idle'; 
                        break;
                    case 'dnd': 
                        statusName = 'Do Not Disturb'; 
                        break;
                    default: 
                        statusName = 'Offline';
                }
                
                const duration = since ? getDurationSince(since) : '';
                statusText = `${statusName} ${duration ? '· ' + duration : ''}`;
            }
        }

        activity.textContent = statusText || 'No activity';
        
    } catch (error) { 
        console.error("Discord API Error:", error);
        
        const dot = document.getElementById('statusDot');
        const activity = document.getElementById('discordActivity');
        const card = document.querySelector('.discord-status-card');
        
        if (dot) dot.className = 'discord-indicator offline';
        if (card) {
            card.classList.remove('status-glow-online', 'status-glow-idle', 'status-glow-dnd', 'status-glow-offline');
            card.classList.add('status-glow-offline');
        }
        if (activity) activity.textContent = 'Offline';
    }
}

/* ==========================================================================
   #CLOCK FUNCTION
   ========================================================================== */

/**
 * Update jam analog dan digital (WIB - Asia/Jakarta)
 */
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

    // Hitung derajat untuk jarum jam
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

/* ==========================================================================
   #REVEAL ANIMATION
   ========================================================================== */

/**
 * Inisialisasi scroll reveal animation
 */
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

/* ==========================================================================
   #HAMBURGER MENU
   ========================================================================== */

/**
 * Inisialisasi hamburger menu untuk mobile
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sideNav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const body = document.body;

    if (!hamburger || !sideNav || !overlay) return;

    /**
     * Toggle menu
     * @param {boolean} force - Paksa state (opsional)
     */
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

    // Tutup dengan tombol Escape
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
            if (!targetId || targetId === '#') return;
            
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

/* ==========================================================================
   #THEME SWITCHER - 4 WARNA (BIRU, PINK, UNGU, HIJAU)
   ========================================================================== */

/**
 * Inisialisasi theme switcher untuk 4 warna baru
 */
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themePanel = document.getElementById('themePanel');
    const themeClose = document.getElementById('themeClose');
    const themeColors = document.querySelectorAll('.theme-color');
    const themeReset = document.getElementById('themeReset');
    
    // Mapping warna untuk background grid
    const themeColorsMap = {
        'blue': { 
            name: 'Biru',
            grid: 'rgba(59, 130, 246, 0.07)',
            glow: 'rgba(59, 130, 246, 0.03)',
            accent: '#3b82f6',
            accentRgb: '59, 130, 246'
        },
        'pink': { 
            name: 'Pink',
            grid: 'rgba(236, 72, 153, 0.07)',
            glow: 'rgba(236, 72, 153, 0.03)',
            accent: '#ec4899',
            accentRgb: '236, 72, 153'
        },
        'purple': { 
            name: 'Ungu',
            grid: 'rgba(139, 92, 246, 0.07)',
            glow: 'rgba(139, 92, 246, 0.03)',
            accent: '#8b5cf6',
            accentRgb: '139, 92, 246'
        },
        'green': { 
            name: 'Hijau',
            grid: 'rgba(16, 185, 129, 0.07)',
            glow: 'rgba(16, 185, 129, 0.03)',
            accent: '#10b981',
            accentRgb: '16, 185, 129'
        }
    };
    
    if (!themeToggleBtn) return;

    // Buka/tutup panel
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePanel.classList.toggle('active');
    });
    
    if (themeClose) {
        themeClose.addEventListener('click', () => {
            themePanel.classList.remove('active');
        });
    }
    
    // Tutup panel saat klik di luar
    document.addEventListener('click', (e) => {
        if (themePanel && themeToggleBtn && 
            !themePanel.contains(e.target) && !themeToggleBtn.contains(e.target)) {
            themePanel.classList.remove('active');
        }
    });

    /**
     * Update icon dengan warna baru
     * @param {string} hexValue - Nilai hex warna
     */
    function forceIconUpdate(hexValue) {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        document.querySelectorAll('i, svg, [data-lucide], .fab, .fas, .far').forEach(icon => {
            icon.style.color = hexValue;
            if (icon.tagName === 'SVG' || icon.hasAttribute('data-lucide')) {
                icon.style.stroke = hexValue;
            }
        });
    }

    /**
     * Update background grid
     * @param {string} gridColor - Warna grid
     */
    function updateBackgroundGrid(gridColor, glowColor) {
        // Update background grid
        document.body.style.backgroundImage = 
            `linear-gradient(${gridColor} 1px, transparent 1px), ` +
            `linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`;
        
        // Hapus style glow lama jika ada
        const oldStyle = document.getElementById('dynamic-glow');
        if (oldStyle) oldStyle.remove();
        
        // Buat style glow baru
        const style = document.createElement('style');
        style.id = 'dynamic-glow';
        style.textContent = `
            body::after {
                background: radial-gradient(circle at 20% 30%, ${glowColor} 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, ${glowColor} 0%, transparent 50%) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Set tema warna
     * @param {string} color - Nama warna
     * @param {Object} colorData - Data warna
     */
    function setTheme(color, colorData) {
        // Update background grid
        updateBackgroundGrid(colorData.grid, colorData.glow);
        
        // Update accent color
        if (colorData.accent) {
            document.documentElement.style.setProperty('--accent-blue', colorData.accent);
            document.documentElement.style.setProperty('--accent-blue-rgb', colorData.accentRgb);
            document.documentElement.style.setProperty('--accent-glow', `rgba(${colorData.accentRgb}, 0.5)`);
            
            // Update icons
            forceIconUpdate(colorData.accent);
        }
        
        // Update active class
        themeColors.forEach(el => {
            if (el.dataset.color === color) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        // Simpan ke localStorage
        localStorage.setItem('theme-color', color);
        localStorage.setItem('theme-grid', colorData.grid);
        localStorage.setItem('theme-glow', colorData.glow);
        localStorage.setItem('theme-accent', colorData.accent);
        localStorage.setItem('theme-accent-rgb', colorData.accentRgb);
    }

    // Event listener untuk setiap warna
    themeColors.forEach(colorEl => {
        colorEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const colorData = themeColorsMap[colorEl.dataset.color];
            if (colorData) {
                setTheme(colorEl.dataset.color, colorData);
                themePanel.classList.remove('active');
            }
        });
    });

    // Reset ke biru
    if (themeReset) {
        themeReset.addEventListener('click', () => {
            setTheme('blue', themeColorsMap['blue']);
            themePanel.classList.remove('active');
        });
    }

    // Load saved theme
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor && themeColorsMap[savedColor]) {
        setTheme(savedColor, themeColorsMap[savedColor]);
    } else {
        setTheme('blue', themeColorsMap['blue']);
    }
}

/* ==========================================================================
   #MOBILE DETECTION
   ========================================================================== */

/**
 * Deteksi apakah user menggunakan mobile device
 * @returns {boolean} True jika mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

/**
 * Inisialisasi berdasarkan device
 */
function initDeviceSpecific() {
    if (isMobileDevice()) {
        // Tambah class ke body untuk mobile
        document.body.classList.add('mobile-device');
        console.log('Mobile mode');
    } else {
        console.log('Desktop mode');
    }
}

/* ==========================================================================
   #INITIALIZE ALL FUNCTIONS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Deteksi device
    initDeviceSpecific();
    
    // Clock
    updateClocks();
    setInterval(updateClocks, 1000);
    
    // Discord status
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 5000);
    
    // Animations & UI
    initRevealAnimation();
    initHamburgerMenu();
    initThemeSwitcher();
});

/* ==========================================================================
   #WINDOW RESIZE HANDLER
   ========================================================================== */
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Update device class on resize
        if (isMobileDevice()) {
            document.body.classList.add('mobile-device');
        } else {
            document.body.classList.remove('mobile-device');
        }
    }, 250);
});