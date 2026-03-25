const musicData = [{ id: 1, title: "Heer Ranjha", artist: "Unknown Artist", category: "romantic", duration: "3:40", albumArt: "Images/Heer-Ranjha.jpg", audio: "songs/heerranjha.mp3" },
     { id: 2, title: "Hum Kya karein Pyar Ka bayan", artist: "Unknown Artist", category: "romantic", duration: "4:05", albumArt: "Images/humkiakrynpyarkabayan.jpg", audio: "songs/hmkrympyarkabayan.mp3" }, 
     { id: 3, title: "Tera Roothna", artist: "Unknown Artist", category: "romantic", duration: "4:00", albumArt: "Images/terahirothna.jpg", audio: "songs/teraroothna.mp3" }, 
     { id: 4, title: "Tera Hi Saya", artist: "Unknown Artist", category: "romantic", duration: "3:50", albumArt: "Images/terahisaya.jpg", audio: "songs/terahisaya.mp3" },
      { id: 5, title: "Teri Kashish", artist: "Unknown Artist", category: "romantic", duration: "3:55", albumArt: "Images/terikashish.jpg", audio: "songs/terikashish.mp3" },
      { id: 6, title: "Tu hai Tw", artist: "Unknown Artist", category: "romantic", duration: "4:10", albumArt: "Images/tutohai.jfif", audio: "songs/tuhaitw.mp3" }];

let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();
let currentPlaylist = [...musicData];

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const searchInput = document.getElementById('searchInput');
const playlistEl = document.getElementById('playlist');
const categoryBtns = document.querySelectorAll('.category-btn');


function init() {
    renderPlaylist();
    setupEventListeners();
    audio.volume = 0.7;
    updateVolumeUI();
}

function setupEventListeners() {
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    progressBar.addEventListener('click', setProgress);
    volumeBar.addEventListener('click', setVolume);
    searchInput.addEventListener('input', handleSearch);
    categoryBtns.forEach(btn => btn.addEventListener('click', handleCategoryFilter));
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', nextSong);
    audio.addEventListener('error', handleAudioError);
}

function renderPlaylist(filteredData = currentPlaylist) {
    playlistEl.innerHTML = '';
    filteredData.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.innerHTML = `
                    <img src="${song.albumArt}" alt="${song.title}">
                    <div class="playlist-info">
                        <div class="playlist-title">${song.title}</div>
                        <div class="playlist-artist">${song.artist}</div>
                    </div>
                `;
        li.addEventListener('click', () => playSong(index));
        playlistEl.appendChild(li);
    });
}

function playSong(index) {
    currentSongIndex = index;
    const song = currentPlaylist[index];

    audio.src = song.audio;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumArt.src = song.albumArt;

    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    albumArt.classList.add('rotating');
    updateActivePlaylistItem();
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.textContent = '▶';
        albumArt.classList.remove('rotating');
    } else {
        audio.play();
        playPauseBtn.textContent = '⏸';
        albumArt.classList.add('rotating');
    }
    isPlaying = !isPlaying;
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSong(currentSongIndex);
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(currentSongIndex);
}

function updateProgress() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = progressPercent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}
function updateDuration() {
    durationEl.textContent = formatTime(audio.duration);
}

function setProgress(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

function setVolume(e) {
    const width = volumeBar.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;

    audio.volume = volume;
    updateVolumeUI();
}

function updateVolumeUI() {
    volumeFill.style.width = (audio.volume * 100) + '%';
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function handleSearch(e) {
    const value = e.target.value.toLowerCase();

    const filtered = currentPlaylist.filter(song =>
        song.title.toLowerCase().includes(value) ||
        song.artist.toLowerCase().includes(value)
    );

    renderPlaylist(filtered);
}

function handleCategoryFilter(e) {
    const category = e.target.dataset.category;

    categoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    if (category === 'all') {
        currentPlaylist = [...musicData];
    } else {
        currentPlaylist = musicData.filter(song => song.category === category);
    }

    renderPlaylist();
}

function updateActivePlaylistItem() {
    const items = document.querySelectorAll('.playlist-item');

    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

function handleAudioError() {
    alert("Audio load nahi ho raha. Internet ya link issue ho sakta hai.");
}
init();
