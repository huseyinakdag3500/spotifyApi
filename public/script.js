let currentTrackId = null; 
let isPlaying = false; 

function login() {
  window.location.href = '/login';
}

async function getCurrentlyPlaying(accessToken, isInitial = false) {
  try {
    const nowPlayingDiv = document.getElementById('now-playing');
    const songEl = document.getElementById('song');
    const artistEl = document.getElementById('artist');
    const albumEl = document.getElementById('album');
    const albumImageEl = document.getElementById('album-image');
    const loadingEl = document.getElementById('loading');

    
    if (isInitial) {
      loadingEl.style.display = 'block';
      loadingEl.textContent = 'Yükleniyor...';
      nowPlayingDiv.style.display = 'none';
    }

    const response = await fetch(`/currently-playing?access_token=${accessToken}`);
    const data = await response.json();
    
    console.log('Spotify API Ham Veri:', data.raw_data);
    
    if (data.is_playing !== isPlaying || (data.is_playing && data.track_id !== currentTrackId)) {
      isPlaying = data.is_playing;
      currentTrackId = data.track_id;
      
      
      if (!isInitial) {
        loadingEl.style.display = 'block';
        loadingEl.textContent = 'Yükleniyor...';
        nowPlayingDiv.style.display = 'none';
      }

      if (!data.is_playing || !data.track_id) {
        songEl.textContent = 'Şu anda çalan bir şarkı yok.';
        artistEl.textContent = '';
        albumEl.textContent = '';
        albumImageEl.src = '';
        albumImageEl.style.display = 'none';
      } else {
        songEl.textContent = data.song;
        artistEl.textContent = `Sanatçı: ${data.artist}`;
        albumEl.textContent = `Albüm: ${data.album}`;
        albumImageEl.src = data.image_url || '';
        albumImageEl.style.display = data.image_url ? 'block' : 'none';

        
        nowPlayingDiv.classList.add('fade-in');
        setTimeout(() => nowPlayingDiv.classList.remove('fade-in'), 500);
      }
      nowPlayingDiv.style.display = 'block';
    }

    
    loadingEl.style.display = 'none';
  } catch (error) {
    console.error('Hata:', error);
    document.getElementById('loading').textContent = 'Hata: Veri alınamadı';
    document.getElementById('loading').style.display = 'block';
    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
    }, 2000); 
  }
}


const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
if (accessToken) {
  document.getElementById('login').style.display = 'none';
  
  getCurrentlyPlaying(accessToken, true);
  
  setInterval(() => getCurrentlyPlaying(accessToken), 4000);
}