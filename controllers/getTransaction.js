"use server";

import { connectToDB } from "@/lib/connectDB";
import Transaction from "@/models/Transaction";

export async function getTransactionsByUserId(userId) {
  if (!userId) return [];

  await connectToDB();

  // Find all transactions for the user, select only needed fields, sorted by newest first
  const transactions = await Transaction.find({ user: userId })
    .select("user type amount description category avatar date")
    .sort({ createdAt: -1 })
    .lean();

  // Convert _id and user to string, and format date as ISO string for frontend
  transactions.forEach(transaction => {
    transaction._id = transaction._id.toString();
    transaction.user = transaction.user.toString();
    transaction.date = transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date;
  });

  return transactions;
}