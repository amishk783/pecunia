import { CircleX } from "lucide-react";

import { useState } from "react";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/custom-bg/bg2.jpg";
import bg3 from "../assets/custom-bg/bg3.png";
import bg4 from "../assets/custom-bg/bg4.jpg";
import bg5 from "../assets/custom-bg/bg5.png";
import cross from "../assets/custom-bg/cross.png";

interface CustomThemePickerProps {
  handleOpen: () => void;
}

const CustomThemePicker: React.FC<CustomThemePickerProps> = ({
  handleOpen,
}) => {
  const [isPrimaryColor, setPrimary] = useState<string>("");
  console.log("🚀 ~ isPrimaryColor:", isPrimaryColor);
  const [isSecondaryColor, setSecondary] = useState<string>("");
  console.log("🚀 ~ setSecondary:", setSecondary);
  console.log("🚀 ~ isSecondaryColor:", isSecondaryColor);

  const handleColor = (
    primaryColor?: string,
    secondaryColor?: string,
    pattern?: string
  ) => {
    console.log("🚀 ~ pattern:", pattern);
    if (!primaryColor) return;
    document.documentElement.style.setProperty(
      "--background-primary",
      primaryColor
    );
    if (!secondaryColor) return;
    document.documentElement.style.setProperty(
      "--background-secondary",
      secondaryColor
    );
    setPrimary(primaryColor);
  };
  const handleAttr = (pattern: string) => {
    document.documentElement.setAttribute("data-attr", pattern);
  };
  console.log("🚀 ~ handleAttr ~ handleAttr:", handleAttr);
  const handleImageClick = (image: string) => {
    console.log(image);

    document.documentElement.style.setProperty(
      "--background-image",
      `url(${image})`
    );
  };
  return (
    <div className=" absolute flex flex-col w-[17%] bg-theme-secondary text-theme-themeText right-0 px-2 border-l-3 h-full ">
      <div className="flex justify-end items-end pt-3 ">
        <CircleX size={32} className="" onClick={handleOpen} />
      </div>
      <div className="px-2 ">
        <div>
          <h2 className="text-xl ">Customize Your Theme </h2>
          <h3 className="text-lg px-1 ">Try it </h3>
        </div>

        <div className="flex flex-col pt-8 gap-2">
          <p className="text-xl">Color</p>
          <div className="flex gap-2">
            <ul className="flex gap-4">
              <li
                className="p-4 bg-[#7A70BA] border-2 border-zinc-300 rounded-lg"
                onClick={() => handleColor("#7A70BA", "#48A3D7")}
              ></li>
              <li
                className="p-4 bg-[#88967e] border-2 border-zinc-300 rounded-lg"
                onClick={() => handleColor("#88967e", "#29353a")}
              ></li>
              <li
                className="p-4 bg-[#c6164f]  border-2 border-zinc-300 rounded-lg"
                onClick={() => handleColor("#c6164f", "#372363")}
              ></li>
              <li
                className="p-4 bg-[#4b232d] border-2 border-zinc-300 rounded-lg"
                onClick={() => handleColor("#4b232d", "#8e6343")}
              ></li>
              <li
                className="p-4 bg-[#56409f] border-2 border-zinc-300 rounded-lg"
                onClick={() => handleColor("#56409f", "#21637f")}
              ></li>
            </ul>
          </div>
          <div className="flex flex-col pt-8 gap-2">
            <h1 className="text-xl text-hello ">Choose Custom background</h1>
            <div className="">
              <ul className="flex flex-wrap gap-4">
                <li className="w-16 h-10 border-2 border-zinc-300 rounded-lg">
                  <img
                    className="rounded-lg"
                    src={bg1}
                    onClick={() => handleImageClick(bg1)}
                  />
                </li>

                <li className="w-16 h-10 border-2 border-zinc-300 rounded-lg">
                  <img
                    className="rounded-lg"
                    src={bg2}
                    onClick={() => handleImageClick(bg2)}
                  />
                </li>
                <li className="w-16 h-10 border-2 border-zinc-300 rounded-lg">
                  <img
                    className="rounded-lg"
                    src={bg3}
                    onClick={() => handleImageClick(bg3)}
                  />
                </li>
                <li className="w-16 h-10 border-2 border-zinc-300 rounded-lg">
                  <img
                    className="rounded-lg"
                    src={bg4}
                    onClick={() => handleImageClick(bg4)}
                  />
                </li>
                <li className="w-16 h-10 border-2 border-zinc-300 rounded-lg">
                  <img
                    className="rounded-lg"
                    src={bg5}
                    onClick={() => handleImageClick(bg5)}
                  />
                </li>
                <li className="w-16 h-10 bg-zinc-200 border-2 border-zinc-300 rounded-lg">
                  <img
                    className="rounded-lg w-16 h-10"
                    src={cross}
                    onClick={() => handleImageClick("")}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col pt-4 ">
            <p className="text-xl">Choose Fonts</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomThemePicker;
