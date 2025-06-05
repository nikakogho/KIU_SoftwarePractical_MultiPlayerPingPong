export interface Paddle {
  x: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Score {
  top: number;
  bottom: number;
}

export interface GameState {
  ball: Ball;
  paddles: { top: Paddle; bottom: Paddle };
  score: Score;
}
