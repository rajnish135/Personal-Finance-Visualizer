import { Schema, model, models } from 'mongoose';

const BudgetSchema = new Schema({
  category: { 
    type: String,
    enum: [
      'housing', 'transportation', 'food', 'utilities', 
      'healthcare', 'entertainment', 'education', 
      'shopping', 'other'
    ],
    required: true,
    unique: true
  },
  amount: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
}, { timestamps: true });

const Budget = models.Budget || model('Budget', BudgetSchema);

export default Budget;