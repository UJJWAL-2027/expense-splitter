'use client'

import { useState } from 'react'
import { Users, Receipt, BarChart3, DollarSign, Plus } from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import Expenses from '@/components/Expenses'
import Friends from '@/components/Friends'
import Balances from '@/components/Balances'
import AddExpenseModal from '@/components/modals/AddExpenseModal'
import AddFriendModal from '@/components/modals/AddFriendModal'
import AuthModal from '@/components/modals/AuthModal'
import Header from '@/components/layout/Header'
import Navigation from '@/components/layout/Navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const { user } = useAuth()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'balances', label: 'Balances', icon: DollarSign },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'expenses':
        return <Expenses />
      case 'friends':
        return <Friends onAddFriend={() => setShowAddFriend(true)} />
      case 'balances':
        return <Balances />
      default:
        return <Dashboard />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Expense Splitter
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Split expenses with friends easily and keep track of who owes what.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
        
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onAddExpense={() => setShowAddExpense(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Navigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="pb-6 animate-fade-in">
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseModal onClose={() => setShowAddExpense(false)} />
      )}
      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </div>
  )
}