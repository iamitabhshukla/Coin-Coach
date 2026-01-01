import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            background: '#1a73e8',
            padding: '1rem 2rem',
            color: 'white',
            borderRadius: '0 0 8px 8px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Coin Coach 💰
                </Link>
                <Link to="/" style={{ color: '#e8f0fe', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/transactions" style={{ color: '#e8f0fe', textDecoration: 'none' }}>Transactions</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>Hello, {user?.name}</span>
                <button onClick={logout} style={{
                    width: 'auto',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white'
                }}>Logout</button>
            </div>
        </nav>
    );
}
