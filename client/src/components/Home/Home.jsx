import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api";
import Favourites from "../Favourites/Favourites";

const Home = () => {
  let [categories, setCategories] = useState([]);
  //put browse_categories api call in a function
  const navigate = useNavigate();
  useEffect(() => {
    const apiData = async () => {
      let access_token = localStorage.getItem("access_token");
      let data = await apiCall(
        `http://localhost:8888/browse_categories/?access_token=${access_token}`
      );
      // console.log(data.data.data.categories.items);
      setCategories(data.data.categories.items);
    };
    apiData();
    console.log(categories);
  }, []);

  return (
    <>
      <h4>Browse Categories</h4>
      <div className="category_container">
        <br />
        <div><Favourites/></div>
        {categories.map((data, idx) => {
          return (
            <div className="card" style={{ width: "18rem" }}>
              {data.icons.map((img_data) => {
                return (
                  <img
                    className="card-img-top"
                    src={img_data.url}
                    alt="Card image cap"
                  />
                );
              })}

              <div className="card-body">
                <h5 className="card-title">{data.name}</h5>
                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                <a onClick={() => navigate(`/category?id=${data.id}`)}>
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

export default Home;
