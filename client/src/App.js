import { useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';
import { Link, useLocation, useNavigate } from "react-router-dom";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery();
  let access_token = query.get("access_token");
  let refresh_token = query.get("refresh_token");
  let expires_in= query.get("expires_in");
  const navigate = useNavigate();

  useEffect(() => {
    if(access_token && refresh_token && expires_in){
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("token_timestamp", Date.now());
      navigate(
        `/home`
      )
    }
    
  }, [access_token,refresh_token,expires_in])


  return (
    <a className="App-link" href="http://localhost:8888/login">
            Login to Spotify
          </a>
          
  );
}

export default App;
