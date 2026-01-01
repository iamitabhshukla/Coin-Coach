import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export default function RightSidebar({ overview }) {
    const { currency, setCurrency } = useCurrency();

    // Savings Goal State
    const [goal, setGoal] = useState(() => localStorage.getItem('savingsGoal') || '');
    const [goalDate, setGoalDate] = useState(() => localStorage.getItem('savingsDate') || '');
    const [goalProgress, setGoalProgress] = useState(0);

    // Bill Reminders State
    const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('bills') || '[]'));
    const [newBill, setNewBill] = useState('');
    const [billDate, setBillDate] = useState('');

    const currencies = [
        { code: 'USD', symbol: '$' },
        { code: 'INR', symbol: '₹' },
        { code: 'EUR', symbol: '€' }
    ];

    const handleCurrencyChange = (e) => {
        const selected = currencies.find(c => c.code === e.target.value);
        setCurrency(selected);
    };

    // Updates for Savings
    const saveGoal = () => {
        localStorage.setItem('savingsGoal', goal);
        localStorage.setItem('savingsDate', goalDate);
        alert('Goal Saved!');
    };

    useEffect(() => {
        if (goal && overview) {
            // Simple calc: balance / goal * 100
            const balance = parseFloat(overview.balance) || 0;
            const target = parseFloat(goal) || 1;
            const percent = Math.min(100, Math.max(0, (balance / target) * 100));
            setGoalProgress(percent);
        }
    }, [goal, overview]);

    // Updates for Bills
    const addBill = () => {
        if (!newBill || !billDate) return;
        const updated = [...bills, { name: newBill, date: billDate, id: Date.now() }];
        setBills(updated);
        localStorage.setItem('bills', JSON.stringify(updated));
        setNewBill('');
        setBillDate('');
    };

    const removeBill = (id) => {
        const updated = bills.filter(b => b.id !== id);
        setBills(updated);
        localStorage.setItem('bills', JSON.stringify(updated));
    };

    // Fun Tip
    const [todayTip] = useState(() => {
        const tips = [
            "Save before you spend, not after.",
            "Track every expense to find leaks in your budget.",
            "Invest early to benefit from compounding.",
            "Avoid unnecessary debt; interest works both ways.",
            "Set financial goals and review them monthly."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Currency Selector */}
            <div className="card" style={{ textAlign: 'center' }}>
                <label>Currency: </label>
                <select
                    value={currency.code}
                    onChange={handleCurrencyChange}
                    style={{ width: 'auto', display: 'inline-block', marginBottom: 0 }}
                >
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>
                    ))}
                </select>
            </div>

            {/* Savings Goal */}
            <div className="card" style={{ background: '#f0f9ff' }}>
                <h3 style={{ marginTop: 0, textAlign: 'center' }}>Savings Goal</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Goal Amount"
                        value={goal}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Allow only positive numbers (integers or decimals)
                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                setGoal(val);
                            }
                        }}
                        style={{ marginBottom: 0 }}
                    />
                    <input
                        type="date"
                        value={goalDate}
                        onChange={e => setGoalDate(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                    <button onClick={saveGoal} style={{ whiteSpace: 'nowrap', padding: '0.5rem' }}>Set Goal</button>
                </div>

                {/* Progress Bar */}
                <div style={{ background: '#ddd', borderRadius: '10px', height: '20px', width: '100%', overflow: 'hidden' }}>
                    <div style={{
                        background: '#4caf50',
                        height: '100%',
                        width: `${goalProgress}%`,
                        transition: 'width 0.5s'
                    }} />
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    {goalProgress.toFixed(1)}% of goal reached (Balance: {currency.symbol}{overview?.balance || 0})
                </p>
            </div>

            {/* Bill Reminders */}
            <div className="card" style={{ background: '#fff9c4' }}>
                <h3 style={{ marginTop: 0, textAlign: 'center' }}>Bill Reminders</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        placeholder="Bill Name"
                        value={newBill}
                        onChange={e => setNewBill(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                    <input
                        type="date"
                        value={billDate}
                        onChange={e => setBillDate(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                    <button onClick={addBill} style={{ whiteSpace: 'nowrap', padding: '0.5rem' }}>Add</button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {bills.map(b => (
                        <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd7', padding: '0.5rem 0' }}>
                            <span>{b.name} ({b.date})</span>
                            <button onClick={() => removeBill(b.id)} style={{ background: 'transparent', color: 'red', border: 'none', padding: 0 }}>×</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Today's Wisdom */}
            <div className="card" style={{ background: '#e0f2f1', textAlign: 'center' }}>
                <h3 style={{ marginTop: 0 }}>Today's Wisdom 💡</h3>
                <p style={{ fontStyle: 'italic', fontWeight: '500' }}>"{todayTip}"</p>
            </div>

        </div>
    );
}
