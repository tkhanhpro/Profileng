// Constants
const DOM = {
    loader: document.getElementById('loader'),
    content: document.querySelector('.content'),
    audio: document.getElementById('bgMusic'),
    musicToggle: document.querySelector('.music-toggle'),
    musicBars: document.querySelector('.music-bars'),
    pingValue: document.querySelector('.ping-value'),
    pingIndicator: document.querySelector('.ping-indicator')
};

// Audio Controller
const AudioController = {
    isPlaying: false,
    currentAudio: null,
    playlistPanel: document.querySelector('.playlist-panel'),
    musicToggle: document.querySelector('.music-toggle'),

    init() {
        // Toggle playlist panel
        this.musicToggle.addEventListener('click', () => {
            this.playlistPanel.classList.toggle('show');
        });

        // Close playlist
        document.querySelector('.close-playlist').addEventListener('click', () => {
            this.playlistPanel.classList.remove('show');
        });

        // Play songs
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const songSrc = item.dataset.src;
                this.playSong(songSrc, item);
            });
        });
    },

    async playSong(src, item) {
        if (this.currentAudio) {
            this.currentAudio.pause();
            document.querySelector('.playlist-item.playing')?.classList.remove('playing');
        }

        const audio = new Audio(src);
        this.currentAudio = audio;
        
        try {
            await audio.play();
            item.classList.add('playing');
            this.isPlaying = true;
            this.musicToggle.classList.add('playing');
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }
};

// Optimized Sakura Effect
const SakuraEffect = {
    create() {
        const sakura = document.createElement('div');
        const size = Math.random() * 6 + 4; // Smaller petals for smoother performance
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() * 100 - 50); // Smoother horizontal drift
        const fallHeight = window.innerHeight + 50;
        const duration = Math.random() * 4 + 4; // Slower fall for elegance
        const opacity = Math.random() * 0.4 + 0.3;
        const rotate = Math.random() * 720 - 360; // Gentle rotation
        const scale = Math.random() * 0.3 + 0.7; // Subtle scale variation

        sakura.className = 'sakura';
        sakura.style.width = `${size}px`;
        sakura.style.height = `${size}px`;
        sakura.style.left = `${startX}px`;
        sakura.style.animationDuration = `${duration}s`;
        sakura.style.setProperty('--start-x', `${startX}px`);
        sakura.style.setProperty('--end-x', `${endX}px`);
        sakura.style.setProperty('--fall-height', `${fallHeight}px`);
        sakura.style.setProperty('--opacity', opacity);
        sakura.style.setProperty('--rotate', `${rotate}deg`);
        sakura.style.setProperty('--scale', scale);
        sakura.style.background = `radial-gradient(circle at 40% 40%, 
            #fff ${Math.random() * 20}%, 
            #ffc1cc ${Math.random() * 20 + 20}%, 
            #ffb6c1)`;

        document.querySelector('.sakura-container').appendChild(sakura);
        
        // Remove after animation to prevent DOM clutter
        setTimeout(() => sakura.remove(), duration * 1000);
    },

    start() {
        // Reduced frequency for smoother performance
        setInterval(() => this.create(), 200);
        // Initial burst for immediate effect
        for (let i = 0; i < 10; i++) {
            setTimeout(() => this.create(), i * 50);
        }
    }
};

// Ping Measurement
const PingMeasurement = {
    updatePing() {
        const startTime = performance.now();
        
        fetch(window.location.href + '?' + Date.now())
            .then(() => {
                const pingTime = Math.round(performance.now() - startTime);
                const pingColor = pingTime < 100 ? '#87ceeb' : 
                                pingTime < 200 ? '#f1c40f' : '#e74c3c';
                
                DOM.pingValue.textContent = `${pingTime}ms`;
                DOM.pingIndicator.style.color = pingColor;
            })
            .catch(() => {
                DOM.pingValue.textContent = 'offline';
                DOM.pingIndicator.style.color = '#e74c3c';
            });
    },

    init() {
        this.updatePing();
        setInterval(() => this.updatePing(), 5000);
    }
};

// Security Features
const Security = {
    init() {
        this.preventDevTools();
        this.preventInspect();
        this.preventSourceView();
        this.addSecurityHeaders();
    },

    preventDevTools() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 123) {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });
    },

    preventInspect() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.redirectToFacebook();
            return false;
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });
    },

    preventSourceView() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });
    },

    redirectToFacebook() {
        window.location.href = 'https://www.facebook.com/KhanhShado.Vip';
    },

    addSecurityHeaders() {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;";
        document.head.appendChild(meta);

        const xframe = document.createElement('meta');
        xframe.httpEquiv = "X-Frame-Options";
        xframe.content = "DENY";
        document.head.appendChild(xframe);
    }
};

const WelcomeVoice = {
    audio: new Audio('https://files.catbox.moe/d338lp.mp3'),
    hasPlayed: false,
    volume: 1.0,

    init() {
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('ended', () => {
            AudioController.fadeToVolume(0.7);
        });
        
        setTimeout(() => {
            if (!this.hasPlayed) {
                this.playVoice().catch(() => {
                    document.addEventListener('click', () => {
                        if (!this.hasPlayed) {
                            this.playVoice();
                        }
                    }, { once: true });
                });
            }
        }, 1000);
    },

    async playVoice() {
        try {
            await AudioController.fadeToVolume(0.05);
            await this.audio.play();
            this.hasPlayed = true;
            return true;
        } catch(err) {
            console.log('Voice autoplay prevented:', err);
            return false;
        }
    }
};

const LoadingScreen = {
    progressBar: document.querySelector('.progress'),
    progressText: document.querySelector('.progress-text'),
    loader: document.getElementById('loader'),
    content: document.querySelector('.content'),
    
    init() {
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 70) {
                progress += Math.random() * 12;
            } else if (progress < 90) {
                progress += Math.random() * 4;
            } else {
                progress += Math.random() * 1.5;
            }
            
            if (progress > 100) progress = 100;
            
            this.updateProgress(progress);
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => this.hideLoader(), 600);
            }
        }, 80);
    },
    
    updateProgress(progress) {
        const percentage = Math.floor(progress);
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
    },
    
    hideLoader() {
        this.loader.style.opacity = '0';
        setTimeout(() => {
            this.loader.style.display = 'none';
            this.content.classList.add('show');
        }, 600);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();

    // Initialize features
    AudioController.init();
    SakuraEffect.start();
    PingMeasurement.init();
    Security.init();

    WelcomeVoice.init();
});

// Error handling
window.onerror = function(msg, url, line) {
    console.error(`Error: ${msg} at ${url}:${line}`);
    return false;
};

// Prevent iframe embedding
if (window.top !== window.self) {
    window.top.location.href = window.self.location.href;
}

document.addEventListener('click', function(e) {
    const circle = document.createElement('div');
    circle.className = 'click-circle';
    circle.style.left = `${e.clientX}px`;
    circle.style.top = `${e.clientY}px`;
    document.body.appendChild(circle);

    setTimeout(() => {
        circle.remove();
    }, 700);
});
