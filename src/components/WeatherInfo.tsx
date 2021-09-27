import { useState } from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
`;

const InfoCard = styled.div`
  display: flex;
  width: 25%;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 10rem;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  img {
    margin: 0 auto;
  }
  li {
    margin-bottom: 20px;
  }
  font-size: 2rem;
`;

const convertToFahrenheit = (temp: number) => {
  return Math.floor((temp * 9) / 5 + 32);
};

export const WeatherInfo = ({ info }: any) => {
  const [temp, setTemp] = useState(info.main.temp);
  const [feelsLike, setFeelsLike] = useState(info.main.feels_like);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  const convertToF = () => {
    if (!isFahrenheit) {
      setTemp(convertToFahrenheit(temp));
      setFeelsLike(convertToFahrenheit(feelsLike));
      setIsFahrenheit(!isFahrenheit);
    } else {
      setTemp(info.main.temp);
      setFeelsLike(info.main.feels_like);
      setIsFahrenheit(!isFahrenheit);
    }
  };

  return (
    <Wrapper>
      <InfoCard>
        <img src={info.weather[0].icon} alt={info.weather[0].main} />
        <ul>
          <li>
            <h1>{Math.floor(temp)} °C</h1>
          </li>
          <li>
            <span>feels like</span> <h2>{Math.floor(feelsLike)} °C</h2>
          </li>
          <li>
            <h2>{info.weather[0].description}</h2>
          </li>
          <li>
            <p>
              {" "}
              {info.name}, {info.sys.country}
            </p>
          </li>
          <li>
            <button onClick={convertToF}>
              To {isFahrenheit ? "°C" : "°F"}
            </button>
          </li>
        </ul>
      </InfoCard>
    </Wrapper>
  );
};
