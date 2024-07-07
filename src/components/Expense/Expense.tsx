interface TransactionProps {
  merchant: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  invoiceImg: string;
}

const Transaction = () => {
  return <div>Transaction</div>;
};

export default Transaction;
