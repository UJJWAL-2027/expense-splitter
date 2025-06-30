import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export default function Balances() {
  const { state, dispatch } = useExpense();
  const { friends, balances } = state;

  const handleSettle = (friendId: string, amount: number) => {
    if (window.confirm(`Settle balance of $${Math.abs(amount).toFixed(2)}?`)) {
      dispatch({ type: 'SETTLE_BALANCE', payload: { friendId, amount } });
    }
  };

  const nonZeroBalances = Object.values(balances).filter(balance => balance.amount !== 0);
  const totalOwed = nonZeroBalances.filter(b => b.amount < 0).reduce((sum, b) => sum + Math.abs(b.amount), 0);
  const totalOwing = nonZeroBalances.filter(b => b.amount > 0).reduce((sum, b) => sum + b.amount, 0);
  const netBalance = totalOwing - totalOwed;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Balances</h2>
        <div className="text-sm text-gray-600">
          Net Balance: <span className={`font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <ArrowUpRight className="w-8 h-8" />
            <span className="text-red-100 text-sm">You Owe</span>
          </div>
          <div className="text-3xl font-bold">${totalOwed.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <ArrowDownRight className="w-8 h-8" />
            <span className="text-green-100 text-sm">You Are Owed</span>
          </div>
          <div className="text-3xl font-bold">${totalOwing.toFixed(2)}</div>
        </div>

        <div className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl p-6 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <span className={`${netBalance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm`}>Net Balance</span>
          </div>
          <div className="text-3xl font-bold">
            {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="space-y-4">
        {nonZeroBalances.map((balance) => {
          const friend = friends.find(f => f.id === balance.friendId);
          if (!friend) return null;

          const isOwed = balance.amount > 0;
          const amount = Math.abs(balance.amount);

          return (
            <div
              key={balance.friendId}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                    <p className={`text-sm ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                      {isOwed ? 'Owes you' : 'You owe'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                      ${amount.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettle(balance.friendId, balance.amount)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Settle Up</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {nonZeroBalances.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">All settled up!</h3>
            <p className="text-gray-400">You don't owe anyone, and no one owes you.</p>
          </div>
        )}
      </div>
    </div>
  );
}