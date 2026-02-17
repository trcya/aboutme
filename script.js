particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80, // Jumlah titik
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#3b82f6" // Warna titik (Biru)
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.5,
      "random": false
    },
    "size": {
      "value": 3,
      "random": true
    },
    "line_linked": {
      "enable": true, // Menghubungkan antar titik
      "distance": 150,
      "color": "#3b82f6",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2, // Kecepatan gerak
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab" // Efek saat mouse mendekat
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      }
    }
  },
  "retina_detect": true
});

const DISCORD_ID = "985719845314256907"; 

async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/985719845314256907`);
        const dataJson = await response.json();
        if (!dataJson.success) return;

        const data = dataJson.data;
        const statusCard = document.querySelector('.discord-status-card');
        const statusDot = document.getElementById('status-dot');

        // 1. Update Indikator Kecil (Bulan/Minus)
        statusDot.className = 'discord-indicator ' + data.discord_status;

        // 2. Update Cahaya Seluruh Kotak
        // Hapus class cahaya lama
        statusCard.classList.remove('status-glow-online', 'status-glow-idle', 'status-glow-dnd', 'status-glow-offline');
        
        // Tambah class cahaya baru sesuai status
        statusCard.classList.add('status-glow-' + data.discord_status);

        // 3. Update Teks Aktivitas (sama seperti sebelumnya)
        const activityText = document.getElementById('discord-activity');
        const game = data.activities.find(act => act.type === 0);
        
        if (game) {
            activityText.innerText = `Playing: ${game.name}`;
        } else {
            activityText.innerText = data.discord_status.toUpperCase();
        }
        
    } catch (error) {
        console.error("Glow Error:", error);
    }
}

setInterval(getDiscordStatus, 5000);
getDiscordStatus();
