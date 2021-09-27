import Axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import { WeatherInfo } from "./components/WeatherInfo";
import styled from "styled-components/macro";
import { Perloader } from "./components/Perloader";
import { motion } from "framer-motion";

interface WrapperProp {
  background: string;
}

const Wrapper = styled.div<WrapperProp>`
  width: 100%;
  height: 100vh;
  background: ${({ background }) =>
    background ? `url(${background})` : "#e6e6e6"};
  background-size: cover;
  display: flex;
  align-items: center;
`;

function App() {
  const [bg, setBg] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);

  const getWeatherInfo = async (locationInfo: any) => {
    try {
      const res = await Axios.get(
        `https://weather-proxy.freecodecamp.rocks/api/current?lat=${locationInfo.latitude}&lon=${locationInfo.longitude}`
      );
      if (!res.data) console.log(`can't find anything`);
      return res.data;
    } catch (e) {
      setError(e);
    }
  };

  const gotPermission = async (pos: any) => {
    const weatherInfo = await getWeatherInfo(pos.coords);
    if (weatherInfo) {
      const country = await Axios.get(
        `http://api.worldbank.org/v2/country/${weatherInfo.sys.country}?format=json`
      );
      if (!country) return null;
      const countryName = country.data[1][0].name;
      const query = `${weatherInfo.name},${countryName},${weatherInfo.weather[0].description}`;
      setInfo(weatherInfo);
      const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`;
      try {
        const res = await Axios.get(apiUrl);
        if (!res) return null;
        if (res.data?.results.length) {
          const randomNum = Math.floor(Math.random() * 9);
          setBg(res.data.results[randomNum].urls.regular);
          setLoading(false);
        }
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    }
  };

  const gotNoPermision = () => {
    console.log("We need your permission to get your location data!");
  };

  const getUsersLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gotPermission, gotNoPermision);
    }
  };

  useEffect(() => {
    getUsersLocation();
  }, []);

  return (
    <div className="App">
      {error && console.log(`it's not working`)}
      {!loading ? (
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Wrapper background={bg}>
            {/* 1.  Get users location */}
            {/* 2. Call weather api to get info */}
            <WeatherInfo info={info} />
            {/* 3. Call unsplash api to get the correct photo for thez app BG*/}
          </Wrapper>
        </motion.div>
      ) : (
        <Perloader />
      )}
    </div>
  );
}

export default App;
