import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Position {
  latitude: string | number;
  longitude: string | number;
}

import { WeatherData } from "./type";

const weatherDesgin = {
  rain: {
    icon: "",
    bgColor: "",
  },
  clouds: {
    icon: "",
    bgColor: "",
  },
  clear: {
    icon: "",
    bgColor: "",
  },
  thunderstorm: {
    icon: "",
    bgColor: "",
  },
  snow: {
    icon: "",
    bgColor: "",
  },
};

const Weather = () => {
  const [position, setPosition] = useState<Position>({
    latitude: 27,
    longitude: 72,
  });
  const [bgClass, setBgClass] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData>();
  console.log("🚀 ~ Wheather ~ wheather:", weather);

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(
            setPosition((prevState) => ({
              ...prevState,
              latitude,
              longitude,
            }))
          );
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const getWeather = async () => {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric` //TODO: Restructure the code
      );
      const weather: WeatherData = await response.data;
      const weatherCondition = weather.weather[0].main;

      setWeather(weather);
    };
    getWeather();
  }, [position]);

  useEffect(() => {
    if (weather) {
      const weatherCondition = weather.weather[0].main.toLowerCase();

      switch (weatherCondition) {
        case "clouds":
          return setBgClass("bg-blue-100");
        case "clear":
          return setBgClass("bg-green-500");
        case "snow":
          return setBgClass("bg-orange-300");
        case "storm":
          return stormBg;
        // case "rain":
        //   return rainyBg;
        // default:
        //   return tranquilBg;
      }
    }
  }, [weather]);

  return (
    <div className={cn("w-64 h-32  rounded-lg drop-shadow-xl glass", bgClass)}>
      <div className="p-4">
        <div>{}</div>
        <div className="flex items-center justify-between">
          <Cloud size={64} />
          <div className="px-4">
            <h1 className="text-2xl font-bold">
              {Math.round(weather?.main.temp ?? 0)}
            </h1>
            <h2 className="text-2xl font-bold">{weather?.name}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
