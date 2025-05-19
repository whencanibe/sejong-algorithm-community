import React from "react";

export default function MyProfile({ nickname, info, avatarSeed }) {
  return (
    <div
      style={{
        height: "250px",
        border: "2px solid #3f3fff",
        padding: "24px",
        borderRadius: "14px",
        width: "400px",
        backgroundColor: "#f0f4ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)",
      }}
    >
      <img
        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`}
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
      <p style={{ fontSize: "14px", color: "#333" }}>{info}</p>
    </div>
  );
}