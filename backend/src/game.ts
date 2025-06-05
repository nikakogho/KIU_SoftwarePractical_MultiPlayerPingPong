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

export class Game {
  readonly width: number;
  readonly height: number;
  readonly paddleWidth = 20;
  readonly ballSpeedY = 2;
  readonly maxBallSpeedX = 3;

  private ball: Ball;
  private paddles: { top: Paddle; bottom: Paddle };
  private score: Score;

  constructor(width = 100, height = 100) {
    this.width = width;
    this.height = height;
    this.paddles = { top: { x: width / 2 }, bottom: { x: width / 2 } };
    this.score = { top: 0, bottom: 0 };
    this.ball = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: this.ballSpeedY,
    };
  }

  getState(): GameState {
    return {
      ball: { ...this.ball },
      paddles: { top: { ...this.paddles.top }, bottom: { ...this.paddles.bottom } },
      score: { ...this.score },
    };
  }

  movePaddle(player: 'top' | 'bottom', x: number) {
    const half = this.paddleWidth / 2;
    const clamped = Math.max(half, Math.min(this.width - half, x));
    this.paddles[player].x = clamped;
  }

  step() {
    const ball = this.ball;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // bounce off side walls
    if (ball.x <= 0) {
      ball.x = 0;
      ball.vx *= -1;
    } else if (ball.x >= this.width) {
      ball.x = this.width;
      ball.vx *= -1;
    }

    // check bottom paddle
    if (ball.vy > 0 && ball.y >= this.height) {
      if (Math.abs(ball.x - this.paddles.bottom.x) <= this.paddleWidth / 2) {
        ball.y = this.height;
        ball.vy = -this.ballSpeedY;
        const offset = (ball.x - this.paddles.bottom.x) / (this.paddleWidth / 2);
        ball.vx = offset * this.maxBallSpeedX;
      } else {
        this.score.top += 1;
        this.resetBall(-this.ballSpeedY);
        return;
      }
    }

    // check top paddle
    if (ball.vy < 0 && ball.y <= 0) {
      if (Math.abs(ball.x - this.paddles.top.x) <= this.paddleWidth / 2) {
        ball.y = 0;
        ball.vy = this.ballSpeedY;
        const offset = (ball.x - this.paddles.top.x) / (this.paddleWidth / 2);
        ball.vx = offset * this.maxBallSpeedX;
      } else {
        this.score.bottom += 1;
        this.resetBall(this.ballSpeedY);
        return;
      }
    }
  }

  private resetBall(vy: number) {
    this.ball = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 0,
      vy,
    };
  }

  isOver(): boolean {
    return this.score.top >= 7 || this.score.bottom >= 7;
  }

  getWinner(): 'top' | 'bottom' | null {
    if (this.score.top >= 7) return 'top';
    if (this.score.bottom >= 7) return 'bottom';
    return null;
  }
}
