import React, { useRef, useEffect, useState } from "react";

export default function QuestCapsule({ problem }) {
  const boxRef = useRef(null);
  const [lines, setLines] = useState(null);

  if (!problem) return null;

  useEffect(() => {
    const capsuleX = 160;
    const capsuleY1 = 110;
    const capsuleY2 = 160;

    const updateLines = () => {
  if (boxRef.current) {
    const rect = boxRef.current.getBoundingClientRect();
    const parent = boxRef.current.offsetParent.getBoundingClientRect();

    const offsetX = rect.left - parent.left;
    const offsetY = rect.top - parent.top;

    const paddingX = 25;
    const paddingY = 10;

    const boxInnerTopLeft = { x: offsetX + paddingX, y: offsetY + paddingY+60 };
    const boxInnerBottomLeft = { x: offsetX + paddingX, y: offsetY + rect.height - paddingY + 50 };

    setLines({
      line1: { x1: capsuleX, y1: capsuleY1, x2: boxInnerTopLeft.x, y2: boxInnerTopLeft.y },
      line2: { x1: capsuleX, y1: capsuleY2, x2: boxInnerBottomLeft.x, y2: boxInnerBottomLeft.y },
    });
  }
};



    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, []);

  return (
    <div
      style={{
        height: "250px",
       border: "1px solid #00e5ff",  
        borderRadius: "10px",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        backgroundColor: "#2a3142",   
        marginTop:"50px",
        width: "500px",
        boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
        boxSizing: "border-box",
        position: "relative",
        color: "#e0f7fa",      
      }}
    >
      {/* 캡슐 + 박스 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img src="/캡슐.png" alt="캡슐" style={{ width: "160px" }} />

        <div
  ref={boxRef}
  style={{
    backgroundColor: "white",
    border: "1px solid #d0d0d0",           
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)", 
    padding: "20px 24px",
    width: "190px",
    minHeight: "110px",
    
    lineHeight: "1.6",
    letterSpacing: "0.3px",
  }}
>
  <p style={{ fontSize: "14px", marginBottom: "6px" }}>📄 {problem.problemId}번</p>
  <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#3f3fff", margin: 0 }}>
    {problem.title}
  </h3>
</div>

      </div>

      {/* CCS 작업업*/}
      {lines && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: "none",
            
          }}
        >
          <line
            x1={lines.line1.x1}
            y1={lines.line1.y1}
            x2={lines.line1.x2}
            y2={lines.line1.y2}
            stroke="#ffffff"
            strokeWidth="2"
          />
          <line
            x1={lines.line2.x1}
            y1={lines.line2.y1}
            x2={lines.line2.x2}
            y2={lines.line2.y2}
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
}
