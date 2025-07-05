import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: false },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { 
    type: String, 
    enum: [
      'salary', 'freelance', 'investments', // income
      'housing', 'transportation', 'food', 'utilities', 
      'healthcare', 'entertainment', 'education', 
      'shopping', 'other' // expenses
    ], 
    required: true 
  },
}, { timestamps: true });

const Transaction = models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;