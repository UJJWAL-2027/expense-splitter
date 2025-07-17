'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Friend, Expense, Balance, ExpenseStats } from '@/types'
import { useAuth } from './AuthContext'
import { friendService } from '@/services/friendService'
import { expenseService } from '@/services/expenseService'

interface ExpenseState {
  friends: Friend[]
  expenses: Expense[]
  balances: Record<string, Balance>
  stats: ExpenseStats
  loading: boolean
}

type ExpenseAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'REMOVE_FRIEND'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'UPDATE_BALANCES'; payload: Record<string, Balance> }
  | { type: 'UPDATE_STATS'; payload: ExpenseStats }

const initialState: ExpenseState = {
  friends: [],
  expenses: [],
  balances: {},
  stats: {
    totalExpenses: 0,
    totalBalance: 0,
    youOwe: 0,
    youAreOwed: 0,
    monthlySpending: [],
    categoryBreakdown: [],
  },
  loading: false,
}

const ExpenseContext = createContext<{
  state: ExpenseState
  dispatch: React.Dispatch<ExpenseAction>
  addFriend: (friend: Omit<Friend, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  removeFriend: (friendId: string) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  removeExpense: (expenseId: string) => Promise<void>
  settleBalance: (friendId: string, amount: number) => Promise<void>
} | null>(null)

function calculateBalances(friends: Friend[], expenses: Expense[]): Record<string, Balance> {
  const balances: Record<string, Balance> = {}
  
  // Initialize balances
  friends.forEach(friend => {
    balances[friend.id] = { friendId: friend.id, amount: 0 }
  })

  // Calculate balances from expenses
  expenses.forEach(expense => {
    const { paidBy, splits } = expense
    
    // Add what the payer paid
    if (balances[paidBy]) {
      balances[paidBy].amount += expense.amount
    }
    
    // Subtract what each participant owes
    Object.entries(splits).forEach(([participantId, amount]) => {
      if (balances[participantId]) {
        balances[participantId].amount -= amount
      }
    })
  })

  return balances
}

function calculateStats(friends: Friend[], expenses: Expense[], balances: Record<string, Balance>): ExpenseStats {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const balanceValues = Object.values(balances)
  const youOwe = balanceValues.filter(b => b.amount < 0).reduce((sum, b) => sum + Math.abs(b.amount), 0)
  const youAreOwed = balanceValues.filter(b => b.amount > 0).reduce((sum, b) => sum + b.amount, 0)

  // Monthly spending calculation
  const monthlyData: Record<string, number> = {}
  expenses.forEach(expense => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    monthlyData[month] = (monthlyData[month] || 0) + expense.amount
  })

  const monthlySpending = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }))

  // Category breakdown
  const categoryData: Record<string, number> = {}
  expenses.forEach(expense => {
    categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount
  })

  const categoryColors = {
    food: '#f59e0b',
    entertainment: '#8b5cf6',
    transportation: '#3b82f6',
    utilities: '#10b981',
    shopping: '#f97316',
    settlement: '#6b7280',
    other: '#ec4899',
  }

  const categoryBreakdown = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
    color: categoryColors[category as keyof typeof categoryColors] || categoryColors.other,
  }))

  return {
    totalExpenses,
    totalBalance: youAreOwed - youOwe,
    youOwe,
    youAreOwed,
    monthlySpending,
    categoryBreakdown,
  }
}

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_FRIENDS':
      const newBalances = calculateBalances(action.payload, state.expenses)
      const newStats = calculateStats(action.payload, state.expenses, newBalances)
      return { 
        ...state, 
        friends: action.payload,
        balances: newBalances,
        stats: newStats,
      }
    
    case 'ADD_FRIEND':
      const updatedFriends = [...state.friends, action.payload]
      const updatedBalances = calculateBalances(updatedFriends, state.expenses)
      const updatedStats = calculateStats(updatedFriends, state.expenses, updatedBalances)
      return { 
        ...state, 
        friends: updatedFriends,
        balances: updatedBalances,
        stats: updatedStats,
      }
    
    case 'REMOVE_FRIEND':
      const filteredFriends = state.friends.filter(friend => friend.id !== action.payload)
      const filteredExpenses = state.expenses.filter(expense => 
        expense.paidBy !== action.payload && 
        !expense.participants.includes(action.payload)
      )
      const recalculatedBalances = calculateBalances(filteredFriends, filteredExpenses)
      const recalculatedStats = calculateStats(filteredFriends, filteredExpenses, recalculatedBalances)
      return {
        ...state,
        friends: filteredFriends,
        expenses: filteredExpenses,
        balances: recalculatedBalances,
        stats: recalculatedStats,
      }
    
    case 'SET_EXPENSES':
      const expenseBalances = calculateBalances(state.friends, action.payload)
      const expenseStats = calculateStats(state.friends, action.payload, expenseBalances)
      return { 
        ...state, 
        expenses: action.payload,
        balances: expenseBalances,
        stats: expenseStats,
      }
    
    case 'ADD_EXPENSE':
      const newExpenses = [...state.expenses, action.payload]
      const addBalances = calculateBalances(state.friends, newExpenses)
      const addStats = calculateStats(state.friends, newExpenses, addBalances)
      return { 
        ...state, 
        expenses: newExpenses,
        balances: addBalances,
        stats: addStats,
      }
    
    case 'REMOVE_EXPENSE':
      const remainingExpenses = state.expenses.filter(expense => expense.id !== action.payload)
      const removeBalances = calculateBalances(state.friends, remainingExpenses)
      const removeStats = calculateStats(state.friends, remainingExpenses, removeBalances)
      return {
        ...state,
        expenses: remainingExpenses,
        balances: removeBalances,
        stats: removeStats,
      }
    
    case 'UPDATE_BALANCES':
      return { ...state, balances: action.payload }
    
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload }
    
    default:
      return state
  }
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState)
  const { user } = useAuth()

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadData()
    } else {
      // Reset state when user logs out
      dispatch({ type: 'SET_FRIENDS', payload: [] })
      dispatch({ type: 'SET_EXPENSES', payload: [] })
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const [friends, expenses] = await Promise.all([
        friendService.getFriends(),
        expenseService.getExpenses(),
      ])
      
      dispatch({ type: 'SET_FRIENDS', payload: friends })
      dispatch({ type: 'SET_EXPENSES', payload: expenses })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addFriend = async (friendData: Omit<Friend, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    try {
      const friend = await friendService.createFriend({
        ...friendData,
        userId: user.id,
      })
      dispatch({ type: 'ADD_FRIEND', payload: friend })
    } catch (error) {
      console.error('Error adding friend:', error)
      throw error
    }
  }

  const removeFriend = async (friendId: string) => {
    try {
      await friendService.deleteFriend(friendId)
      dispatch({ type: 'REMOVE_FRIEND', payload: friendId })
    } catch (error) {
      console.error('Error removing friend:', error)
      throw error
    }
  }

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    try {
      const expense = await expenseService.createExpense({
        ...expenseData,
        userId: user.id,
      })
      dispatch({ type: 'ADD_EXPENSE', payload: expense })
    } catch (error) {
      console.error('Error adding expense:', error)
      throw error
    }
  }

  const removeExpense = async (expenseId: string) => {
    try {
      await expenseService.deleteExpense(expenseId)
      dispatch({ type: 'REMOVE_EXPENSE', payload: expenseId })
    } catch (error) {
      console.error('Error removing expense:', error)
      throw error
    }
  }

  const settleBalance = async (friendId: string, amount: number) => {
    if (!user) return

    try {
      const friend = state.friends.find(f => f.id === friendId)
      if (!friend) return

      const settlementExpense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        description: `Settlement with ${friend.name}`,
        amount: Math.abs(amount),
        paidBy: amount > 0 ? friendId : user.id,
        participants: [friendId],
        splits: { [friendId]: Math.abs(amount) },
        category: 'settlement',
        date: new Date().toISOString().split('T')[0],
        notes: 'Balance settlement',
      }

      await addExpense(settlementExpense)
    } catch (error) {
      console.error('Error settling balance:', error)
      throw error
    }
  }

  const value = {
    state,
    dispatch,
    addFriend,
    removeFriend,
    addExpense,
    removeExpense,
    settleBalance,
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider')
  }
  return context
}