import React from 'react';
import { DollarSign, Users, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export default function Dashboard() {
  const { state } = useExpense();
  const { friends, expenses, balances } = state;

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBalance = Object.values(balances).reduce((sum, balance) => sum + Math.abs(balance.amount), 0);
  const youOwe = Object.values(balances).filter(b => b.amount < 0).reduce((sum, b) => sum + Math.abs(b.amount), 0);
  const youAreOwed = Object.values(balances).filter(b => b.amount > 0).reduce((sum, b) => sum + b.amount, 0);

  const recentExpenses = expenses.slice(-3).reverse();

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: Receipt,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Friends',
      value: friends.length.toString(),
      icon: Users,
      color: 'from-emerald-500 to-green-600',
      change: '+2'
    },
    {
      title: 'You Owe',
      value: `$${youOwe.toFixed(2)}`,
      icon: ArrowUpRight,
      color: 'from-red-500 to-red-600',
      change: '-$23'
    },
    {
      title: 'You Are Owed',
      value: `$${youAreOwed.toFixed(2)}`,
      icon: ArrowDownRight,
      color: 'from-green-500 to-green-600',
      change: '+$45'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-emerald-100">Here's your expense summary for this month.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentExpenses.map((expense) => {
              const payer = friends.find(f => f.id === expense.paidBy);
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{expense.description}</p>
                      <p className="text-sm text-gray-600">Paid by {payer?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{expense.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Balance Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Balance Overview</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.values(balances).slice(0, 4).map((balance) => {
              const friend = friends.find(f => f.id === balance.friendId);
              if (!friend || balance.amount === 0) return null;
              
              return (
                <div key={balance.friendId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{friend.name}</p>
                      <p className="text-sm text-gray-600">
                        {balance.amount > 0 ? 'Owes you' : 'You owe'}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${balance.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(balance.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}