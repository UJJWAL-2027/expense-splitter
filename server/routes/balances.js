const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Friend = require('../models/Friend');

// Calculate and get all balances
router.get('/', async (req, res) => {
  try {
    const friends = await Friend.find();
    const expenses = await Expense.find()
      .populate('paidBy')
      .populate('participants');

    // Initialize balances
    const balances = {};
    friends.forEach(friend => {
      balances[friend._id] = {
        friendId: friend._id,
        friendName: friend.name,
        amount: 0
      };
    });

    // Calculate balances from expenses
    expenses.forEach(expense => {
      const { paidBy, splits } = expense;
      
      // Add what the payer paid
      if (balances[paidBy._id]) {
        balances[paidBy._id].amount += expense.amount;
      }
      
      // Subtract what each participant owes
      for (const [participantId, amount] of splits.entries()) {
        if (balances[participantId]) {
          balances[participantId].amount -= amount;
        }
      }
    });

    res.json(Object.values(balances));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get balance for specific friend
router.get('/:friendId', async (req, res) => {
  try {
    const friend = await Friend.findById(req.params.friendId);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    const expenses = await Expense.find({
      $or: [
        { paidBy: req.params.friendId },
        { participants: req.params.friendId }
      ]
    });

    let balance = 0;

    expenses.forEach(expense => {
      if (expense.paidBy.toString() === req.params.friendId) {
        balance += expense.amount;
      }
      
      const friendSplit = expense.splits.get(req.params.friendId);
      if (friendSplit) {
        balance -= friendSplit;
      }
    });

    res.json({
      friendId: req.params.friendId,
      friendName: friend.name,
      amount: balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;