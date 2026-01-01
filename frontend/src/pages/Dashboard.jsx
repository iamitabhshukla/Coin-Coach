import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import RightSidebar from '../components/RightSidebar';
import { useCurrency } from '../context/CurrencyContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

export default function Dashboard() {
    const { currency } = useCurrency();
    const [overview, setOverview] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [trends, setTrends] = useState({});
    const [loading, setLoading] = useState(true);

    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ovRes, catRes, trRes, txRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/category'),
                    api.get('/analytics/trends'),
                    api.get('/transactions?limit=5')
                ]);
                setOverview(ovRes.data);
                setCategoryData(catRes.data);
                setTrends(trRes.data);
                setRecentTransactions(txRes.data.transactions);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    // Chart Data Prep
    const pieData = {
        labels: categoryData.map(c => c.category),
        datasets: [{
            data: categoryData.map(c => c.amount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    const trendLabels = Object.keys(trends);
    const lineData = {
        labels: trendLabels,
        datasets: [
            {
                label: 'Income',
                data: trendLabels.map(k => trends[k].income),
                borderColor: '#36A2EB',
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Expense',
                data: trendLabels.map(k => trends[k].expense),
                borderColor: '#FF6384',
                backgroundColor: '#FF6384',
            }
        ]
    };

    const barData = {
        labels: ['Total Financials'],
        datasets: [
            {
                label: 'Income',
                data: [overview?.income || 0],
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Expense',
                data: [overview?.expense || 0],
                backgroundColor: '#FF6384',
            }
        ]
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '0 2rem' }}>
                <h1>Financial Overview</h1>

                {/* Main Grid: Left (Analytics) | Right (Widgets) */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    {/* Left Column: Analytics */}
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ padding: '1rem', background: '#e3f2fd' }}>
                                <h3>Income</h3><p>{currency.symbol}{overview?.income}</p>
                            </div>
                            <div className="card" style={{ padding: '1rem', background: '#ffebee' }}>
                                <h3>Expense</h3><p>{currency.symbol}{overview?.expense}</p>
                            </div>
                            <div className="card" style={{ padding: '1rem', background: '#e8f5e9' }}>
                                <h3>Balance</h3><p>{currency.symbol}{overview?.balance}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="chart-card">
                                <h3>Expense by Category</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <div style={{ height: '300px', width: '50%' }}>
                                        <Pie
                                            data={pieData}
                                            options={{
                                                plugins: { legend: { display: false } },
                                                maintainAspectRatio: false
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '50%', paddingLeft: '1rem' }}>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {categoryData.map((cat, i) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                                                    <span style={{
                                                        width: '12px',
                                                        height: '12px',
                                                        backgroundColor: pieData.datasets[0].backgroundColor[i],
                                                        marginRight: '10px',
                                                        borderRadius: '50%',
                                                        display: 'inline-block'
                                                    }}></span>
                                                    <span style={{ fontWeight: '500' }}>{cat.category}</span>
                                                    <span style={{ marginLeft: 'auto', color: '#666' }}>{currency.symbol}{cat.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="chart-card">
                                <h3>Monthly Trends</h3>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <Bar data={lineData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false }} />
                                </div>
                            </div>
                            <div className="chart-card">
                                <h3>Income vs Expense</h3>
                                <div style={{ height: '300px', width: '100%' }}><Bar data={barData} /></div>
                            </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="card">
                            <h3>Recent Transactions</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', background: '#eee' }}>
                                        <th style={{ padding: '0.5rem' }}>Date</th>
                                        <th style={{ padding: '0.5rem' }}>Description</th>
                                        <th style={{ padding: '0.5rem' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '0.5rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                                            <td style={{ padding: '0.5rem' }}>{t.description}</td>
                                            <td style={{ padding: '0.5rem', color: t.type === 'income' ? 'green' : 'red' }}>
                                                {t.type === 'income' ? '+' : '-'}{currency.symbol}{t.amount}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentTransactions.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>No recent transactions</td></tr>}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* Right Column: Sidebar */}
                    <div>
                        <RightSidebar overview={overview} />
                    </div>

                </div>
            </div>
        </>
    );
}
