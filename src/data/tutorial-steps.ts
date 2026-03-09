export interface Player {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly team: "A" | "B";
}

export interface Position {
  readonly playerId: string;
  readonly side: "left" | "right";
  readonly courtHalf: "top" | "bottom";
}

export interface TutorialStep {
  readonly step: number;
  readonly title: string;
  readonly scoreA: number;
  readonly scoreB: number;
  readonly description: string;
  readonly tip: string;
  readonly positions: readonly Position[];
  readonly serverId: string;
  readonly isIntro?: boolean;
}

export const PLAYERS: readonly Player[] = [
  { id: "a1", name: "당근", emoji: "🥕", team: "A" },
  { id: "a2", name: "비트", emoji: "🫒", team: "A" },
  { id: "b1", name: "무우", emoji: "🥬", team: "B" },
  { id: "b2", name: "양파", emoji: "🧅", team: "B" },
] as const;

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    step: 0,
    title: "코트 구조 이해하기",
    scoreA: 0,
    scoreB: 0,
    description:
      "배드민턴 복식 코트입니다. 네트를 기준으로 양쪽으로 나뉘고, 각 코트는 중앙선으로 왼쪽(홀수)과 오른쪽(짝수) 서비스 코트로 나뉩니다. 21점 3게임 2선승제로 진행됩니다.",
    tip: "💡 '짝수 점수 = 오른쪽, 홀수 점수 = 왼쪽'만 기억하면 절반은 끝!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "",
    isIntro: true,
  },
  {
    step: 1,
    title: "경기 시작 (0:0)",
    scoreA: 0,
    scoreB: 0,
    description:
      "경기는 0점에서 시작합니다. 0은 '짝수'이므로, 우리 팀(A)의 오른쪽 코트에서 대각선 방향으로 서브를 넣습니다.",
    tip: "💡 서브 시 셔틀콕 접촉 지점이 바닥에서 1.15m 이하여야 해요!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "a1",
  },
  {
    step: 2,
    title: "A팀 득점! (1:0)",
    scoreA: 1,
    scoreB: 0,
    description:
      "득점! 점수가 1점(홀수)이 되었습니다. 서브권을 가진 A팀만 자리를 바꿉니다(Change). 당근님은 이제 왼쪽(홀수)에서 서브합니다.",
    tip: "💡 서브 넣을 때 라인을 밟으면 안 돼요! 양발 모두 바닥에 닿아야 합니다.",
    positions: [
      { playerId: "a1", side: "left", courtHalf: "bottom" },
      { playerId: "a2", side: "right", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "a1",
  },
  {
    step: 3,
    title: "A팀 연속 득점 (2:0)",
    scoreA: 2,
    scoreB: 0,
    description:
      "또 득점! 2점(짝수)이 되어 다시 자리를 바꿉니다. 점수를 딴 팀이 서브권을 계속 유지하며 자리만 바뀝니다.",
    tip: "💡 우리 팀이 점수를 내면, '내 자리'가 바뀐다고 생각하면 쉬워요!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "a1",
  },
  {
    step: 4,
    title: "B팀 득점 & 서브권 이동 (2:1)",
    scoreA: 2,
    scoreB: 1,
    description:
      "B팀 득점! 서브권이 넘어갑니다(Service Over). 이때는 아무도 자리를 바꾸지 않습니다! B팀 점수가 1점(홀수)이므로, 홀수 코트에 있는 무우님이 서브합니다.",
    tip: "💡 중요! 서브권이 넘어올 때는 자리를 바꾸지 않아요. 현재 위치 그대로!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "b1",
  },
  {
    step: 5,
    title: "B팀 연속 득점 (2:2)",
    scoreA: 2,
    scoreB: 2,
    description:
      "B팀이 또 점수를 냈습니다. 2점(짝수)이 되었으니 B팀 선수들끼리 자리를 바꿉니다. 무우님이 짝수 코트(B팀 기준 오른쪽)로 이동해 서브합니다.",
    tip: "💡 기억하세요: 득점한 팀만 자리를 바꾸고, 서브권은 유지됩니다!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "left", courtHalf: "top" },
      { playerId: "b2", side: "right", courtHalf: "top" },
    ],
    serverId: "b1",
  },
  {
    step: 6,
    title: "A팀 서브권 탈환! (3:2)",
    scoreA: 3,
    scoreB: 2,
    description:
      "A팀이 득점하여 서브권을 다시 가져왔습니다. 아무도 자리를 바꾸지 않습니다. A팀 점수가 3(홀수)이므로, 홀수 코트(왼쪽)에 있는 비트님이 서브합니다.",
    tip: "💡 주목! 같은 팀이라도 처음 서브한 사람이 아닌, 점수에 맞는 위치의 선수가 서브해요.",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "left", courtHalf: "top" },
      { playerId: "b2", side: "right", courtHalf: "top" },
    ],
    serverId: "a2",
  },
  {
    step: 7,
    title: "규칙 요약 정리",
    scoreA: 3,
    scoreB: 2,
    description: "",
    tip: "",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "left", courtHalf: "top" },
      { playerId: "b2", side: "right", courtHalf: "top" },
    ],
    serverId: "a2",
    isIntro: true,
  },
] as const;

export const RULE_SUMMARY = [
  { icon: "🏸", title: "서브 위치", desc: "짝수 점수 → 오른쪽, 홀수 점수 → 왼쪽" },
  { icon: "🔄", title: "득점 시", desc: "서브팀이 득점하면 서브팀만 자리 교대" },
  { icon: "🚫", title: "서브오버 시", desc: "서브권이 넘어갈 때는 아무도 자리 안 바꿈" },
  { icon: "👤", title: "누가 서브?", desc: "팀 점수에 맞는 코트에 있는 선수가 서브" },
  { icon: "🏆", title: "승리 조건", desc: "21점 선취, 3게임 2선승 (20:20시 2점차, 최대 30점)" },
  { icon: "↔️", title: "엔드 체인지", desc: "각 게임 종료 후 + 3게임째 11점 도달 시 코트 교대" },
] as const;

export interface QuizQuestion {
  readonly question: string;
  readonly options: readonly string[];
  readonly answer: number;
  readonly explanation: string;
}

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    question: "서브 시 셔틀콕을 치는 높이 제한은?",
    options: ["제한 없음", "바닥에서 1.15m 이하", "무릎 아래", "어깨 높이 이하"],
    answer: 1,
    explanation: "2018년 BWF 규칙 변경 이후, 서브 시 셔틀콕 접촉 지점이 바닥에서 1.15m 이하여야 합니다.",
  },
  {
    question: "서브권이 상대에게 넘어갈 때 자리를 바꿔야 할까요?",
    options: ["양 팀 모두 바꾼다", "서브권 받은 팀만 바꾼다", "아무도 바꾸지 않는다", "서브권 잃은 팀만 바꾼다"],
    answer: 2,
    explanation: "서브권이 넘어갈 때(서비스 오버)는 아무도 자리를 바꾸지 않습니다. 현재 위치 그대로 유지!",
  },
  {
    question: "점수가 짝수일 때 서브하는 위치는?",
    options: ["왼쪽 코트", "오른쪽 코트", "아무 곳이나", "가운데"],
    answer: 1,
    explanation: "짝수 점수일 때는 오른쪽 서비스 코트에서, 홀수 점수일 때는 왼쪽 서비스 코트에서 서브합니다.",
  },
  {
    question: "21점 경기에서 20:20이 되면?",
    options: ["바로 연장전", "2점 차이 날 때까지 (최대 30점)", "서든데스", "재경기"],
    answer: 1,
    explanation: "20:20 듀스 시 2점 차이가 날 때까지 계속합니다. 단, 29:29가 되면 30점을 먼저 내는 팀이 승리합니다.",
  },
  {
    question: "복식에서 득점하면 누가 자리를 바꾸나요?",
    options: ["양 팀 모두", "서브권을 가진 팀만", "서브 넣은 사람만", "아무도 안 바꿈"],
    answer: 1,
    explanation: "득점한 서브팀만 두 선수가 자리를 바꿉니다. 상대팀은 자리를 유지합니다.",
  },
  {
    question: "배드민턴 정식 경기는 몇 게임제인가요?",
    options: ["1게임제", "3게임 2선승제", "5게임 3선승제", "2게임제"],
    answer: 1,
    explanation: "배드민턴은 21점 3게임 2선승제입니다. 먼저 2게임을 이기는 팀이 승리합니다.",
  },
  {
    question: "29:29 상황에서는 어떻게 되나요?",
    options: ["2점 차이 날 때까지 계속", "30점을 먼저 내는 팀이 승리", "재경기", "가위바위보로 결정"],
    answer: 1,
    explanation: "29:29에서는 30점 캡 규칙이 적용되어, 30점을 먼저 득점하는 팀이 해당 게임을 승리합니다.",
  },
  {
    question: "서브권이 넘어왔을 때, 누가 서브하나요?",
    options: ["아무나 서브 가능", "직전에 서브한 사람", "팀 점수에 맞는 코트에 있는 선수", "항상 1번 선수"],
    answer: 2,
    explanation: "서브권을 받으면 현재 팀 점수가 짝수/홀수인지에 따라, 해당 서비스 코트에 서 있는 선수가 서브합니다.",
  },
] as const;
