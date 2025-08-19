/**
 * Bank service functions for fetching bank data from the API
 */

import api from '../../lib/axios';

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
  try {
    const response = await api.get('/api/countries');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Error fetching countries: ${error.response.status} ${error.response.statusText}`);
    }
    throw new Error('Network error while fetching countries');
  }
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
  
  try {
    const response = await api.get(`/api/banks/country/${countryCode}`);
    const data = response.data;
    
    // Map the API response to our internal format
    return data.map((bank: any) => ({
      id: bank._id,
      name: bank.bankName
    }));
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Error fetching banks: ${error.response.status} ${error.response.statusText}`);
    }
    throw new Error('Network error while fetching banks');
  }
}