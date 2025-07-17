'use client'

import { DollarSign, Users, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useExpense } from '@/contexts/ExpenseContext'

export default function Dashboard() {
  const { state } = useExpense()
  const { friends, expenses, stats } = state

  const recentExpenses = expenses.slice(0, 5)

  const statsCards = [
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpenses.toFixed(2)}`,
      icon: Receipt,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Friends',
      value: friends.length.toString(),
      icon: Users,
      color: 'from-primary-500 to-primary-600',
      change: '+2'
    },
    {
      title: 'You Owe',
      value: `$${stats.youOwe.toFixed(2)}`,
      icon: ArrowUpRight,
      color: 'from-red-500 to-red-600',
      change: '-$23'
    },
    {
      title: 'You Are Owed',
      value: `$${stats.youAreOwed.toFixed(2)}`,
      icon: ArrowDownRight,
      color: 'from-green-500 to-green-600',
      change: '+$45'
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 via-green-500 to-secondary-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-green-100">Here's your expense summary for this month.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
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
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Spending</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Category Breakdown</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="amount"
                  label={({ category, amount }) => `${category}: $${amount.toFixed(0)}`}
                >
                  {stats.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
          <Receipt className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentExpenses.map((expense, index) => {
            const payer = friends.find(f => f.id === expense.paidBy)
            return (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
                  <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </div>
            )
          })}
          
          {recentExpenses.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No expenses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}