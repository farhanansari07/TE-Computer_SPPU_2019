/* ============================================================
   RHYTHMIX — main.js
   ============================================================
   JAVASCRIPT CONCEPTS COVERED:
   ─────────────────────────────────────────────────────────────
   1.  DOM Manipulation          — getElementById, querySelector,
                                   innerHTML, classList, style
   2.  Event Listeners           — addEventListener (click, input,
                                   change, submit, keyup, timeupdate)
   3.  Form Validation           — Custom JS validation with
                                   HTML5 novalidate + error messages
   4.  prompt() / alert()        — Used for playlist creation &
                                   confirmation dialogs
   5.  Array Methods             — forEach, filter, map, find, some
   6.  Object / Data Model       — Song, Playlist data structures
   7.  localStorage              — Persist users, liked songs, playlists
   8.  Audio API                 — HTMLAudioElement / Web Audio stub
   9.  Timer / setInterval       — Progress bar animation, toast
   10. Bootstrap JS Modal API    — Modal.show(), .hide()
   ─────────────────────────────────────────────────────────────
*/

'use strict';

/* ============================================================
   1. DATA — Mock Music Library
============================================================ */
const SONGS = [
  { id:1,  title:'Midnight Drive',      artist:'Nova Waves',      album:'Neon Dusk',     genre:'Electronic', duration:'3:42', emoji:'🌙' },
  { id:2,  title:'Golden Horizon',      artist:'Skyline Project', album:'Open Roads',    genre:'Indie',      duration:'4:11', emoji:'🌅' },
  { id:3,  title:'Electric Pulse',      artist:'Synthcore X',     album:'Voltage',       genre:'Electronic', duration:'3:28', emoji:'⚡' },
  { id:4,  title:'Ocean Breeze',        artist:'Chill Harbor',    album:'Coastal Vibes', genre:'Lo-Fi',      duration:'5:02', emoji:'🌊' },
  { id:5,  title:'City Lights',         artist:'Urban Echo',      album:'Metropolis',    genre:'Pop',        duration:'3:55', emoji:'🏙️' },
  { id:6,  title:'Mountain Peak',       artist:'Acoustic Minds',  album:'High Altitude', genre:'Acoustic',   duration:'4:30', emoji:'🏔️' },
  { id:7,  title:'Neon Jungle',         artist:'Retrofunk',       album:'Neon Dusk',     genre:'Funk',       duration:'3:18', emoji:'🦁' },
  { id:8,  title:'Lunar Dance',         artist:'Nova Waves',      album:'Lunar EP',      genre:'Electronic', duration:'4:45', emoji:'🌕' },
  { id:9,  title:'Summer Fade',         artist:'Skyline Project', album:'Seasons',       genre:'Indie',      duration:'3:33', emoji:'☀️' },
  { id:10, title:'Dark Matter',         artist:'Synthcore X',     album:'Voltage',       genre:'Electronic', duration:'5:20', emoji:'🌑' },
  { id:11, title:'Rain on Glass',       artist:'Chill Harbor',    album:'Coastal Vibes', genre:'Lo-Fi',      duration:'4:05', emoji:'🌧️' },
  { id:12, title:'Burning Bright',      artist:'Urban Echo',      album:'Metropolis',    genre:'Pop',        duration:'3:47', emoji:'🔥' },
  { id:13, title:'Wooden Heart',        artist:'Acoustic Minds',  album:'Earthy',        genre:'Acoustic',   duration:'4:20', emoji:'🪵' },
  { id:14, title:'Groove Station',      artist:'Retrofunk',       album:'Funkadelic',    genre:'Funk',       duration:'3:58', emoji:'🎷' },
  { id:15, title:'Starfield',           artist:'Nova Waves',      album:'Cosmos',        genre:'Electronic', duration:'6:00', emoji:'🌠' },
  { id:16, title:'Lost Highway',        artist:'Road Kings',      album:'Asphalt Tales', genre:'Rock',       duration:'4:14', emoji:'🛣️' },
  { id:17, title:'Phoenix Rising',      artist:'Epic Ensemble',   album:'Ascent',        genre:'Cinematic',  duration:'5:50', emoji:'🦅' },
  { id:18, title:'Café Parisien',       artist:'Jazzy Moods',     album:'Brasserie',     genre:'Jazz',       duration:'4:33', emoji:'☕' },
  { id:19, title:'Deep Blue',           artist:'Chill Harbor',    album:'Depths',        genre:'Lo-Fi',      duration:'3:22', emoji:'💙' },
  { id:20, title:'Hypnotic Groove',     artist:'Synthcore X',     album:'Trance State',  genre:'Electronic', duration:'7:12', emoji:'🔮' },
];

const GENRES = [
  { name:'Electronic', color:'var(--g1)', emoji:'🎛️' },
  { name:'Indie',      color:'var(--g2)', emoji:'🎸' },
  { name:'Lo-Fi',      color:'var(--g3)', emoji:'📻' },
  { name:'Pop',        color:'var(--g4)', emoji:'🎤' },
  { name:'Acoustic',   color:'var(--g5)', emoji:'🪕' },
  { name:'Rock',       color:'var(--g6)', emoji:'🎵' },
  { name:'Funk',       color:'#b45309',   emoji:'🎷' },
  { name:'Jazz',       color:'#0e7490',   emoji:'🎺' },
  { name:'Cinematic',  color:'#4338ca',   emoji:'🎬' },
];

/* ============================================================
   2. APP STATE
============================================================ */
let state = {
  currentTrackIndex : -1,      // index in queue
  queue             : [...SONGS],
  isPlaying         : false,
  isShuffle         : false,
  isRepeat          : false,
  isMuted           : false,
  volume            : 80,
  progress          : 0,       // 0–100 (simulated)
  progressTimer     : null,
  likedSongs        : [],      // array of song IDs
  playlists         : [],      // [{id, name, songIds:[]}]
  currentUser       : null,    // {name, email} or null
  users             : [],      // registered users [{name, email, password}]
  activeSection     : 'home',
};

/* ============================================================
   3. localStorage HELPERS
   KEY JS CONCEPT: localStorage.getItem / setItem / JSON.parse
============================================================ */
function loadFromStorage() {
  try {
    state.likedSongs = JSON.parse(localStorage.getItem('rhythmix_liked'))    || [];
    state.playlists  = JSON.parse(localStorage.getItem('rhythmix_playlists')) || [];
    state.users      = JSON.parse(localStorage.getItem('rhythmix_users'))     || [];
    const saved      = JSON.parse(localStorage.getItem('rhythmix_user'));
    if (saved) state.currentUser = saved;
  } catch(e) { console.warn('Storage load error', e); }
}

function saveToStorage() {
  localStorage.setItem('rhythmix_liked',     JSON.stringify(state.likedSongs));
  localStorage.setItem('rhythmix_playlists', JSON.stringify(state.playlists));
  localStorage.setItem('rhythmix_users',     JSON.stringify(state.users));
  if (state.currentUser)
    localStorage.setItem('rhythmix_user', JSON.stringify(state.currentUser));
  else
    localStorage.removeItem('rhythmix_user');
}

/* ============================================================
   4. DOM HELPERS
============================================================ */
const $  = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);

/* ============================================================
   5. TOAST NOTIFICATIONS (replaces excessive alerts)
   KEY JS CONCEPT: createElement, appendChild, setTimeout
============================================================ */
function showToast(msg, type = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

/* ============================================================
   6. FORM VALIDATION UTILITIES
   KEY JS CONCEPT: Regular Expressions, classList, setAttribute
============================================================ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pwd) {
  return pwd.length >= 8;
}

function setFieldError(inputEl, errorEl, msg) {
  inputEl.classList.add('is-invalid');
  if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
}

function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove('is-invalid');
  inputEl.classList.add('is-valid');
  if (errorEl) errorEl.style.display = 'none';
}

function resetFormErrors(formEl) {
  formEl.querySelectorAll('.is-invalid,.is-valid').forEach(el => {
    el.classList.remove('is-invalid','is-valid');
  });
}

/* ─── Validate Login Form ─── */
function validateLoginForm() {
  let valid = true;
  const email = $('loginEmail').value.trim();
  const pwd   = $('loginPassword').value;

  if (!email || !isValidEmail(email)) {
    setFieldError($('loginEmail'), $('loginEmailErr'), 'Please enter a valid email address.');
    valid = false;
  } else {
    clearFieldError($('loginEmail'), $('loginEmailErr'));
  }

  if (!pwd) {
    setFieldError($('loginPassword'), $('loginPwdErr'), 'Password is required.');
    valid = false;
  } else {
    clearFieldError($('loginPassword'), $('loginPwdErr'));
  }

  return valid;
}

/* ─── Validate Signup Form ─── */
function validateSignupForm() {
  let valid = true;
  const name     = $('signupName').value.trim();
  const email    = $('signupEmail').value.trim();
  const pwd      = $('signupPassword').value;
  const confirm  = $('signupConfirm').value;
  const terms    = $('agreeTerms').checked;

  if (!name || name.length < 2) {
    setFieldError($('signupName'), $('signupNameErr'), 'Name must be at least 2 characters.');
    valid = false;
  } else { clearFieldError($('signupName'), $('signupNameErr')); }

  if (!email || !isValidEmail(email)) {
    setFieldError($('signupEmail'), $('signupEmailErr'), 'Please enter a valid email address.');
    valid = false;
  } else if (state.users.some(u => u.email === email)) {
    setFieldError($('signupEmail'), $('signupEmailErr'), 'An account with this email already exists.');
    valid = false;
  } else { clearFieldError($('signupEmail'), $('signupEmailErr')); }

  if (!isValidPassword(pwd)) {
    setFieldError($('signupPassword'), $('signupPwdErr'), 'Password must be at least 8 characters.');
    valid = false;
  } else { clearFieldError($('signupPassword'), $('signupPwdErr')); }

  if (pwd !== confirm) {
    setFieldError($('signupConfirm'), $('signupConfirmErr'), 'Passwords do not match.');
    valid = false;
  } else if (confirm) { clearFieldError($('signupConfirm'), $('signupConfirmErr')); }

  if (!terms) {
    $('agreeTerms').classList.add('is-invalid');
    $('signupTermsErr').textContent = 'You must agree to continue.';
    $('signupTermsErr').style.display = 'block';
    valid = false;
  } else { $('agreeTerms').classList.remove('is-invalid'); }

  return valid;
}

/* ============================================================
   7. AUTH — Login / Signup / Logout
============================================================ */
function handleLogin(e) {
  e.preventDefault();
  if (!validateLoginForm()) return;

  const email = $('loginEmail').value.trim();
  const pwd   = $('loginPassword').value;

  const user = state.users.find(u => u.email === email && u.password === pwd);
  if (!user) {
    // Using alert() as required by assignment
    alert('⚠️ Invalid email or password. Please try again.');
    return;
  }

  state.currentUser = { name: user.name, email: user.email };
  saveToStorage();
  bootstrap.Modal.getInstance($('loginModal')).hide();
  updateUserUI();
  showToast(`Welcome back, ${user.name}! 🎵`, 'accent');
}

function handleSignup(e) {
  e.preventDefault();
  if (!validateSignupForm()) return;

  const newUser = {
    name     : $('signupName').value.trim(),
    email    : $('signupEmail').value.trim(),
    password : $('signupPassword').value,
  };
  state.users.push(newUser);
  state.currentUser = { name: newUser.name, email: newUser.email };
  saveToStorage();
  bootstrap.Modal.getInstance($('signupModal')).hide();
  updateUserUI();
  showToast(`Account created! Welcome, ${newUser.name} 🎉`, 'accent');
}

function handleLogout() {
  // Using confirm() dialog (close to alert/prompt family)
  const ok = confirm(`Log out of Rhythmix, ${state.currentUser.name}?`);
  if (!ok) return;
  state.currentUser = null;
  saveToStorage();
  updateUserUI();
  showToast('Logged out successfully.');
}

function updateUserUI() {
  const u = state.currentUser;
  $('displayUserName').textContent = u ? u.name : 'Guest';
  $('userAvatar').textContent      = u ? u.name[0].toUpperCase() : '?';
  $('btnLogout').style.display     = u ? 'flex' : 'none';
  $('btnLogin').style.display      = u ? 'none' : '';
  $('btnSignUp').style.display     = u ? 'none' : '';
}

/* ============================================================
   8. NAVIGATION
   KEY JS CONCEPT: classList.add / remove, data attributes
============================================================ */
function navigateTo(section) {
  state.activeSection = section;

  // Toggle section visibility
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  const target = $(`section-${section}`);
  if (target) target.classList.add('active');

  // Toggle active nav link
  document.querySelectorAll('.nav-item').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
  });

  // Show/hide search box
  $('searchSection').style.display = section === 'search' ? 'flex' : 'none';

  if (section === 'liked')   renderLikedSongs();
  if (section === 'library') renderLibrary();
}

/* ============================================================
   9. PLAYER ENGINE (simulated — no audio file needed)
   KEY JS CONCEPT: setInterval / clearInterval, Math.random
============================================================ */
function loadTrack(index) {
  state.currentTrackIndex = index;
  const song = state.queue[index];
  if (!song) return;

  // Update player UI
  $('playerThumb').textContent       = song.emoji;
  $('playerTrackName').textContent   = song.title;
  $('playerArtistName').textContent  = song.artist;

  // Liked button state
  const liked = state.likedSongs.includes(song.id);
  $('playerLikeBtn').innerHTML = `<i class="bi bi-heart${liked ? '-fill' : ''}"></i>`;
  $('playerLikeBtn').classList.toggle('active', liked);

  // Reset progress
  state.progress = 0;
  $('progressBarFill').style.width = '0%';
  $('currentTime').textContent     = '0:00';
  $('totalTime').textContent       = song.duration;

  // Highlight playing row in any visible track list
  document.querySelectorAll('.track-row').forEach(row => {
    row.classList.toggle('playing', parseInt(row.dataset.songId) === song.id);
  });
}

function playTrack(index) {
  loadTrack(index);
  state.isPlaying = true;
  startProgressSimulation();
  updatePlayButton();
}

function togglePlayPause() {
  if (state.currentTrackIndex < 0) {
    playTrack(0);
    return;
  }
  state.isPlaying = !state.isPlaying;
  state.isPlaying ? startProgressSimulation() : stopProgressSimulation();
  updatePlayButton();
}

function updatePlayButton() {
  $('btnPlayPause').innerHTML = state.isPlaying
    ? '<i class="bi bi-pause-fill"></i>'
    : '<i class="bi bi-play-fill"></i>';
}

function nextTrack() {
  let next;
  if (state.isShuffle) {
    next = Math.floor(Math.random() * state.queue.length);
  } else {
    next = (state.currentTrackIndex + 1) % state.queue.length;
  }
  playTrack(next);
}

function prevTrack() {
  const prev = state.currentTrackIndex <= 0
    ? state.queue.length - 1
    : state.currentTrackIndex - 1;
  playTrack(prev);
}

/* Simulated progress bar (interval-based) */
function startProgressSimulation() {
  stopProgressSimulation();
  const song = state.queue[state.currentTrackIndex];
  if (!song) return;

  const [m, s]       = song.duration.split(':').map(Number);
  const totalSec     = m * 60 + s;
  const intervalMs   = 500;
  const stepPct      = (intervalMs / 1000 / totalSec) * 100;

  state.progressTimer = setInterval(() => {
    if (!state.isPlaying) return;
    state.progress = Math.min(100, state.progress + stepPct);
    $('progressBarFill').style.width = `${state.progress}%`;

    // Update current time display
    const elapsedSec = Math.floor((state.progress / 100) * totalSec);
    $('currentTime').textContent = formatTime(elapsedSec);

    if (state.progress >= 100) {
      stopProgressSimulation();
      if (state.isRepeat) {
        state.progress = 0;
        playTrack(state.currentTrackIndex);
      } else {
        nextTrack();
      }
    }
  }, intervalMs);
}

function stopProgressSimulation() {
  if (state.progressTimer) {
    clearInterval(state.progressTimer);
    state.progressTimer = null;
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* Seek on progress bar click */
function handleSeek(e) {
  const rect  = e.currentTarget.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  state.progress = Math.max(0, Math.min(100, ratio * 100));
  $('progressBarFill').style.width = `${state.progress}%`;

  const song = state.queue[state.currentTrackIndex];
  if (!song) return;
  const [m, s] = song.duration.split(':').map(Number);
  const totalSec = m * 60 + s;
  $('currentTime').textContent = formatTime(Math.floor((state.progress / 100) * totalSec));
}

/* Volume */
function handleVolume(e) {
  state.volume = parseInt(e.target.value);
  updateMuteIcon();
}

function toggleMute() {
  state.isMuted = !state.isMuted;
  updateMuteIcon();
}

function updateMuteIcon() {
  const v = state.isMuted || state.volume === 0;
  $('btnMute').innerHTML = v
    ? '<i class="bi bi-volume-mute-fill"></i>'
    : state.volume < 50
      ? '<i class="bi bi-volume-down-fill"></i>'
      : '<i class="bi bi-volume-up-fill"></i>';
}

/* Shuffle & Repeat */
function toggleShuffle() {
  state.isShuffle = !state.isShuffle;
  $('btnShuffle').classList.toggle('active', state.isShuffle);
  showToast(state.isShuffle ? 'Shuffle on' : 'Shuffle off');
}

function toggleRepeat() {
  state.isRepeat = !state.isRepeat;
  $('btnRepeat').classList.toggle('active', state.isRepeat);
  showToast(state.isRepeat ? 'Repeat on' : 'Repeat off');
}

/* ============================================================
   10. LIKE / UNLIKE
   KEY JS CONCEPT: Array.includes, Array.push, Array.filter
============================================================ */
function toggleLike(songId) {
  if (state.likedSongs.includes(songId)) {
    state.likedSongs = state.likedSongs.filter(id => id !== songId);
    showToast('Removed from Liked Songs');
  } else {
    state.likedSongs.push(songId);
    showToast('Added to Liked Songs ❤️', 'accent');
  }
  saveToStorage();

  // Update player heart if this is the current track
  const cur = state.queue[state.currentTrackIndex];
  if (cur && cur.id === songId) {
    const liked = state.likedSongs.includes(songId);
    $('playerLikeBtn').innerHTML = `<i class="bi bi-heart${liked ? '-fill' : ''}"></i>`;
    $('playerLikeBtn').classList.toggle('active', liked);
  }

  // Re-render liked section if open
  if (state.activeSection === 'liked') renderLikedSongs();
  $('likedCount').textContent = `${state.likedSongs.length} songs`;
}

/* ============================================================
   11. PLAYLISTS
   KEY JS CONCEPT: prompt(), Date.now(), Array.find
============================================================ */
function createPlaylist() {
  // Using prompt() as required by the assignment
  const name = prompt('Enter a name for your new playlist:');
  if (!name || !name.trim()) {
    if (name !== null) alert('Playlist name cannot be empty!');
    return;
  }
  const playlist = {
    id      : Date.now(),
    name    : name.trim(),
    songIds : [],
  };
  state.playlists.push(playlist);
  saveToStorage();
  renderPlaylistSidebar();
  showToast(`Playlist "${playlist.name}" created 🎶`, 'accent');
}

function addToPlaylist(songId) {
  if (state.playlists.length === 0) {
    // Using prompt-based flow
    const ok = confirm('You have no playlists yet. Create one now?');
    if (!ok) return;
    createPlaylist();
    if (state.playlists.length === 0) return;
  }

  // Build options string for prompt
  const opts = state.playlists
    .map((p, i) => `${i + 1}. ${p.name}`)
    .join('\n');
  const input = prompt(`Choose a playlist to add this song:\n\n${opts}\n\nEnter number:`);
  if (!input) return;

  const idx = parseInt(input) - 1;
  if (isNaN(idx) || idx < 0 || idx >= state.playlists.length) {
    alert('Invalid selection.');
    return;
  }

  const playlist = state.playlists[idx];
  if (playlist.songIds.includes(songId)) {
    alert(`This song is already in "${playlist.name}".`);
    return;
  }
  playlist.songIds.push(songId);
  saveToStorage();
  showToast(`Added to "${playlist.name}" ✅`, 'accent');
}

/* ============================================================
   12. RENDER FUNCTIONS
   KEY JS CONCEPT: Array.map, join, innerHTML, template literals
============================================================ */

/* Quick picks grid (home) */
function renderQuickGrid() {
  const picks = SONGS.slice(0, 8);
  $('quickGrid').innerHTML = picks.map(song => `
    <div class="quick-card" onclick="playTrack(${state.queue.indexOf(song)})">
      <div class="quick-thumb">${song.emoji}</div>
      <div class="quick-title">${song.title}</div>
    </div>
  `).join('');
}

/* Featured albums row */
function renderFeaturedAlbums() {
  const albums = [...new Set(SONGS.map(s => s.album))].slice(0, 8);
  $('featuredRow').innerHTML = albums.map(album => {
    const song = SONGS.find(s => s.album === album);
    return `
      <div class="album-card" onclick="playAlbum('${album}')">
        <div class="album-thumb">
          ${song.emoji}
          <div class="play-overlay"><i class="bi bi-play-fill"></i></div>
        </div>
        <div class="album-title">${album}</div>
        <div class="album-artist">${song.artist}</div>
      </div>
    `;
  }).join('');
}

/* Trending row */
function renderTrendingRow() {
  const trending = [...SONGS].sort(() => Math.random() - 0.5).slice(0, 8);
  $('trendingRow').innerHTML = trending.map(song => `
    <div class="album-card" onclick="playTrack(${state.queue.indexOf(song)})">
      <div class="album-thumb">
        ${song.emoji}
        <div class="play-overlay"><i class="bi bi-play-fill"></i></div>
      </div>
      <div class="album-title">${song.title}</div>
      <div class="album-artist">${song.artist}</div>
    </div>
  `).join('');
}

/* Genre grid */
function renderGenreGrid() {
  $('genreGrid').innerHTML = GENRES.map(g => `
    <div class="genre-card" style="background:${g.color}" data-emoji="${g.emoji}"
         onclick="filterByGenre('${g.name}')">
      ${g.name}
    </div>
  `).join('');
}

/* Generic track list renderer */
function renderTrackList(songs, containerId) {
  const container = $(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="track-header">
      <span>#</span>
      <span>TITLE</span>
      <span>ALBUM</span>
      <span>⏱</span>
      <span></span>
    </div>
    <div class="track-list">
      ${songs.map((song, i) => `
        <div class="track-row ${state.likedSongs.includes(song.id) ? 'liked-row' : ''}"
             data-song-id="${song.id}"
             onclick="playTrack(${state.queue.indexOf(song)})">
          <span class="tr-num">${i + 1}</span>
          <div class="tr-info">
            <div class="tr-name">${song.emoji} ${song.title}</div>
            <div class="tr-artist">${song.artist}</div>
          </div>
          <span class="tr-album">${song.album}</span>
          <span class="tr-dur">${song.duration}</span>
          <div class="tr-actions" onclick="event.stopPropagation()">
            <button class="btn-icon ${state.likedSongs.includes(song.id) ? 'active' : ''}"
                    onclick="toggleLike(${song.id})" title="Like">
              <i class="bi bi-heart${state.likedSongs.includes(song.id) ? '-fill' : ''}"></i>
            </button>
            <button class="btn-icon" onclick="addToPlaylist(${song.id})" title="Add to playlist">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* Liked songs section */
function renderLikedSongs() {
  const liked = SONGS.filter(s => state.likedSongs.includes(s.id));
  $('likedCount').textContent = `${liked.length} songs`;
  if (liked.length === 0) {
    $('likedList').innerHTML = `<p class="text-muted mt-3">Songs you like will appear here ❤️</p>`;
    return;
  }
  renderTrackList(liked, 'likedList');
}

/* Library */
function renderLibrary() {
  if (state.playlists.length === 0) {
    $('libraryContent').innerHTML = `
      <div class="text-center py-5">
        <p class="text-muted mb-3">Your library is empty</p>
        <button class="btn-pill" onclick="createPlaylist()">
          <i class="bi bi-plus-lg me-1"></i>Create Playlist
        </button>
      </div>`;
    return;
  }

  $('libraryContent').innerHTML = state.playlists.map(p => {
    const songs = SONGS.filter(s => p.songIds.includes(s.id));
    return `
      <div class="mb-4">
        <h5 class="sub-title">${p.name} <small class="text-muted fw-normal">(${songs.length} songs)</small></h5>
        ${songs.length === 0
          ? '<p class="text-muted">No songs yet. Use the + button while browsing.</p>'
          : `<div id="pl-${p.id}"></div>`}
      </div>`;
  }).join('');

  // Populate each playlist track list after HTML is inserted
  state.playlists.forEach(p => {
    const songs = SONGS.filter(s => p.songIds.includes(s.id));
    if (songs.length > 0) renderTrackList(songs, `pl-${p.id}`);
  });
}

/* Playlist sidebar */
function renderPlaylistSidebar() {
  $('playlistList').innerHTML = state.playlists.map(p => `
    <li class="playlist-item" onclick="navigateTo('library')">
      <i class="bi bi-music-note-list me-2"></i>${p.name}
    </li>
  `).join('');
}

/* Play all songs of an album */
function playAlbum(albumName) {
  const albumSongs = SONGS.filter(s => s.album === albumName);
  if (albumSongs.length === 0) return;
  state.queue = albumSongs;
  playTrack(0);
  showToast(`Now playing: ${albumName} 🎵`, 'accent');
}

/* Filter by genre — shows in search section */
function filterByGenre(genre) {
  navigateTo('search');
  const filtered = SONGS.filter(s => s.genre === genre);
  $('searchInput').value = genre;
  $('searchResults').innerHTML = `<h4 class="sub-title mb-3">${genre} — ${filtered.length} songs</h4>`;
  const list = document.createElement('div');
  list.id = 'genreResults';
  $('searchResults').appendChild(list);
  renderTrackList(filtered, 'genreResults');
  // Reset queue to genre results
  state.queue = filtered;
}

/* ============================================================
   13. SEARCH
   KEY JS CONCEPT: String.toLowerCase, Array.filter, input event
============================================================ */
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    $('searchResults').innerHTML = '';
    return;
  }

  const results = SONGS.filter(s =>
    s.title.toLowerCase().includes(query)  ||
    s.artist.toLowerCase().includes(query) ||
    s.album.toLowerCase().includes(query)  ||
    s.genre.toLowerCase().includes(query)
  );

  $('searchResults').innerHTML = `<h4 class="sub-title mb-2">Results for "${query}" — ${results.length} found</h4>
    <div id="searchResultList"></div>`;

  if (results.length > 0) {
    state.queue = results;
    renderTrackList(results, 'searchResultList');
  } else {
    $('searchResults').innerHTML += '<p class="text-muted">No songs found.</p>';
  }
}

/* ============================================================
   14. PASSWORD TOGGLE
   KEY JS CONCEPT: element.type, DOM attribute manipulation
============================================================ */
function setupPasswordToggle(btnId, inputId) {
  $(btnId).addEventListener('click', () => {
    const input = $(inputId);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    $(btnId).querySelector('i').className = `bi bi-eye${isText ? '' : '-slash'}`;
  });
}

/* ============================================================
   15. EVENT LISTENERS SETUP
   KEY JS CONCEPT: addEventListener, event delegation
============================================================ */
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });

  // Auth buttons
  $('btnLogin').addEventListener('click', () =>
    new bootstrap.Modal($('loginModal')).show()
  );
  $('btnSignUp').addEventListener('click', () =>
    new bootstrap.Modal($('signupModal')).show()
  );
  $('btnLogout').addEventListener('click', handleLogout);

  // Forms
  $('loginForm').addEventListener('submit',  handleLogin);
  $('signupForm').addEventListener('submit', handleSignup);

  // Real-time validation on blur
  $('loginEmail').addEventListener('blur', () => {
    const v = $('loginEmail').value.trim();
    if (v && !isValidEmail(v))
      setFieldError($('loginEmail'), $('loginEmailErr'), 'Invalid email address.');
    else if (v)
      clearFieldError($('loginEmail'), $('loginEmailErr'));
  });

  $('signupPassword').addEventListener('input', () => {
    const v = $('signupPassword').value;
    if (v && !isValidPassword(v))
      setFieldError($('signupPassword'), $('signupPwdErr'), 'Minimum 8 characters required.');
    else if (v)
      clearFieldError($('signupPassword'), $('signupPwdErr'));
  });

  // Password toggles
  setupPasswordToggle('toggleLoginPwd',  'loginPassword');
  setupPasswordToggle('toggleSignupPwd', 'signupPassword');

  // Player controls
  $('btnPlayPause').addEventListener('click', togglePlayPause);
  $('btnNext').addEventListener('click', nextTrack);
  $('btnPrev').addEventListener('click', prevTrack);
  $('btnShuffle').addEventListener('click', toggleShuffle);
  $('btnRepeat').addEventListener('click', toggleRepeat);
  $('btnMute').addEventListener('click', toggleMute);
  $('volumeSlider').addEventListener('input', handleVolume);
  $('progressBarWrap').addEventListener('click', handleSeek);
  $('playerLikeBtn').addEventListener('click', () => {
    const cur = state.queue[state.currentTrackIndex];
    if (cur) toggleLike(cur.id);
  });

  // Playlist creation
  $('btnCreatePlaylist').addEventListener('click', createPlaylist);

  // Search
  $('searchInput').addEventListener('input', handleSearch);

  // Reset form errors when modals are hidden
  $('loginModal').addEventListener('hidden.bs.modal', () =>
    resetFormErrors($('loginForm'))
  );
  $('signupModal').addEventListener('hidden.bs.modal', () =>
    resetFormErrors($('signupForm'))
  );

  // Keyboard shortcut: Space = play/pause
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      togglePlayPause();
    }
  });
}

/* ============================================================
   16. INIT — App Bootstrap
============================================================ */
function init() {
  loadFromStorage();
  setupEventListeners();
  renderQuickGrid();
  renderFeaturedAlbums();
  renderTrendingRow();
  renderGenreGrid();
  renderPlaylistSidebar();
  updateUserUI();
  $('likedCount').textContent = `${state.likedSongs.length} songs`;
  navigateTo('home');

  // Welcome alert (uses alert as required)
  setTimeout(() => {
    alert('🎵 Welcome to Rhythmix!\n\nTip: Click any song to play it, press Space to pause/resume, and use the ❤️ button to save your favorites.');
  }, 800);
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
