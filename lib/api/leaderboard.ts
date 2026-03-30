import { apiClient } from "./client"

export interface LeaderboardUser {
  id: number
  username: string
  score: number
  last_solved_at: string | null
  created_at: string
}

export interface LeaderboardResponse {
  users: LeaderboardUser[]
  total: number
}

interface RawLeaderboardUser {
  id?: number
  username?: string
  score?: number
  last_solved_at?: string | null
  created_at?: string
  ID?: number
  Username?: string
  Score?: number
  LastSolvedAt?: string | null
  CreatedAt?: string
}

interface RawLeaderboardResponse {
  users: RawLeaderboardUser[]
  total?: number
}

export async function getLeaderboard() {
  const { data } = await apiClient.get<RawLeaderboardResponse>("/user/leaderboard")

  return {
    total: data.total ?? data.users.length,
    users: data.users.map((user) => ({
      id: user.id ?? user.ID ?? 0,
      username: user.username ?? user.Username ?? "",
      score: user.score ?? user.Score ?? 0,
      last_solved_at: user.last_solved_at ?? user.LastSolvedAt ?? null,
      created_at: user.created_at ?? user.CreatedAt ?? "",
    })),
  } satisfies LeaderboardResponse
}
