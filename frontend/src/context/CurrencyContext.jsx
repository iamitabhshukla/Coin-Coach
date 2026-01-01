import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    // Default to USD
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('currency');
        return saved ? JSON.parse(saved) : { symbol: '$', code: 'USD' };
    });

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
