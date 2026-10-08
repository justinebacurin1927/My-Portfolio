export type ArcadeGame = 'snake' | 'nightshift' | 'tinycraft'
export const arcadeGames: ArcadeGame[] = ['snake', 'nightshift', 'tinycraft']
export const arcadeTitles: Record<ArcadeGame, string> = {
  snake: 'Snake',
  nightshift: 'Nightshift',
  tinycraft: 'Tinycraft',
}
