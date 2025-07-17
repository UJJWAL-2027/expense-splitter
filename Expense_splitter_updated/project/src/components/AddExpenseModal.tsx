import React, { useState } from 'react';
import { X, DollarSign, Users, Calendar, Tag, FileText } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

interface AddExpenseModalProps {
  onClose: () => void;
}

export default function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const { state, dispatch } = useExpense();
  const { friends } = state;

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: '',
    participants: [] as string[],
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    splitType: 'equal' as 'equal' | 'custom',
    customSplits: {} as { [key: string]: string },
  });

  const categories = [
    'Food', 'Entertainment', 'Transportation', 'Utilities', 'Shopping', 'Other'
  ];

  const handleParticipantToggle = (friendId: string) => {
    const newParticipants = formData.participants.includes(friendId)
      ? formData.participants.filter(id => id !== friendId)
      : [...formData.participants, friendId];
    
    setFormData({ ...formData, participants: newParticipants });
  };

  const handleCustomSplitChange = (friendId: string, amount: string) => {
    setFormData({
      ...formData,
      customSplits: { ...formData.customSplits, [friendId]: amount }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.paidBy || formData.participants.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    let splits: { [key: string]: number } = {};

    if (formData.splitType === 'equal') {
      const splitAmount = amount / formData.participants.length;
      formData.participants.forEach(id => {
        splits[id] = splitAmount;
      });
    } else {
      const totalCustomSplit = formData.participants.reduce((sum, id) => {
        return sum + (parseFloat(formData.customSplits[id]) || 0);
      }, 0);
      
      if (Math.abs(totalCustomSplit - amount) > 0.01) {
        alert('Custom splits must add up to the total amount');
        return;
      }
      
      formData.participants.forEach(id => {
        splits[id] = parseFloat(formData.customSplits[id]) || 0;
      });
    }

    const expense = {
      id: Date.now().toString(),
      description: formData.description,
      amount,
      paidBy: formData.paidBy,
      participants: formData.participants,
      splits,
      category: formData.category,
      date: formData.date,
      notes: formData.notes || undefined,
    };

    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    onClose();
  };

  const totalCustomSplit = formData.participants.reduce((sum, id) => {
    return sum + (parseFloat(formData.customSplits[id]) || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="What was this expense for?"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paid By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Paid By *
              </label>
              <select
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select payer</option>
                {friends.map(friend => (
                  <option key={friend.id} value={friend.id}>{friend.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants * (Select who should split this expense)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {friends.map(friend => (
                <label
                  key={friend.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.participants.includes(friend.id)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(friend.id)}
                    onChange={() => handleParticipantToggle(friend.id)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-gray-800">{friend.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Split Type */}
          {formData.participants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="equal"
                    checked={formData.splitType === 'equal'}
                    onChange={(e) => setFormData({ ...formData, splitType: e.target.value as 'equal' })}
                    className="mr-2"
                  />
                  Split Equally
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={formData.splitType === 'custom'}
                    onChange={(e) => setFormData({ ...formData, splitType: e.target.value as 'custom' })}
                    className="mr-2"
                  />
                  Custom Split
                </label>
              </div>
            </div>
          )}

          {/* Custom Splits */}
          {formData.splitType === 'custom' && formData.participants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Split Amounts
              </label>
              <div className="space-y-3">
                {formData.participants.map(participantId => {
                  const participant = friends.find(f => f.id === participantId);
                  return (
                    <div key={participantId} className="flex items-center space-x-3">
                      <span className="w-24 text-sm font-medium text-gray-700">
                        {participant?.name}:
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.customSplits[participantId] || ''}
                        onChange={(e) => handleCustomSplitChange(participantId, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                  );
                })}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className={`font-bold ${
                    Math.abs(totalCustomSplit - parseFloat(formData.amount || '0')) < 0.01
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    ${totalCustomSplit.toFixed(2)} / ${parseFloat(formData.amount || '0').toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Equal Split Preview */}
          {formData.splitType === 'equal' && formData.participants.length > 0 && formData.amount && (
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-emerald-800">
                Each person pays: <span className="font-bold">
                  ${(parseFloat(formData.amount) / formData.participants.length).toFixed(2)}
                </span>
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}