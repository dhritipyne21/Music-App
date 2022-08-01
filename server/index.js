
const express = require('express'); // Express web server framework
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const axios = require('axios');
require('dotenv').config({
  path: `${__dirname}/.env`
})

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri



/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({ 
    target: 'http://localhost:8080/', //original url
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));
app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/', function (req, res) {
  res.send("Done!!!!!!");
})

app.get('/login', function (req, res) {

  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    let url = 'https://accounts.spotify.com/api/token';
    let form = querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    });
    let headers = {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    };




    axios.post(url, form, { headers: headers, })
      .then(({status,data}) => {
        if (status === 200) {
          console.log(data);
          let {access_token,refresh_token,expires_in} = data;
          //use the access token to access the Spotify Web API
          
          axios.get('https://api.spotify.com/v1/me', { headers: { 'Authorization': 'Bearer ' + access_token }, })
            .then((response) => console.log("response.body"))
            .catch((error) => {
              console.log(error);
            });

          // we can also pass the token to the browser to make requests from there
          res.redirect('http://localhost:3000/?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
              expires_in: expires_in
            }));
           

        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  
  let url = 'https://accounts.spotify.com/api/token';
  let headers = { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) };
  let form = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  });

  axios.post(url, form, { headers: headers, })
    .then(({status,data}) => {
      if (status === 200) {
        let {access_token} = data;
        res.send({
          'access_token': access_token
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })

});

//https://api.spotify.com/v1/browse/categories/toplists



app.get('/browse_categories', function (req, res) {
//console.log('call hocche?')
  // requesting access token from refresh token
  let access_token = req.query.access_token;
  
  let url = 'https://api.spotify.com/v1/browse/categories';
  let headers = { 'Authorization': 'Bearer ' + access_token };
 // "Authorization: Bearer BQB4dKOEan97SflNCSBjlXNRKeXUhHT_EuomeiepeS09p9-rOx3vBVfnmpgHErqlAgMKPXDPu8RNN9iebic"

  axios.get(url, { headers: headers, })
    .then(({status,data}) => {
      if (status === 200) {
        //let {access_token} = data;
        console.log(data);
        res.send({
          'data': data
        });

      }
    })
    .catch((error) => {
      console.log(error);
    })

});

console.log('Listening on 8888');
app.listen(8888);