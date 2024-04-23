import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import axios from "axios";

import { WeatherData } from "./type";
const Weather = () => {
  const [wheather, setWeather] = useState<WeatherData>();
  console.log("🚀 ~ Wheather ~ wheather:", wheather?.main.temp);

  useEffect(() => {
    const getWeather = async () => {
      const response = await axios.get<WeatherData>(
        "https://api.openweathermap.org/data/2.5/weather?lat=28&lon=77&appid=a01626d7ee1ff13c0d13d4371473e12e"  //TODO: Restructure the code
      );
      const weather: WeatherData =await response.data;
      setWeather(weather);
    };
    getWeather();
  }, []);
  return (
    <div className="w-64 h-32 bg-white rounded-lg ">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Cloud size={64} />
          <div className="px-4">
            <h1 className="text-2xl font-bold">42</h1>
            <h2 className="text-2xl font-bold">Delhi</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
