import React from 'react'
import axios from 'axios'

const Login = () => {
    async function getAccessToken() {
        try {
          await axios.get("http://localhost:8888/login").then((res) => {
            console.log("access token");
          });
        } catch (err) {
          console.log(err);
        }
      }
  return (
    <div><button type="submit" onClick={()=>{getAccessToken();}}>Log-in with Spotify</button></div>
  )
}

export default Login