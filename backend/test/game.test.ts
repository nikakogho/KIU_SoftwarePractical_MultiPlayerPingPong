import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../src/game';

describe('Game physics', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game(100, 100);
  });

  it('moves the ball each step', () => {
    const { ball: before } = game.getState();
    game.step();
    const { ball: after } = game.getState();
    expect(after.y).toBe(before.y + game['ballSpeedY']);
  });

  it('bounces off side walls', () => {
    game.movePaddle('bottom', 50);
    const state = game.getState();
    state.ball.x = 0;
    state.ball.vx = -1;
    (game as any).ball = state.ball;
    game.step();
    expect(game.getState().ball.vx).toBe(1);
  });

  it('bounces off bottom paddle', () => {
    const state = game.getState();
    state.ball.y = game['height'];
    state.ball.vy = game['ballSpeedY'];
    state.ball.x = game.getState().paddles.bottom.x;
    (game as any).ball = state.ball;
    game.step();
    expect(game.getState().ball.vy).toBe(-game['ballSpeedY']);
  });

  it('scores when paddle missed', () => {
    const state = game.getState();
    state.ball.y = game['height'];
    state.ball.vy = game['ballSpeedY'];
    state.ball.x = 0; // far from paddle
    (game as any).ball = state.ball;
    game.step();
    expect(game.getState().score.top).toBe(1);
  });

  it('detects when a player wins', () => {
    for (let i = 0; i < 7; i++) {
      const state = game.getState();
      state.ball.y = game['height'];
      state.ball.vy = game['ballSpeedY'];
      state.ball.x = 0;
      (game as any).ball = state.ball;
      game.step();
    }
    expect(game.isOver()).toBe(true);
    expect(game.getWinner()).toBe('top');
  });
});
