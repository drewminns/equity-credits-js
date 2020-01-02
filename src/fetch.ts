import axios, {AxiosPromise} from 'axios';

export class FetchData {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  handleError(err: string) {
    console.error('Fetch Error: ' + err);
    throw new Error();
  }

  fetch = async () => {
    try {
      const response = await axios.get(this.endpoint, {
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
    }
  }
}