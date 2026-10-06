import { INITIAL_STATE, playRally, type MatchState, type Team } from "../lib/rules.ts";

export interface TutorialStepContent {
  readonly kind: "intro" | "play" | "summary";
  /** Rally winner leading into this step (positions are computed by the rules engine). */
  readonly winner?: Team;
  readonly title: string;
  readonly description: string;
  readonly tip?: string;
}

export interface TutorialStep extends TutorialStepContent {
  readonly state: MatchState;
  /** Whether to highlight server/receiver on the court. */
  readonly showServe: boolean;
}

const STEP_CONTENT: readonly TutorialStepContent[] = [
  {
    kind: "intro",
    title: "코트 구조 이해하기",
    description:
      "네트를 사이에 두고 양 팀이 마주 봅니다. 각 코트는 중앙선으로 오른쪽(짝수)·왼쪽(홀수) 서비스 코트로 나뉘어요. 좌우는 '네트를 바라보는 내 기준'이라 상대 팀은 화면에서 위아래가 반대예요.",
    tip: "'짝수 점수 = 오른쪽, 홀수 점수 = 왼쪽'만 기억하면 절반은 끝!",
  },
  {
    kind: "play",
    title: "경기 시작 (0:0)",
    description:
      "0은 짝수이므로, A팀 오른쪽 코트의 당근님이 서브합니다. 서브는 대각선으로! B팀 오른쪽 코트의 양파님이 받습니다(리시브).",
    tip: "서브 시 셔틀콕을 치는 순간, 셔틀 전체가 바닥에서 1.15m 아래에 있어야 해요.",
  },
  {
    kind: "play",
    winner: "A",
    title: "A팀 득점!",
    description:
      "서브팀(A)이 득점하면 서브팀 두 선수만 자리를 바꿉니다. 1점(홀수)이 되었으니 당근님이 왼쪽(홀수) 코트로 옮겨 계속 서브해요.",
    tip: "서브할 때 양발이 라인을 밟으면 안 되고, 셔틀을 칠 때까지 바닥에서 떨어지면 안 돼요.",
  },
  {
    kind: "play",
    winner: "A",
    title: "A팀 연속 득점",
    description:
      "또 득점! 2점(짝수)이 되어 A팀이 다시 자리를 바꾸고, 당근님이 오른쪽에서 서브합니다. 상대팀(B)은 그대로예요.",
    tip: "'우리 서브 중에 점수를 내면, 우리 둘만 자리를 바꾼다'로 기억하세요.",
  },
  {
    kind: "play",
    winner: "B",
    title: "B팀 득점 → 서비스 오버",
    description:
      "리시브팀(B)이 득점하면 서브권이 넘어갑니다. 이때는 아무도 자리를 바꾸지 않아요! B팀이 1점(홀수)이므로, B팀 왼쪽 코트에 서 있던 배추님이 서브합니다.",
    tip: "가장 많이 틀리는 부분! 서브권이 넘어올 때는 현재 위치 그대로 서브해요.",
  },
  {
    kind: "play",
    winner: "B",
    title: "B팀 연속 득점",
    description:
      "이제 B팀이 서브팀이므로, 득점하면 B팀끼리 자리를 바꿉니다. 2점(짝수)이니 배추님이 B팀 오른쪽 코트로 옮겨 서브해요.",
    tip: "득점한 서브팀만 자리를 바꾸고, 같은 선수가 계속 서브합니다.",
  },
  {
    kind: "play",
    winner: "A",
    title: "A팀 서브권 탈환!",
    description:
      "A팀이 득점해 서브권을 되찾았습니다. 자리는 그대로! A팀 점수가 3점(홀수)이므로, 이번엔 왼쪽에 서 있는 가지님이 서브해요.",
    tip: "같은 팀이라도 '직전 서버'가 아니라 '점수에 맞는 코트에 서 있는 선수'가 서브해요.",
  },
  {
    kind: "play",
    winner: "A",
    title: "가지님이 계속 서브",
    description:
      "A팀이 4점(짝수)을 냈어요. A팀이 자리를 바꾸며 가지님이 오른쪽으로 이동해 계속 서브합니다. 서브권을 잃을 때까지 같은 사람이 서브해요.",
    tip: "서버는 득점할 때마다 좌우만 바뀌고, 서브권을 잃을 때까지 바뀌지 않아요.",
  },
  {
    kind: "summary",
    title: "규칙 요약 정리",
    description: "",
  },
];

function buildSteps(): readonly TutorialStep[] {
  let state = INITIAL_STATE;
  return STEP_CONTENT.map((content) => {
    if (content.winner) state = playRally(state, content.winner).state;
    return { ...content, state, showServe: content.kind !== "intro" };
  });
}

export const TUTORIAL_STEPS: readonly TutorialStep[] = buildSteps();

export const RULE_SUMMARY = [
  { icon: "🏸", title: "서브 위치", desc: "짝수 점수 → 오른쪽, 홀수 점수 → 왼쪽" },
  { icon: "🔄", title: "서브팀 득점", desc: "서브팀 두 선수만 자리 교대, 같은 서버 유지" },
  { icon: "🚫", title: "서비스 오버", desc: "서브권이 넘어갈 때는 아무도 자리 안 바꿈" },
  { icon: "👤", title: "누가 서브?", desc: "팀 점수에 맞는 코트에 서 있는 선수" },
  { icon: "🏆", title: "승리 조건", desc: "21점 3게임 2선승 (20:20부터 2점 차, 최대 30점)" },
  { icon: "↔️", title: "엔드 체인지", desc: "매 게임 후 + 3게임째 한 팀이 11점 도달 시" },
] as const;
