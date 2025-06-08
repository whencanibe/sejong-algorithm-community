import React from "react";

// 배경에 반짝이는 별들을 무작위로 배치하는 컴포넌트
const StarField = () => {
  const stars = Array.from({ length: 30 }, (_, index) => {
    const top = Math.floor(Math.random() * 1000);   // 0~1000 px
    const left = Math.floor(Math.random() * 1400);  // 0~1400 px
    const width = Math.floor(Math.random() * 10) + 15;

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
