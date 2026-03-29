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
  current_page: number
  total_pages: number
  total_users: number
  limit: number
}

export async function getLeaderboard(page = 1, limit = 10) {
  const { data } = await apiClient.get<LeaderboardResponse>(
    "/user/leaderboard",
    {
      params: { page, limit },
    }
  )
  return data
}
