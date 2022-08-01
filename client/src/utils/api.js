import axios from "axios";

let apiCall = async(url) => {
  let access_token = localStorage.getItem("access_token");
  let refresh_token = localStorage.getItem("refresh_token");
  let token_timestamp = localStorage.getItem("token_timestamp");
  let expires_in = localStorage.getItem("expires_in");
  let time_now = Date.now();
  let time_left = time_now - token_timestamp;
  let headers = { 'Authorization': 'Bearer ' + access_token };
  let api_url = url ;//+ `/?access_token=${access_token}`;
  let api_data;
  try {
   // console.log(time_left);
    if (time_left <= expires_in) {

     api_data=await axios.get(api_url, { headers: headers, })
     console.log(api_data);
     return api_data.data;
       
    } else {
      let refresh= await axios.get(`http://localhost:8888/refresh_token/?refresh_token=${refresh_token}`);
      localStorage.setItem("access_token", refresh.data.access_token);
      access_token = refresh.data.access_token;
          
      api_data=await axios.get(api_url, { headers: headers, })
      console.log(api_data);
      return api_data.data;
    }
   
  } catch (err) {
    return err;
  }

}

export { apiCall }