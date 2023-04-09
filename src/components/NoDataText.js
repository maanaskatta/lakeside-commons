import React from "react";

export default function NoDataText({ message }) {
  return (
    <div>
      <p className="flex justify-center text-xl">{message}</p>
    </div>
  );
}
