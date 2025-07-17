import React from 'react';
import { Calendar, User, Trash2, Receipt, Tag } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export default function Expenses() {
  const { state, dispatch } = useExpense();
  const { expenses, friends } = state;

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch({ type: 'REMOVE_EXPENSE', payload: expenseId });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food': 'from-orange-500 to-red-500',
      'Entertainment': 'from-purple-500 to-pink-500',
      'Transportation': 'from-blue-500 to-indigo-500',
      'Utilities': 'from-green-500 to-teal-500',
      'Shopping': 'from-yellow-500 to-orange-500',
      'Settlement': 'from-gray-500 to-gray-600',
      'Other': 'from-indigo-500 to-purple-500',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">All Expenses</h2>
        <div className="text-sm text-gray-600">
          Total: ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
        </div>
      </div>

      <div className="grid gap-4">
        {sortedExpenses.map((expense) => {
          const payer = friends.find(f => f.id === expense.paidBy);
          const participantNames = expense.participants
            .map(id => friends.find(f => f.id === id)?.name || 'Unknown')
            .join(', ');

          return (
            <div
              key={expense.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(expense.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {expense.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Paid by {payer?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{expense.category}</span>
                      </div>
                    </div>
                    {expense.notes && (
                      <p className="text-sm text-gray-500 mt-2">{expense.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      ${expense.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Split {expense.participants.length} ways
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 mb-2">Participants:</p>
                <div className="flex flex-wrap gap-2">
                  {expense.participants.map(participantId => {
                    const participant = friends.find(f => f.id === participantId);
                    const splitAmount = expense.splits[participantId] || 0;
                    return (
                      <div
                        key={participantId}
                        className="bg-gray-50 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span className="font-medium">{participant?.name || 'Unknown'}</span>
                        <span className="text-gray-500">${splitAmount.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {expenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No expenses yet</h3>
            <p className="text-gray-400">Start by adding your first expense to split with friends.</p>
          </div>
        )}
      </div>
    </div>
  );
}