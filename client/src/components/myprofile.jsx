import React from "react";

// MyProfile 컴포넌트 - 프로필 카드
export default function MyProfile({ nickname, department, imgUrl }) {

  // 이미지가 없을 경우를 대비해 Dicebear의 랜덤 아바타 URL을 기본값으로 설정
  const defaultImg = `https://api.dicebear.com/9.x/bottts/svg?seed=Felix`;
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
      {/* 프로필 이미지 */}
      <img
        src={imgUrl}                         
        alt="내 프로필 이미지"
        style={{
          width: "150px",                  
          height: "150px",
          borderRadius: "50%",             
          marginBottom: "16px",             
          backgroundColor: "#1a1e2a", 
          border: '1px solid #ccc',        
        }}
      />

      {/* 닉네임 표시 */}
      <h3 style={{ fontSize: "20px", color: "#afefff", marginBottom: "8px" }}>
        닉네임: {nickname}
      </h3>

      {/* 학과 표시 */}
      <p style={{ fontSize: "14px", color: "#afefff" }}>
        학과: {department}
      </p>
    </div>
  );
}
