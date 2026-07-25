import { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext();

// Fallback rates just in case the user is offline
const fallbackRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094 };

const currencySymbols = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', JPY: '¥'
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('INR');
    const [rates, setRates] = useState(fallbackRates);
    const [availableCurrencies, setAvailableCurrencies] = useState(Object.keys(fallbackRates));

    // Fetch live market rates when the app loads
    useEffect(() => {
        const fetchLiveRates = async () => {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/INR');
                const data = await response.json();
                
                // Filter down to a curated list so the dropdown isn't 150 items long
                const allowed = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];
                const filteredRates = {};
                
                allowed.forEach(code => {
                    if (data.rates[code]) filteredRates[code] = data.rates[code];
                });

                setRates(filteredRates);
                setAvailableCurrencies(allowed);
            } catch (error) {
                console.error("Failed to fetch live rates, using fallback.", error);
            }
        };

        fetchLiveRates();
    }, []);

    const convert = (amount) => {
        if (!amount) return "0.00";
        return (amount * rates[currency]).toFixed(2);
    };

    const symbol = currencySymbols[currency] || currency + " ";

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convert, symbol, availableCurrencies }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);