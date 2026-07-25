import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { convert, symbol } = useCurrency();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch both at the same time
                const [expenseRes, incomeRes] = await Promise.all([
                    api.get('/expenses'),
                    api.get('/incomes')
                ]);

                // Tag them so we know which is which, then combine them
                const expenses = expenseRes.data.map(e => ({ ...e, type: 'expense' }));
                const incomes = incomeRes.data.map(i => ({ ...i, type: 'income' }));
                
                const combined = [...expenses, ...incomes];
                
                // Sort by date (newest first)
                combined.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
                
                setTransactions(combined);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load history", err);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-offwhite py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Transaction Ledger</h2>
                    <Link to="/dashboard" className="text-sm font-medium text-brand-600 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-center text-gray-500">Loading ledger...</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {transactions.length === 0 ? (
                                <li className="p-6 text-center text-gray-500">No transactions found.</li>
                            ) : (
                                transactions.map((t) => (
                                    <li key={t.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{t.description}</p>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {new Date(t.creationTime).toLocaleDateString()} &bull; 
                                                {t.type === 'expense' ? t.expenseGroup?.name : t.incomeGroup?.name}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                            t.type === 'income' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                        }`}>
                                            {t.type === 'income' ? '+' : '-'}{symbol}{convert(t.amount)}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;