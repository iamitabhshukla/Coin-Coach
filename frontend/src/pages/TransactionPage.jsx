import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function TransactionPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ description: '', amount: '', type: 'expense', category: '', date: '' });
    const [editId, setEditId] = useState(null);

    const { user } = useAuth();
    const { currency } = useCurrency();
    const isReadOnly = user?.role === 'read-only';

    const fetchTransactions = useCallback(async () => {
        try {
            const { data } = await api.get(`/transactions?page=${page}&limit=10`);
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    const handleEdit = (t) => {
        setFormData({
            description: t.description,
            amount: t.amount,
            type: t.type,
            // Handle nested category object or ID
            category: t.Category ? t.Category.name : t.category || '',
            date: t.date ? t.date.split('T')[0] : ''
        });
        setEditId(t.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/transactions/${editId}`, formData);
            } else {
                await api.post('/transactions', formData);
            }
            setShowForm(false);
            setEditId(null);
            setFormData({ description: '', amount: '', type: 'expense', category: '', date: '' });
            fetchTransactions();
        } catch (err) {
            alert('Operation failed');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Transactions</h2>
                    {!isReadOnly && (
                        <button onClick={() => { setShowForm(!showForm); setEditId(null); }}>
                            {showForm ? 'Close Form' : 'Add Transaction'}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="form-card">
                        <h3>{editId ? 'Edit' : 'Add'} Transaction</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <input placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                            <input placeholder="Category (e.g. Food)" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                            <button type="submit" style={{ gridColumn: 'span 2' }}>Save</button>
                        </form>
                    </div>
                )}

                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: '#eee' }}>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Amount</th>
                                {!isReadOnly && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                    <td>{t.description}</td>
                                    <td>{t.Category?.name}</td>
                                    <td style={{ color: t.type === 'income' ? 'green' : 'red' }}>{t.type}</td>
                                    <td>{currency.symbol}{t.amount}</td>
                                    {!isReadOnly && (
                                        <td>
                                            <button onClick={() => handleEdit(t)} style={{ marginRight: '1rem', background: '#f0ad4e', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Edit</button>
                                            <button onClick={() => handleDelete(t.id)} style={{ background: '#d9534f', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}>Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}>Next</button>
                </div>
            </div>
        </>
    );
}
