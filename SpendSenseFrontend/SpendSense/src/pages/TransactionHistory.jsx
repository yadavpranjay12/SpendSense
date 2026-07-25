import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const TransactionHistory = () => {
    // State for raw data and filtered data
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filtering State (Defaults to current month and year)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    
    const { convert, symbol } = useCurrency();
    const navigate = useNavigate();

    // 1. Fetch all transactions from the backend
    const fetchTransactions = async () => {
        try {
            const [expenseRes, incomeRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/incomes')
            ]);

            const expenses = expenseRes.data.map(item => ({ ...item, type: 'expense' }));
            const incomes = incomeRes.data.map(item => ({ ...item, type: 'income' }));

            const combined = [...expenses, ...incomes].sort((a, b) => 
                new Date(b.creationTime) - new Date(a.creationTime)
            );

            setTransactions(combined);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to load transaction history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // 2. The Filter Logic: Runs whenever data or dropdowns change
    useEffect(() => {
        if (selectedMonth === 'all') {
            // Show the whole year
            setFilteredTransactions(transactions.filter(tx => 
                new Date(tx.creationTime).getFullYear() === parseInt(selectedYear)
            ));
        } else {
            // Filter by specific month AND year
            setFilteredTransactions(transactions.filter(tx => {
                const txDate = new Date(tx.creationTime);
                return txDate.getMonth() === parseInt(selectedMonth) && 
                       txDate.getFullYear() === parseInt(selectedYear);
            }));
        }
    }, [transactions, selectedMonth, selectedYear]);

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await api.delete(type === 'expense' ? `/expenses/${id}` : `/incomes/${id}`);
            fetchTransactions();
        } catch (err) {
            alert('Failed to delete the transaction.');
        }
    };

    // Arrays for generating the dropdown options
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = [currentYear, currentYear - 1, currentYear - 2];

    return (
        <div className="min-h-screen bg-offwhite font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Transaction History</h2>
                        <p className="text-sm text-gray-500 mt-1">View and filter your ledger.</p>
                    </div>
                    <Link to="/dashboard" className="text-sm font-medium text-brand-600 hover:text-brand-500 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Filter Controls UI */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Month</label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-3 py-2 outline-none"
                        >
                            <option value="all">All Year</option>
                            {months.map((m, index) => (
                                <option key={m} value={index}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-3 py-2 outline-none"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading ledger...</div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No transactions found for this period.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Notice we map over filteredTransactions, not all transactions */}
                                    {filteredTransactions.map((tx) => (
                                        <tr key={`${tx.type}-${tx.id}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(tx.creationTime).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {tx.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {tx.type === 'expense' ? tx.expenseGroup?.name : tx.incomeGroup?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                                                <span className={tx.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                                                    {tx.type === 'expense' ? '-' : '+'}{symbol}{convert(tx.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                                {/* Edit logic can go here if you added the modal! */}
                                                <button onClick={() => handleDelete(tx.id, tx.type)} className="text-red-600 hover:text-red-900 transition-colors">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;