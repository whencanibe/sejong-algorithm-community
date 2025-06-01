import React from "react";

export default function MyProfile({ nickname, department, imgUrl }) {
  const defaultImg = `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`;
  const profileImg = imgUrl ? imgUrl : defaultImg;
  return (
    <div
      style={{
        height: "300px",
        border: "1px solid #00e5ff",
        padding: "24px",
        borderRadius: "14px",
        width: "400px",
        backgroundColor: "#2a3142",
        color: "#e0f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)",
      }}
    >
      <img
        src={imgUrl}
        alt="내 프로필 이미지"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          marginBottom: "16px",
          backgroundColor: "white",
        }}
      />
      <h3 style={{ fontSize: "18px", color: "#3f3fff", marginBottom: "8px" }}>
        닉네임: {nickname}
      </h3>
      <p style={{ fontSize: "14px", color: "#3f3fff" }}>
        학과: {department}
      </p>
      
    </div>
  );
}
