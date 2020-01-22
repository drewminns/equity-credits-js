import axios, { AxiosPromise } from 'axios';
import { GroupData } from './shared/interface';

export class FetchData {

  /**
   * Fetches data from endpoint param provided
   *
   * @param  {string} endpoint
   * @returns Promise
   */
  fetch = async (endpoint: string): Promise<GroupData[]> => {
    try {
      const response = await axios.get(endpoint, {
        auth: {
          username: 'Shopify',
          password: 'Independents',
        },
      });

      if (response.status !== 200) {
        console.error('Non 200 status returned');
        throw new Error();
      }

      return response.data;
    } catch (err) {
      console.error(`Fetch Error: ${err}`);
      throw new Error();
    }
  }
}
