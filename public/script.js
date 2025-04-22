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
    const time_wave = document.querySelector('.time-wave');
    console.log(time_wave.style.display);
    
    if (isInitial) {
      loadingEl.style.display = 'block';
      loadingEl.textContent = 'Yükleniyor...';
      nowPlayingDiv.style.display = 'none';
      time_wave.style.display='none';
    }

    const response = await fetch(`/currently-playing?access_token=${accessToken}`);
    const data = await response.json();
    
   
    
    if (data.is_playing !== isPlaying || (data.is_playing && data.track_id !== currentTrackId)) {
      isPlaying = data.is_playing;
      currentTrackId = data.track_id;
      
      
      if (!isInitial) {
        loadingEl.style.display = 'block';
        loadingEl.textContent = 'Yükleniyor...';
        nowPlayingDiv.style.display = 'none';
        time_wave.style.display='none';
      }

      if (!data.is_playing || !data.track_id) {
        songEl.textContent = 'Şu anda çalan bir şarkı yok.';
        artistEl.textContent = '';
        albumEl.textContent = '';
        albumImageEl.src = '';
        albumImageEl.style.display = 'none';
        time_wave.style.display='none';
      } else {
        songEl.textContent = data.song;
        artistEl.textContent = `Sanatçı: ${data.artist}`;
        albumEl.textContent = `Albüm: ${data.album}`;
        albumImageEl.src = data.image_url || '';
        albumImageEl.style.display = data.image_url ? 'block' : 'none';
        time_wave.style.display="flex";
        
        nowPlayingDiv.classList.add('fade-in');
        setTimeout(() => nowPlayingDiv.classList.remove('fade-in'), 500);
        
        //if(time_wave.style.display == "flex"{
         var nowPlayingWidth = document.querySelector('#now-playing-container').offsetWidth;
        let barCount = Math.floor(nowPlayingWidth/10)+20;
          time_wave.innerHTML ="";
          for(let i = 0 ;i<barCount;i++){
            time_wave.innerHTML += '<div class="bar"></div>';
          }
        setInterval(()=>{
          
          const time_waveBar = time_wave.querySelectorAll('.bar');

          time_waveBar.forEach((bar,index) =>{
            let barHeight = Math.floor(Math.random()*75);
            bar.style.height = barHeight + 'px';
          });
        }
          
        },150);
      //}
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
  
  setInterval(() => getCurrentlyPlaying(accessToken), 2000);
}
