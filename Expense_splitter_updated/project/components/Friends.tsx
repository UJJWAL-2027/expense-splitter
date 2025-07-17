'use client'

import { Users, Mail, Trash2, Plus } from 'lucide-react'
import { useExpense } from '@/contexts/ExpenseContext'

interface FriendsProps {
  onAddFriend: () => void
}

export default function Friends({ onAddFriend }: FriendsProps) {
  const { state, removeFriend } = useExpense()
  const { friends, expenses, balances } = state

  const handleDeleteFriend = async (friendId: string) => {
    const friendExpenses = expenses.filter(
      expense => expense.paidBy === friendId || expense.participants.includes(friendId)
    )
    
    if (friendExpenses.length > 0) {
      alert('Cannot delete friend with existing expenses. Please settle all balances first.')
      return
    }

    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await removeFriend(friendId)
      } catch (error) {
        alert('Failed to remove friend. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Friends</h2>
        <button
          onClick={onAddFriend}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Friend</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend, index) => {
          const balance = balances[friend.id]
          const friendExpenses = expenses.filter(
            expense => expense.paidBy === friend.id || expense.participants.includes(friend.id)
          )

          return (
            <div
              key={friend.id}
              className="card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{friend.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFriend(friend.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className={`font-semibold ${
                    balance?.amount > 0 ? 'text-green-600' : 
                    balance?.amount < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {balance?.amount > 0 && '+'}${Math.abs(balance?.amount || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shared Expenses</span>
                  <span className="font-medium text-gray-800">{friendExpenses.length}</span>
                </div>

                {balance?.amount !== 0 && (
                  <div className={`p-3 rounded-lg ${
                    balance?.amount > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <p className="text-sm font-medium">
                      {balance?.amount > 0 
                        ? `${friend.name} owes you $${Math.abs(balance.amount).toFixed(2)}`
                        : `You owe ${friend.name} $${Math.abs(balance?.amount || 0).toFixed(2)}`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {friends.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No friends added yet</h3>
            <p className="text-gray-400 mb-4">Add friends to start splitting expenses together.</p>
            <button
              onClick={onAddFriend}
              className="btn-primary"
            >
              Add Your First Friend
            </button>
          </div>
        )}
      </div>
    </div>
  )
}