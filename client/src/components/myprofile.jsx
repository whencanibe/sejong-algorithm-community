import React from "react";

// MyProfile 컴포넌트 - 프로필 카드
export default function MyProfile({ nickname, department, imgUrl }) {

  // 사용자가 사진 업로드를 안 하였을 경우 기본 이미지 제공 
  // 등록한 사진의 상대 경로와 서버 주소를 붙여서 
  const baseUrl = "http://localhost:4000"; 
  const defaultImg = "/기본이미지.png";
  const profileImg = imgUrl?.startsWith("http") ? imgUrl : `${baseUrl}${imgUrl}`;

  return (
    <div
      style={{
        height: "300px",                     
        border: "2px solid #00e5ff",          
        padding: "24px",                     
        borderRadius: "14px",                 
        width: "250px",                       
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
      {/* 프로필 이미지 */}
      <img
        src={profileImg}                         
        alt="내 프로필 이미지"
        style={{
          width: "170px",                  
          height: "170px",
          borderRadius: "50%",             
          marginBottom: "16px",             
          backgroundColor: "#1a1e2a", 
          border: '1px solid #ccc',  
          objectFit: 'cover'      
        }}
      />

      {/* 닉네임 표시 */}
      <h3 style={{ fontSize: "20px", color: "#afefff", marginBottom: "5px" }}>
        닉네임: {nickname}
      </h3>

      {/* 학과 표시 */}
      <p style={{ fontSize: "14px", color: "#afefff" }}>
        학과: {department}
      </p>
    </div>
  );
}
