# 세종 알고리즘 커뮤니티

> **사용한 라이브러리** — React(Vite) + Express 5, 패키지 매니저는 **pnpm 워크스페이스**.
>
> macOS / Linux는 **nvm**으로 Node 버전을 관리하고, Windows는 **그냥 Node 22 LTS**를 설치하거나 필요할 때 **nvm‑windows**를 사용합니다.

---

## 📋 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [필수 설치 항목](#필수-설치-항목)
3. [빠른 시작](#빠른-시작)

   * [macOS / Linux(nvm)](#macoslinux-nvm)
   * [Windows(단일 Node 설치)](#windows-단일-node-설치)
   * [Windows(nvm‑windows 선택)](#windows-nvm-windows)
4. [일상 개발 흐름](#일상-개발-흐름)
5. [스크립트 참고](#스크립트-참고)
6. [프로덕션 빌드](#프로덕션-빌드)
7. [문제 해결](#문제-해결)

---

## 프로젝트 구조

```text
algo-community/
├─ .gitignore
├─ pnpm-workspace.yaml       # 워크스페이스 선언
├─ pnpm-lock.yaml
├─ package.json              # 루트 스크립트 / 워크스페이스 목록
├─ jsconfig.json
├─ .nvmrc                    # Node 버전(22) 지정
├─ client/                   # React(Vite)
│  ├─ public/
│  ├─ src/
│  └─ package.json
└─ server/                   # Express 5 API
   ├─ src/
   └─ package.json
```

---

## 필수 설치 항목

| 도구          | 권장 버전      | 설치 방법                                                                                 |
| ----------- | ---------- | ------------------------------------------------------------------------------------- |
| **Node.js** | **22 LTS** | macOS/Linux ▶︎ nvm `nvm install 22`<br>Windows ▶︎ winget `OpenJS.NodeJS.LTS` (22 LTS) |
| **pnpm**    | **10.x**   | `corepack enable && corepack prepare pnpm@latest --activate`                          |

---

## 빠른 시작

### macOS/Linux (nvm) <a id="macoslinux-nvm"></a>

```bash
# 0. nvm 설치 (Homebrew 예시)
brew install nvm
mkdir -p ~/.nvm
# 셸 설정에 아래 두 줄 추가 후 새 터미널 열기
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 1. Node 22 설치 & 사용
nvm install               # .nvmrc 읽어 자동 설치
nvm use                   # 셸에 Node 22 적용

# 2. pnpm 설치(최초 1회)
corepack enable
corepack prepare pnpm@latest --activate
```

### Windows – 단일 Node 설치 <a id="windows-단일-node-설치"></a>

> **Node 버전을 자주 바꿀 필요가 없다**면 이 방법이 가장 간단합니다.

```powershell
# 0. PowerShell(관리자) 실행

# 1. Git
winget install --id Git.Git -e

# 2. Node 22 LTS
winget install --id OpenJS.NodeJS.LTS -e
혹은 
https://nodejs.org/ko 접속하여 v22.15.0 LTS 다운로드

# 3. pnpm 10.x
corepack enable
corepack prepare pnpm@latest --activate

# (새 터미널 열고) 버전 확인
node -v   # v22.*
pnpm -v   # 10.*
```

### Windows – nvm‑windows (선택) <a id="windows-nvm-windows"></a>

```powershell
# 0. nvm-windows 설치 (Chocolatey 예시)
choco install nvm
refreshenv         # 환경변수 갱신

# 1. Node 22 설치 & 사용
nvm install 22
nvm use 22

# 2. pnpm 10.x
corepack enable
corepack prepare pnpm@latest --activate
```

---

## 일상 개발 흐름

```bash
# 1. 저장소 클론
git clone git@github.com:your-org/algo-community.git
cd algo-community

# 2. Node 버전 적용(mac/Linux)
#    Windows 단일 설치 방식은 이 단계 생략
nvm install   # 이미 설치돼 있으면 skip
nvm use

# 3. 의존성 설치(공통)
pnpm install

# 4. 개발 서버 실행(공통)
pnpm dev           # 프런트 5173, 백 4000 동시에 실행
# 또는 개별:
pnpm dev:client    # 프런트만
pnpm dev:server    # 백엔드만
```

---

## 스크립트 참고

| 명령                | 기능                           |
| ----------------- | ---------------------------- |
| `pnpm dev`        | React + Express 동시 실행        |
| `pnpm dev:client` | React만 실행                    |
| `pnpm dev:server` | Express만 실행                  |

---

## 프로덕션 빌드

```bash
# 정적 파일 빌드
pnpm --filter client build   # → client/dist/

```

---

## 문제 해결

| 증상                            | 해결 방법                                               |
| ----------------------------- | --------------------------------------------------- |
| `nvm: command not found`      | nvm 설치 & 쉘 설정 확인                                    |
| `pnpm: command not found`     | `corepack prepare pnpm@latest --activate` 후 터미널 재시작 |
| Node 버전이 24로 표시               | `nvm use 22` 또는 `nvm install 22` 후 다시 확인            |
| `ERR_PNPM_DETACHED`           | `pnpm-workspace.yaml`에 `client`, `server`가 포함됐는지 체크 |
| `address already in use 5173(포트 넘버)` | React dev 서버 중복. 기존 프로세스 종료(lsof/작업 관리자)            |

---
