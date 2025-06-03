import React from "react";

export default function MyProfile({ nickname, department, imgUrl }) {
  const defaultImg = `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`;
  const profileImg = imgUrl ? imgUrl : defaultImg;
  return (
    <div
      style={{
        height: "300px",
        border: "2px solid #00e5ff",
        padding: "24px",
        borderRadius: "14px",
        width: "400px",
         backgroundColor: "#1a1e2a",
        color: "#e0f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
         boxShadow: "0 0 18px rgba(0, 229, 255, 0.3)",
      }}
    >
      <img
        src={imgUrl}
        alt="내 프로필 이미지"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          marginBottom: "16px",
          backgroundColor: "white",
        }}
      />
      <h3 style={{ fontSize: "20px", color: "#afefff", marginBottom: "8px" }}>
        닉네임: {nickname}
      </h3>
      <p style={{ fontSize: "14px", color: "#afefff" }}>
        학과: {department}
      </p>
      
    </div>
  );
}
