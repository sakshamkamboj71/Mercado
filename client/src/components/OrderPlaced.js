import { ThumbsUp } from "phosphor-react";
import React from "react";

const OrderPlaced = () => {
  return (
    <div className="w-full h-screen bg-[#1f1f1f] p-8 text-white flex flex-col justify-center items-center select-none">
      <h1 className="text-9xl text-[#df94ff] mb-4 text-center border-4 border-[#df94ff] p-12 rounded-full font-light">
        <ThumbsUp />
      </h1>
      <h1 className="text-6xl text-center mb-4 rounded-md p-2 font-semibold tracking-wider">
        ORDER PLACED
      </h1>

      <p className="text-lg text-center mb-8">Thankyou for purchasing.</p>
    </div>
  );
};

export default OrderPlaced;
