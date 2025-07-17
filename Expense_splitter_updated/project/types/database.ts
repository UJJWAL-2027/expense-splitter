export interface Database {
  public: {
    Tables: {
      friends: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url?: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          description: string
          amount: number
          paid_by: string
          participants: string[]
          splits: Record<string, number>
          category: string
          date: string
          notes?: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          paid_by: string
          participants: string[]
          splits: Record<string, number>
          category: string
          date: string
          notes?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          paid_by?: string
          participants?: string[]
          splits?: Record<string, number>
          category?: string
          date?: string
          notes?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}