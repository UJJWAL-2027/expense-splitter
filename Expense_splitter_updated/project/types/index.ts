export interface Friend {
  id: string
  name: string
  email: string
  avatarUrl?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  participants: string[]
  splits: Record<string, number>
  category: ExpenseCategory
  date: string
  notes?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Balance {
  friendId: string
  amount: number // positive means they owe you, negative means you owe them
}

export type ExpenseCategory = 
  | 'food' 
  | 'entertainment' 
  | 'transportation' 
  | 'utilities' 
  | 'shopping' 
  | 'settlement' 
  | 'other'

export interface ExpenseStats {
  totalExpenses: number
  totalBalance: number
  youOwe: number
  youAreOwed: number
  monthlySpending: Array<{
    month: string
    amount: number
  }>
  categoryBreakdown: Array<{
    category: string
    amount: number
    color: string
  }>
}