import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [expenseGroups, setExpenseGroups] = useState([]);
    const { convert, symbol } = useCurrency();
    
    // Form State
    const [form, setForm] = useState({
        description: '', amount: '', nextBillingDate: '', frequency: 'MONTHLY', expenseGroupId: ''
    });

    const fetchData = async () => {
        try {
            const [subRes, groupRes] = await Promise.all([
                api.get('/subscriptions'),
                api.get('/expense-groups')
            ]);
            setSubscriptions(subRes.data);
            setExpenseGroups(groupRes.data);
            if (groupRes.data.length > 0) {
                setForm(f => ({ ...f, expenseGroupId: groupRes.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/subscriptions', {
                ...form,
                amount: parseFloat(form.amount)
            });
            setForm({ description: '', amount: '', nextBillingDate: '', frequency: 'MONTHLY', expenseGroupId: expenseGroups[0]?.id });
            fetchData();
        } catch (err) {
            alert("Failed to add subscription");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this auto-bill?")) return;
        try {
            await api.delete(`/subscriptions/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-offwhite py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Manage Subscriptions</h2>
                    <Link to="/dashboard" className="text-sm font-medium text-brand-600 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {/* Add New Subscription Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold mb-4">Add Auto-Bill</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Name</label>
                            <input type="text" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1 w-full p-2 border rounded-lg" placeholder="Netflix" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Amount</label>
                            <input type="number" step="0.01" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="mt-1 w-full p-2 border rounded-lg" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Start Date</label>
                            <input type="date" required value={form.nextBillingDate} onChange={e => setForm({...form, nextBillingDate: e.target.value})} className="mt-1 w-full p-2 border rounded-lg" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                            <select value={form.expenseGroupId} onChange={e => setForm({...form, expenseGroupId: e.target.value})} className="mt-1 w-full p-2 border rounded-lg bg-white">
                                {expenseGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" className="w-full bg-brand-600 text-white p-2 rounded-lg font-bold hover:bg-brand-700">Add Bill</button>
                        </div>
                    </form>
                </div>

                {/* Active Subscriptions List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Next Bill</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subscriptions.map(sub => (
                                <tr key={sub.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{symbol}{convert(sub.amount)} / {sub.frequency.toLowerCase()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600 font-bold">{new Date(sub.nextBillingDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:text-red-900 font-bold">Cancel</button>
                                    </td>
                                </tr>
                            ))}
                            {subscriptions.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No active subscriptions.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;