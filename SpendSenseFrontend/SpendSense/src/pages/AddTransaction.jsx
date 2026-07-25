import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AddTransaction = () => {
    const [type, setType] = useState('expense'); // 'expense' or 'income'
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [groupId, setGroupId] = useState('');
    
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the groups whenever the transaction type changes
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Fetch expense groups or income groups based on the toggle
                const endpoint = type === 'expense' ? '/expense-groups' : '/income-groups';
                const response = await api.get(endpoint);
                setGroups(response.data);
                // Auto-select the first group if available
                if (response.data.length > 0) {
                    setGroupId(response.data[0].id);
                } else {
                    setGroupId('');
                }
            } catch (err) {
                console.error('Error fetching groups:', err);
                setError(`Failed to load ${type} categories.`);
            }
        };

        fetchGroups();
    }, [type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!groupId) {
            setError(`You need to create an ${type} category first!`);
            setLoading(false);
            return;
        }

        try {
            const payload = {
                amount: parseFloat(amount),
                description: description,
                [`${type}GroupId`]: groupId // dynamically sets expenseGroupId or incomeGroupId
            };

            const endpoint = type === 'expense' ? '/expenses' : '/incomes';
            await api.post(endpoint, payload);
            
            // Redirect back to dashboard upon success
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to add transaction. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-offwhite font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Add Transaction</h2>
                    <Link to="/dashboard" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                        Back to Dashboard
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Type Toggle */}
                <div className="flex rounded-md shadow-sm mb-6">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 text-sm font-medium rounded-l-md border ${
                            type === 'expense' 
                            ? 'bg-brand-600 text-white border-brand-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                            type === 'income' 
                            ? 'bg-green-600 text-white border-green-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Income
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500"
                            placeholder="e.g., Groceries, Salary, Utilities"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 capitalize">{type} Category</label>
                        <select
                            required
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                        >
                            {groups.length === 0 ? (
                                <option value="">No categories found...</option>
                            ) : (
                                groups.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {groups.length === 0 && (
                            <p className="mt-2 text-xs text-red-500">
                                *You must create a category in the database before adding a transaction.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || groups.length === 0}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                            loading || groups.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500'
                        }`}
                    >
                        {loading ? 'Saving...' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;