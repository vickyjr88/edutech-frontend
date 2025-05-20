/**
 * Bank service functions for fetching bank data from the API
 */

interface Bank {
  id: string;
  name: string;
}

interface Country {
  code: string;
  name: string;
}

/**
 * Fetches the list of supported countries from the API
 * @returns Promise with an array of countries
 */
export async function fetchSupportedCountries(): Promise<Country[]> {
  const response = await fetch('/api/countries');
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON response but got ${contentType}`);
  }
  
  if (!response.ok) {
    throw new Error(`Error fetching countries: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Fetches the list of banks for a specific country
 * @param countryCode ISO country code (e.g., 'KE', 'US')
 * @returns Promise with an array of banks
 */
export async function fetchBanksForCountry(countryCode: string): Promise<Bank[]> {
  if (!countryCode) {
    return [];
  }
  
  const response = await fetch(`/api/banks/country/${countryCode}`);
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON response but got ${contentType}`);
  }
  
  if (!response.ok) {
    throw new Error(`Error fetching banks: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Map the API response to our internal format
  return data.map((bank: any) => ({
    id: bank._id,
    name: bank.bankName
  }));
}