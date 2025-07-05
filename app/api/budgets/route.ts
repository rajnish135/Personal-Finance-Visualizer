import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';

export async function GET() {
  await dbConnect();
  const currentDate = new Date();
  const budgets = await Budget.find({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  }).lean();
  return NextResponse.json(budgets);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const currentDate = new Date();

  try {
    const budget = await Budget.findOneAndUpdate(
      {
        category: body.category,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      },
      { amount: body.amount },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true 
      }
    );
    
    return NextResponse.json(budget, { status: 200 });
  } 
  catch (error) 
  {
     console.error(error);
    return NextResponse.json(
      { error: 'Failed to save budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } 
  catch (error) {
     console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}