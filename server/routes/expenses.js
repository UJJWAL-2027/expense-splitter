const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name email')
      .populate('participants', 'name email')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new expense
router.post('/', async (req, res) => {
  try {
    const {
      description,
      amount,
      paidBy,
      participants,
      splits,
      category,
      date,
      notes
    } = req.body;

    const expense = new Expense({
      description,
      amount,
      paidBy,
      participants,
      splits,
      category,
      date: date ? new Date(date) : new Date(),
      notes
    });

    const savedExpense = await expense.save();
    const populatedExpense = await Expense.findById(savedExpense._id)
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const {
      description,
      amount,
      paidBy,
      participants,
      splits,
      category,
      date,
      notes
    } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        paidBy,
        participants,
        splits,
        category,
        date: date ? new Date(date) : undefined,
        notes
      },
      { new: true, runValidators: true }
    ).populate('paidBy', 'name email')
     .populate('participants', 'name email');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;