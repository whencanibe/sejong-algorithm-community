import React from "react";

const StarField = () => {
  const stars = Array.from({ length: 30 }, (_, index) => {
    const top = Math.floor(Math.random() * 1000);   // 0~1199 px
    const left = Math.floor(Math.random() * 1400);  // 0~1599 px
    const width = Math.floor(Math.random() * 10) + 15; // 20~29 px

    return (
      <img
        key={index}
        src="/public/배경/star1.png"
        className="twinkle"
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          zIndex: 0,
        }}
        alt="star"
      />
    );
  });

  return <>{stars}</>;
};



export default StarField;
