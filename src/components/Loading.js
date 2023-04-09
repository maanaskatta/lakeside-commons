import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
  return (
    <div className="flex justify-center items-center gap-2">
      <AiOutlineLoading3Quarters className=" text-2xl animate-spin" />
      <p className="text-2xl">Loading...</p>
    </div>
  );
}
