// Currency conversion utilities
export interface MemexSolPrice {
  usd: number;
  lastUpdated: Date;
}

let cachedPrice: MemexSolPrice | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchMemexSolPrice = async (): Promise<number> => {
  // Check cache first
  if (cachedPrice && Date.now() - cachedPrice.lastUpdated.getTime() < CACHE_DURATION) {
    return cachedPrice.usd;
  }

  try {
    const response = await fetch('https://api.geckoterminal.com/api/v2/networks/solana/pools/5fxe95uBfY5kbACgr59zBTcCzAge5WGaAEDHebLBLhr4');
    const data = await response.json();
    
    // Extract price from the API response
    const priceUsd = parseFloat(data.data.attributes.base_token_price_usd);
    
    // Cache the price
    cachedPrice = {
      usd: priceUsd,
      lastUpdated: new Date()
    };
    
    return priceUsd;
  } catch (error) {
      console.error('Error fetching MEMEXSOL price:', error);
      // Fallback to a default price if API fails
      return 0.001; // Default fallback price
  }
};

export const convertUsdToMemexSol = async (usdAmount: number): Promise<number> => {
  const memexSolPriceInUsd = await fetchMemexSolPrice();
  if (memexSolPriceInUsd === 0) return 0;
  return usdAmount / memexSolPriceInUsd;
};

export const convertMemexSolToUsd = async (memexSolAmount: number): Promise<number> => {
  const memexSolPriceInUsd = await fetchMemexSolPrice();
  return memexSolAmount * memexSolPriceInUsd;
};

export const formatCurrency = (amount: number, currency: 'USD' | 'MEMEXSOL' = 'USD'): string => {
  // Ensure amount is a number to prevent unexpected formatting issues like leading zeros
  const numericAmount = Number(amount);

  // Handle NaN or Infinity cases gracefully
  if (isNaN(numericAmount) || !isFinite(numericAmount)) {
    return '0.00 MEMEXSOL'; // Fallback for invalid numbers
  }

  // Convert to string with 2 decimal places, then back to number to ensure clean numeric value
  const cleanedAmount = parseFloat(numericAmount.toFixed(2)); 

  let formattedString: string;

  if (currency === 'USD') {
    formattedString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cleanedAmount);
  } else {
    formattedString = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true, // Ensure thousands separator is used
    }).format(cleanedAmount);
  }

  // Aggressive removal of leading '0' if it's not part of a decimal (e.g., "0.50")
  // This targets cases like "01,412,038.11"
  if (formattedString.length > 1 && formattedString[0] === '0' && formattedString[1] !== ',' && formattedString[1] !== '.') {
    formattedString = formattedString.substring(1);
  }

  return formattedString + (currency === 'MEMEXSOL' ? ' MEMEXSOL' : '');
};
