import type { Score } from '../types'

export function ScoreBoard({ score }: { score: Score }) {
  return (
    <div className="score-board" data-testid="scoreboard">
      {score.top} - {score.bottom}
    </div>
  )
}
