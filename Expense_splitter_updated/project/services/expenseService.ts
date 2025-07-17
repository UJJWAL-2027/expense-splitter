import { supabase } from '@/lib/supabase'
import { Expense } from '@/types'

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error

    return data.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      paidBy: expense.paid_by,
      participants: expense.participants,
      splits: expense.splits,
      category: expense.category as any,
      date: expense.date,
      notes: expense.notes,
      userId: expense.user_id,
      createdAt: expense.created_at,
      updatedAt: expense.updated_at,
    }))
  },

  async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expenseData.description,
        amount: expenseData.amount,
        paid_by: expenseData.paidBy,
        participants: expenseData.participants,
        splits: expenseData.splits,
        category: expenseData.category,
        date: expenseData.date,
        notes: expenseData.notes,
        user_id: expenseData.userId,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      paidBy: data.paid_by,
      participants: data.participants,
      splits: data.splits,
      category: data.category as any,
      date: data.date,
      notes: data.notes,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async updateExpense(expenseId: string, updates: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Expense> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.amount !== undefined) updateData.amount = updates.amount
    if (updates.paidBy !== undefined) updateData.paid_by = updates.paidBy
    if (updates.participants !== undefined) updateData.participants = updates.participants
    if (updates.splits !== undefined) updateData.splits = updates.splits
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.date !== undefined) updateData.date = updates.date
    if (updates.notes !== undefined) updateData.notes = updates.notes

    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      paidBy: data.paid_by,
      participants: data.participants,
      splits: data.splits,
      category: data.category as any,
      date: data.date,
      notes: data.notes,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async deleteExpense(expenseId: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)

    if (error) throw error
  },
}