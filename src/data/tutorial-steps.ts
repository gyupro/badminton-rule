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
  readonly serveDirection: "diagonal-right" | "diagonal-left";
}

export const PLAYERS: readonly Player[] = [
  { id: "a1", name: "당근", emoji: "🥕", team: "A" },
  { id: "a2", name: "비트", emoji: "🫒", team: "A" },
  { id: "b1", name: "무우", emoji: "🥬", team: "B" },
  { id: "b2", name: "양파", emoji: "🧅", team: "B" },
] as const;

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    step: 1,
    title: "경기 시작 (0:0)",
    scoreA: 0,
    scoreB: 0,
    description:
      "경기는 0점에서 시작합니다. 0은 '짝수'이므로, 우리 팀(A)의 오른쪽 코트에서 대각선 방향으로 서브를 넣습니다.",
    tip: "💡 서브할 때 라켓 헤드는 허리(배꼽) 아래여야 해요!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "a1",
    serveDirection: "diagonal-right",
  },
  {
    step: 2,
    title: "A팀 득점! (1:0)",
    scoreA: 1,
    scoreB: 0,
    description:
      "득점! 점수가 1점(홀수)이 되었습니다. 서브권을 가진 A팀만 자리를 바꿉니다(Change). 당근님은 이제 왼쪽(홀수)에서 서브합니다.",
    tip: "💡 서브 넣을 때 라인을 밟으면 안 돼요!",
    positions: [
      { playerId: "a1", side: "left", courtHalf: "bottom" },
      { playerId: "a2", side: "right", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "a1",
    serveDirection: "diagonal-left",
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
    serveDirection: "diagonal-right",
  },
  {
    step: 4,
    title: "B팀 득점 & 서브권 이동 (2:1)",
    scoreA: 2,
    scoreB: 1,
    description:
      "B팀 득점! 서브권이 넘어갑니다(Service Over). 이때는 아무도 자리를 바꾸지 않습니다! B팀 점수가 1점(홀수)이므로, 현재 홀수 자리에 서 있는 무우님이 서브합니다.",
    tip: "💡 중요! 서브권을 뺏어올 때는 자리를 바꾸지 않아요.",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "right", courtHalf: "top" },
      { playerId: "b2", side: "left", courtHalf: "top" },
    ],
    serverId: "b1",
    serveDirection: "diagonal-left",
  },
  {
    step: 5,
    title: "B팀 연속 득점 (2:2)",
    scoreA: 2,
    scoreB: 2,
    description:
      "B팀이 또 점수를 냈습니다. 2점(짝수)이 되었으니 B팀 선수들끼리 자리를 바꿉니다. 무우님이 짝수 코트(오른쪽)로 이동해 서브합니다.",
    tip: "💡 20:20 듀스 상황에서는 2점을 연속으로 먼저 내는 팀이 승리해요!",
    positions: [
      { playerId: "a1", side: "right", courtHalf: "bottom" },
      { playerId: "a2", side: "left", courtHalf: "bottom" },
      { playerId: "b1", side: "left", courtHalf: "top" },
      { playerId: "b2", side: "right", courtHalf: "top" },
    ],
    serverId: "b1",
    serveDirection: "diagonal-right",
  },
] as const;

export const QUIZ_QUESTIONS = [
  {
    question: "서브할 때 라켓 헤드의 위치는?",
    options: ["머리 위", "허리(배꼽) 아래", "무릎 아래", "어깨 높이"],
    answer: 1,
  },
  {
    question: "서브권이 상대에게 넘어갈 때 자리를 바꿔야 할까요?",
    options: ["양 팀 모두 바꾼다", "서브권 받은 팀만 바꾼다", "아무도 바꾸지 않는다", "서브권 잃은 팀만 바꾼다"],
    answer: 2,
  },
  {
    question: "점수가 짝수일 때 서브하는 위치는?",
    options: ["왼쪽 코트", "오른쪽 코트", "아무 곳이나", "가운데"],
    answer: 1,
  },
  {
    question: "21점 경기에서 20:20이 되면?",
    options: ["바로 연장전", "2점 차이 날 때까지 계속", "서든데스", "재경기"],
    answer: 1,
  },
  {
    question: "복식에서 득점하면 누가 자리를 바꾸나요?",
    options: ["양 팀 모두", "서브권을 가진 팀만", "서브 넣은 사람만", "아무도 안 바꿈"],
    answer: 1,
  },
] as const;
