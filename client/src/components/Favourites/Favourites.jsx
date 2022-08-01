import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Favourites = () => {
  let [categories, setCategories] = useState([]);
  //put browse_categories api call in a function
  const navigate = useNavigate();
  let query = useQuery();

  const id = query.get("id");
  useEffect(() => {
    const apiData = async () => {
      let data = await apiCall(
        `https://api.spotify.com/v1/me/top/tracks`
      );
      console.log(data.items);
      setCategories(data.items);
    };
    apiData();
    console.log(categories);
  }, []);
  return (
    <>
      {" "}
      <h4>Browse Playlists</h4>
      <div className="category_container">
        <br />
        {categories.map((data, idx) => {
          return (
            <div className="card" style={{ width: "18rem" }}>
              {/* {data.album.images.map((img_data) => {
                return ( */}
                  <img
                    className="card-img-top"
                    src={data.album.images[0].url}
                    alt="Card image cap"
                  />
            {/* //     );
            //   })} */}

              <div className="card-body">
                <h5 className="card-title">{data.name}</h5>
                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                <a onClick={() => console.log('w')}>
                  Browse
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Favourites;
