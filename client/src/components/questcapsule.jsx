import React, { useRef, useEffect, useState } from "react";

// Daily Quest 문제 캡슐과 연결된 문제 박스 컴포넌트
export default function QuestCapsule({ problem }) {
  const boxRef = useRef(null);                // 문제 박스 위치 참조
  const [lines, setLines] = useState(null);   // 캡슐과 박스를 잇는 선 좌표

  if (!problem) return null; // 문제 정보 없으면 아무것도 렌더링하지 않음

  // 윈도우 최초 렌더링 시 선 위치 계산
  useEffect(() => {
    const capsuleX = 160;   // 캡슐 중심 X좌표
    const capsuleY1 = 110;  // 위쪽 선 시작 Y좌표
    const capsuleY2 = 160;  // 아래쪽 선 시작 Y좌표

    const updateLines = () => {
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect();
        const parent = boxRef.current.offsetParent.getBoundingClientRect();

        // 박스의 부모 요소 기준 위치
        const offsetX = rect.left - parent.left;
        const offsetY = rect.top - parent.top;

        // 박스 내부 여백 고려한 선의 끝점 좌표 계산
        const paddingX = 25;
        const paddingY = 10;

        const boxInnerTopLeft = {
          x: offsetX + paddingX,
          y: offsetY + paddingY + 60,
        };
        const boxInnerBottomLeft = {
          x: offsetX + paddingX,
          y: offsetY + rect.height - paddingY + 50,
        };

        // 선의 두 좌표 상태로 저장
        setLines({
          line1: {
            x1: capsuleX,
            y1: capsuleY1,
            x2: boxInnerTopLeft.x,
            y2: boxInnerTopLeft.y,
          },
          line2: {
            x1: capsuleX,
            y1: capsuleY2,
            x2: boxInnerBottomLeft.x,
            y2: boxInnerBottomLeft.y,
          },
        });
      }
    };

    updateLines();
    window.addEventListener("resize", updateLines); // 창 크기 바뀔 때 선 재계산
    return () => window.removeEventListener("resize", updateLines);
  }, []);

  return (
    <div
      style={{
        height: "250px",
        width: "500px",
        padding: "24px 32px",
        marginTop: "50px",
        display: "flex",
        alignItems: "center",
        gap: "40px",
        backgroundColor: "#1a1e2a",
        border: "2px solid #00e5ff",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 229, 255, 0.25)",
        position: "relative",
        boxSizing: "border-box",
        color: "#e0f7fa",
         zIndex: 10,
        position: 'relative' ,
      }}
    >
      {/*  캡슐 이미지 + 문제 박스 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* 좌측 캡슐 이미지 */}
        <img src="/캡슐.png" alt="캡슐" style={{ width: "160px" }} />

        {/* 우측 문제 박스 */}
        <div
          ref={boxRef}
          style={{
            backgroundColor: "white",
            border: "2px solid #00e5ff",
            borderRadius: "14px",
            boxShadow: "0 0 10px #00e5ff",
            padding: "20px 24px",
            width: "190px",
            minHeight: "110px",
            lineHeight: "1.6",
            letterSpacing: "0.3px",
          }}
        >
          {/* 문제 번호 */}
          <p
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              color: "#3a4eff",
              fontWeight: "600",
            }}
          >
            📄 {problem.problemId}번
          </p>

          {/* 문제 제목 */}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1b1bd1",
              margin: 0,
            }}
          >
            {problem.title}
          </h3>
        </div>
      </div>

      {/*  SVG로 선 그리기 */}
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
            stroke="#afefff"
            strokeWidth="2"
          />
          <line
            x1={lines.line2.x1}
            y1={lines.line2.y1}
            x2={lines.line2.x2}
            y2={lines.line2.y2}
            stroke="#afefff"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
}
