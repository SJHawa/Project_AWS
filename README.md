# Plan System

생성형 AI의 도움을 받아 React로 구현한 웹 기반 플랜 관리 시스템입니다.  
사용자는 해야 할 일을 등록하고, 진행 상태를 `계획`, `진행 중`, `완료` 단계로 나누어 관리할 수 있습니다. 또한 GitHub Actions와 AWS S3를 활용해 CI/CD 환경을 구성하여 코드 변경 시 배포가 가능하도록 설정했습니다.

## 1. 시스템 소개

`Plan System`은 개인 일정과 작업 계획을 한눈에 정리하고 관리할 수 있도록 만든 React 웹 애플리케이션입니다.  
간단한 입력만으로 새로운 플랜을 추가할 수 있으며, 검색과 상태 필터를 이용해 원하는 항목만 빠르게 확인할 수 있습니다.

이 프로젝트는 단순한 화면 구현을 넘어, GitHub 저장소와 GitHub Actions를 이용한 자동 배포 흐름까지 포함하여 CI/CD 실습 과제를 목적으로 제작되었습니다.

## 2. 주요 기능 소개

- 플랜 추가
  - 제목과 메모를 입력해 새로운 계획을 생성할 수 있습니다.
- 상태별 플랜 관리
  - 플랜을 `계획`, `진행 중`, `완료` 상태로 이동할 수 있습니다.
- 플랜 검색
  - 제목 또는 메모 내용을 기준으로 원하는 플랜을 검색할 수 있습니다.
- 상태 필터링
  - 특정 상태의 플랜만 따로 확인할 수 있습니다.
- 플랜 삭제
  - 완료되었거나 더 이상 필요 없는 플랜을 제거할 수 있습니다.
- 통계 확인
  - 각 상태별 플랜 개수를 카드 형태로 확인할 수 있습니다.
- 반응형 UI
  - 데스크톱과 모바일 환경 모두에서 확인 가능한 레이아웃으로 구성했습니다.

## 3. 기술 스택

- Frontend: React 18, React DOM, React Scripts
- Styling: CSS3
- CI/CD: GitHub Actions
- Deployment: AWS S3
- Package Manager: npm

## 4. 프로젝트 구조

```text
Project_AWS/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .github/
│   └── workflows/
│       └── deploy-s3.yml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 5. 실행 방법

프로젝트 루트 폴더에서 아래 명령어를 실행합니다.

```bash
npm install
npm start
```

빌드가 필요한 경우에는 아래 명령어를 사용합니다.

```bash
npm run build
```

## 6. GitHub Actions 기반 CI/CD 환경 소개

이 프로젝트는 GitHub Actions를 활용하여 React 애플리케이션을 자동으로 빌드하고 AWS S3에 배포하도록 구성했습니다.

### 동작 방식

1. GitHub 저장소의 `main` 브랜치에 코드를 push합니다.
2. GitHub Actions 워크플로가 자동으로 실행됩니다.
3. `npm install`로 의존성을 설치합니다.
4. `npm run build`로 React 프로젝트를 빌드합니다.
5. 생성된 `build` 폴더를 AWS S3 버킷에 업로드합니다.

### 사용한 워크플로 파일

- [`.github/workflows/deploy-s3.yml`](/Users/simjeonghwa/Documents/GitHub/Project_AWS/.github/workflows/deploy-s3.yml)

### GitHub Secrets 설정 항목

GitHub Actions에서 AWS에 안전하게 접근하기 위해 아래 값을 Repository Secrets에 등록해야 합니다.

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `AWS_REGION`
- `AWS_S3_BUCKET`

### AWS Academy 환경 참고

AWS Academy에서 발급받은 자격 증명은 세션 기반으로 동작하므로 일정 시간이 지나면 만료될 수 있습니다.  
과제 안내 기준으로 AWS URL은 세션 4시간 동안만 유효할 수 있으므로, 시연 직전에 다시 확인하는 것이 좋습니다.

## 7. AWS 배포 URL

아래 항목은 실제 배포 후 최종 URL로 교체해 주세요.

- AWS S3 배포 URL: `여기에 AWS 배포 URL 입력`

참고:
현재 워크플로는 S3 버킷으로 정적 파일을 업로드하도록 구성되어 있습니다.  
정적 웹사이트 호스팅이 활성화되어 있다면 해당 S3 웹사이트 엔드포인트 주소를 사용하면 됩니다.

## 8. GitHub Actions 활용 CI/CD 시연 영상

아래 항목은 업로드한 영상 링크로 교체해 주세요.

- YouTube 시연 영상 링크: `여기에 YouTube 링크 입력`

## 9. 기대 효과

이 프로젝트를 통해 React 기반 프론트엔드 구현, GitHub 저장소 관리, GitHub Actions를 활용한 자동 배포, AWS S3를 이용한 정적 웹 호스팅 과정을 한 번에 실습할 수 있었습니다.

특히 생성형 AI를 활용해 코드 작성과 배포 설정을 보조받음으로써, 개발 생산성을 높이고 CI/CD의 전체 흐름을 빠르게 이해할 수 있었습니다.
