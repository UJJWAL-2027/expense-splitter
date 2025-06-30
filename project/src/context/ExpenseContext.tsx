import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  splits: { [friendId: string]: number };
  category: string;
  date: string;
  notes?: string;
}

export interface Balance {
  friendId: string;
  amount: number; // positive means they owe you, negative means you owe them
}

interface ExpenseState {
  friends: Friend[];
  expenses: Expense[];
  balances: { [friendId: string]: Balance };
}

type ExpenseAction =
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'REMOVE_FRIEND'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'UPDATE_BALANCES' }
  | { type: 'SETTLE_BALANCE'; payload: { friendId: string; amount: number } };

const initialState: ExpenseState = {
  friends: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
    },
    {
      id: '3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
    },
  ],
  expenses: [
    {
      id: '1',
      description: 'Dinner at Italian Restaurant',
      amount: 120,
      paidBy: '1',
      participants: ['1', '2', '3'],
      splits: { '1': 40, '2': 40, '3': 40 },
      category: 'Food',
      date: '2024-01-15',
      notes: 'Great pasta place downtown',
    },
    {
      id: '2',
      description: 'Movie Tickets',
      amount: 36,
      paidBy: '2',
      participants: ['1', '2'],
      splits: { '1': 18, '2': 18 },
      category: 'Entertainment',
      date: '2024-01-14',
    },
  ],
  balances: {},
};

const ExpenseContext = createContext<{
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
} | null>(null);

function calculateBalances(friends: Friend[], expenses: Expense[]): { [friendId: string]: Balance } {
  const balances: { [friendId: string]: Balance } = {};
  
  // Initialize balances
  friends.forEach(friend => {
    balances[friend.id] = { friendId: friend.id, amount: 0 };
  });

  // Calculate balances from expenses
  expenses.forEach(expense => {
    const { paidBy, splits } = expense;
    
    // Add what the payer paid
    if (balances[paidBy]) {
      balances[paidBy].amount += expense.amount;
    }
    
    // Subtract what each participant owes
    Object.entries(splits).forEach(([participantId, amount]) => {
      if (balances[participantId]) {
        balances[participantId].amount -= amount;
      }
    });
  });

  return balances;
}

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_FRIEND':
      return {
        ...state,
        friends: [...state.friends, action.payload],
      };
    
    case 'REMOVE_FRIEND':
      return {
        ...state,
        friends: state.friends.filter(friend => friend.id !== action.payload),
        expenses: state.expenses.filter(expense => 
          expense.paidBy !== action.payload && 
          !expense.participants.includes(action.payload)
        ),
      };
    
    case 'ADD_EXPENSE':
      const newState = {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
      return {
        ...newState,
        balances: calculateBalances(newState.friends, newState.expenses),
      };
    
    case 'REMOVE_EXPENSE':
      const updatedState = {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
      return {
        ...updatedState,
        balances: calculateBalances(updatedState.friends, updatedState.expenses),
      };
    
    case 'UPDATE_BALANCES':
      return {
        ...state,
        balances: calculateBalances(state.friends, state.expenses),
      };
    
    case 'SETTLE_BALANCE':
      // Create a settlement expense
      const settlementExpense: Expense = {
        id: `settlement-${Date.now()}`,
        description: `Settlement with ${state.friends.find(f => f.id === action.payload.friendId)?.name}`,
        amount: Math.abs(action.payload.amount),
        paidBy: action.payload.amount > 0 ? action.payload.friendId : 'you',
        participants: [action.payload.friendId, 'you'],
        splits: {
          [action.payload.friendId]: Math.abs(action.payload.amount),
          'you': 0,
        },
        category: 'Settlement',
        date: new Date().toISOString().split('T')[0],
      };
      
      const settledState = {
        ...state,
        expenses: [...state.expenses, settlementExpense],
      };
      
      return {
        ...settledState,
        balances: calculateBalances(settledState.friends, settledState.expenses),
      };
    
    default:
      return state;
  }
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, {
    ...initialState,
    balances: calculateBalances(initialState.friends, initialState.expenses),
  });

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
}