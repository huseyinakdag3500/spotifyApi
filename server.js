require('dotenv').config();

const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 


const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;



const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
});

app.get('/login', (req, res) => {
    const scopes = ['user-read-currently-playing'];
    const authorizeUrl = spotifyApi.createAuthorizeURL(scopes, 'state');
    res.redirect(authorizeUrl);
  });
  
  app.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const data = await spotifyApi.authorizationCodeGrant(code);
      const { access_token, refresh_token } = data.body;
      res.redirect(`/?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
      res.send('Hata: Yetkilendirme başarısız');
    }
  });
  
  app.get('/currently-playing', async (req, res) => {
    const { access_token } = req.query;
    spotifyApi.setAccessToken(access_token);
  
    try {
      const data = await spotifyApi.getMyCurrentPlayingTrack();
      
      if (data.body && data.body.item && data.body.is_playing) {
        res.json({
          is_playing: data.body.is_playing,
          song: data.body.item.name,
          artist: data.body.item.artists.map(artist => artist.name).join(', '),
          album: data.body.item.album.name,
          track_id: data.body.item.id,
          image_url: data.body.item.album.images[0]?.url || '',
          
        });
      } else {
        res.json({
          is_playing: false,
          message: 'Şu anda çalan bir şarkı yok.',
          track_id: null,
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'API hatası' });
    }
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Sunucu hatası' });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  });
