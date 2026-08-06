import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { symbol, convert } = useCurrency();
    
    // Modal States
    const [editData, setEditData] = useState(null);

    const fetchCategories = async () => {
        try {
            const [expenseRes, incomeRes] = await Promise.all([
                api.get('/expense-groups'),
                api.get('/income-groups')
            ]);
            
            const expenses = expenseRes.data.map(c => ({ ...c, type: 'EXPENSE' }));
            const incomes = incomeRes.data.map(c => ({ ...c, type: 'INCOME', limit: null })); // Incomes don't have limits
            
            setCategories([...expenses, ...incomes]);
        } catch (err) {
            console.error('Failed to load categories', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // HANDLE UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const endpoint = editData.type === 'EXPENSE' ? `/expense-groups/${editData.id}` : `/income-groups/${editData.id}`;
            const payload = { 
                name: editData.name,
                // Only send a limit if it's an expense group
                ...(editData.type === 'EXPENSE' && { limit: parseFloat(editData.limit) || 0 })
            };
            
            await api.put(endpoint, payload);
            setEditData(null);
            fetchCategories(); // Refresh table
        } catch (err) {
            alert('Failed to update category.');
        }
    };

    // HANDLE DELETE
    const handleDelete = async (id, type) => {
        if (!window.confirm(`Delete this ${type.toLowerCase()} category? This may affect linked transactions.`)) return;
        try {
            const endpoint = type === 'EXPENSE' ? `/expense-groups/${id}` : `/income-groups/${id}`;
            await api.delete(endpoint);
            fetchCategories(); // Refresh table
        } catch (err) {
            alert('Failed to delete category. Make sure it has no attached transactions.');
        }
    };

    return (
        <div className="min-h-screen bg-offwhite py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Manage Categories</h2>
                        <p className="text-sm text-gray-500 mt-1">Organize your income and expense buckets.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/dashboard" className="text-sm font-medium text-gray-600 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
                            &larr; Back
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading categories...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Monthly Budget</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((cat) => (
                                        <tr key={`${cat.type}-${cat.id}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {cat.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${cat.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {cat.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                {cat.type === 'EXPENSE' ? `${symbol}${convert(cat.limit || 0)}` : 'N/A'}
                                            </td>
                                            
                                            {/* WRAPPED IN A DIV TO FIX CSS BUG */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-4">
                                                    <button onClick={() => setEditData(cat)} className="text-blue-600 hover:text-blue-900 font-bold transition-colors">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(cat.id, cat.type)} className="text-red-600 hover:text-red-900 font-bold transition-colors">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT MODAL UI */}
            {editData && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <form onSubmit={handleUpdate} className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Category</h2>
                        
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                        <input 
                            type="text" 
                            value={editData.name} 
                            onChange={e => setEditData({...editData, name: e.target.value})}
                            className="w-full border border-gray-300 p-2 mb-4 rounded-lg outline-none focus:ring-brand-500" 
                            required 
                        />
                        
                        {editData.type === 'EXPENSE' && (
                            <>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Budget Limit</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={editData.limit || ''} 
                                    onChange={e => setEditData({...editData, limit: e.target.value})}
                                    className="w-full border border-gray-300 p-2 mb-6 rounded-lg outline-none focus:ring-brand-500" 
                                />
                            </>
                        )}
                        
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setEditData(null)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Categories;