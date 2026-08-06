import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext'; 

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // Extract Currency Tools
    const { currency, setCurrency, convert, symbol, availableCurrencies } = useCurrency();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // MVP Fix: Only fetch the summary data, no more budget fetching
                const summaryRes = await api.get('/dashboard/summary');
                
                setSummary(summaryRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard:', err);
                setError('Failed to load data. Your session may have expired.');
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                }
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-offwhite flex items-center justify-center">
                <p className="text-brand-600 text-xl font-semibold animate-pulse">Loading SpendSense...</p>
            </div>
        );
    }

    // Calculate totals for the charts based on recent activity
    const recentIncomeTotal = summary.recentIncomes?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const recentExpenseTotal = summary.recentExpenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
    
    const chartData = [
        { name: 'Income', value: recentIncomeTotal, color: '#10b981' }, 
        { name: 'Expenses', value: recentExpenseTotal, color: '#ef4444' } 
    ];

    return (
        <div className="min-h-screen bg-offwhite font-sans">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Spend<span className="text-brand-600">Sense</span>
                </h1>
                
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    <span className="hidden sm:inline text-gray-600 text-sm font-medium">Hello, {username}</span>
                    
                    {/* Live Currency Selector */}
                    <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-2 py-1 outline-none cursor-pointer"
                    >
                        {availableCurrencies.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <button onClick={() => navigate('/history')} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                        Ledger
                    </button>
                    
                    <button onClick={() => navigate('/categories')} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                        Categories
                    </button>

                    <button onClick={() => navigate('/add-transaction')} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-500 transition-colors shadow-sm">
                        + New
                    </button>
                    
                    <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors">
                        Log out
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Top Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    
                    {/* Total Balance Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Balance</h2>
                        <p className={`text-5xl font-extrabold ${summary.totalBalance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                            {summary.totalBalance < 0 ? '-' : ''}{symbol}{convert(Math.abs(summary.totalBalance))}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Across all recorded transactions</p>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center space-y-4">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Income</h2>
                            <p className="text-2xl font-bold text-green-500">+{symbol}{convert(recentIncomeTotal)}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Expenses</h2>
                            <p className="text-2xl font-bold text-red-500">-{symbol}{convert(recentExpenseTotal)}</p>
                        </div>
                    </div>

                    {/* Donut Chart Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center h-64">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Cash Flow (Recent)</h2>
                        {recentIncomeTotal === 0 && recentExpenseTotal === 0 ? (
                            <p className="text-sm text-gray-400 mt-8">Add transactions to see chart.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${symbol}${convert(value)}`} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Lists Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Incomes Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Recent Incomes</h3>
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {summary.recentIncomes?.length === 0 ? (
                                <li className="px-6 py-8 text-gray-500 text-sm text-center">No recent incomes found.</li>
                            ) : (
                                summary.recentIncomes?.map((income) => (
                                    <li key={income.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{income.description}</p>
                                            <p className="text-xs text-gray-500 font-medium">{new Date(income.creationTime).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-sm font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                                            +{symbol}{convert(income.amount)}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Recent Expenses Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Recent Expenses</h3>
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {summary.recentExpenses?.length === 0 ? (
                                <li className="px-6 py-8 text-gray-500 text-sm text-center">No recent expenses found.</li>
                            ) : (
                                summary.recentExpenses?.map((expense) => (
                                    <li key={expense.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{expense.description}</p>
                                            <p className="text-xs text-gray-500 font-medium">{new Date(expense.creationTime).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                                            -{symbol}{convert(expense.amount)}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;