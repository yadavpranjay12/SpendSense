import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ManageCategories = () => {
    const [type, setType] = useState('expense'); // 'expense' or 'income'
    const [categories, setCategories] = useState([]);
    
    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch categories whenever the type toggle changes
    const fetchCategories = async () => {
        try {
            const endpoint = type === 'expense' ? '/expense-groups' : '/income-groups';
            const response = await api.get(endpoint);
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(`Failed to load ${type} categories.`);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [type]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = type === 'expense' ? '/expense-groups' : '/income-groups';
            await api.post(endpoint, { name, description });
            
            // Clear form and refresh the list
            setName('');
            setDescription('');
            fetchCategories();
        } catch (err) {
            setError(`Failed to create category. A category with this name might already exist.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-offwhite font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Manage Categories</h2>
                    <Link to="/dashboard" className="text-sm font-medium text-brand-600 hover:text-brand-500 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Type Toggle */}
                <div className="flex rounded-md shadow-sm mb-8 max-w-md">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 text-sm font-medium rounded-l-md border ${
                            type === 'expense' 
                            ? 'bg-brand-600 text-white border-brand-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Expense Categories
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
                        Income Categories
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Create New Category Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Create {type === 'expense' ? 'Expense' : 'Income'} Category
                        </h3>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                    placeholder="e.g., Dining Out"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                    placeholder="e.g., Restaurants and fast food"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : (type === 'expense' ? 'bg-brand-600 hover:bg-brand-500' : 'bg-green-600 hover:bg-green-500')
                                }`}
                            >
                                {loading ? 'Creating...' : 'Create Category'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: List Existing Categories */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Your Categories</h3>
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {categories.length === 0 ? (
                                <li className="px-6 py-4 text-gray-500 text-sm text-center">No categories found. Create one!</li>
                            ) : (
                                categories.map((category) => (
                                    <li key={category.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <p className="text-sm font-bold text-gray-900">{category.name}</p>
                                        {category.description && (
                                            <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageCategories;