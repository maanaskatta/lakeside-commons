import React, { useState } from "react";
import { AiOutlineLoading3Quarters, AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { toast } from "react-toastify";
import ASSLogo from "../images/LakeSide Logo.png";
import ASS from "../images/ASS.jpg";

const slideImages = [
  ASS,
  "https://aliensspacestation.files.wordpress.com/2014/11/frzzdw.png",
  "https://im.proptiger.com/1/503655/80/space-station-township-others-19466154.jpeg",
];

export default function LoginPage({ setCurrentRole }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const imageSliderProperties = {
    duration: 1000,
    autoplay: true,
    transitionDuration: 500,
    arrows: false,
    infinite: true,
    easing: "cubic",
  };

  const handleLogin = () => {
    console.log(userName, password);
    if (userName === "admin" && password === "admin") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentRole("manager");
        localStorage.setItem("role", "manager");
        history.push("/manager");
      }, 2000);
    } else {
      toast.error("Invalid login credentials");
      setUserName(null);
      setPassword(null);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="bg-gray-700 flex">
      <div className="w-2/3">
        <Slide {...imageSliderProperties}>
          {slideImages.map((slideImage, index) => (
            <div className="each-slide" key={index}>
              <img src={slideImage} alt="" className="h-screen w-full" />
            </div>
          ))}
        </Slide>
      </div>
      <div
        className="w-1/3"
        style={{
          backgroundColor: "white",
        }}
      >
        <div className="p-5 flex flex-col justify-between h-screen">
          <div className="flex flex-col gap-10 justify-center">
            <div>
              <img src={ASSLogo} alt="" width={400} />
            </div>
            <div className="bg-gray-700 flex flex-col gap-5 rounded-lg p-5">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <AiOutlineUser className="text-white text-xl" />
                  <p className="text-white">Username</p>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 focus:outline-none"
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <RiLockPasswordLine className="text-white text-xl" />
                  <p className="text-white">Password</p>
                </div>
                <input
                  type="password"
                  className="w-full px-3 py-2 focus:outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  onKeyPress={handleEnterKeyPress}
                />
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-blue-600 text-lg text-white cursor-pointer px-10 py-2 rounded"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <AiOutlineLoading3Quarters className=" animate-spin text-xl" />
                  ) : (
                    "SUBMIT"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
