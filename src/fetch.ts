import axios, { AxiosPromise } from 'axios';

export class FetchData {
  handleError = (err: string) => {
    console.error(`Fetch Error: ${err}`);
    throw new Error();
  }

  /**
   * Fetches data from endpoint param provided
   *
   * @param  {string} endpoint
   * @returns Promise
   */
  async fetch(endpoint: string): Promise<AxiosPromise | null> {
    try {
      const response = await axios.get(endpoint, {
        auth: {
          username: 'Shopify',
          password: 'Independents',
        },
      });

      if (response.status !== 200) {
        this.handleError('Non 200 status returned');
      }

      return response.data;
    } catch (err) {
      this.handleError(err);
      return null;
    }
  }
}
