export interface IExpense {
  _id: string;
  title: string;
  date: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCreateInput {
  title: string;
  date: string;
  amount: number;
}

export interface ExpenseUpdateInput {
  title?: string;
  date?: string;
  amount?: number;
}
