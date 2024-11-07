"use client";
import Clock from "./Clock";
import { Lanyard } from "./Lanyard";
import Buttons from "./Buttons";
import Prices from "./Prices";

const Home = () => {
  return (
    <div className="flex flex-row gap-2 w-full justify-center items-center h-full">
      <Prices />
      <div className="flex flex-col w-full">
      <Clock />
      <Lanyard />
      </div>
      <Buttons />
    </div>
  );
};
export default Home;
