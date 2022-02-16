import axios from 'axios';

export default function handler(req, res) {
  const { address, offset, limit } = req.query;

  axios
    .get('https://api.opensea.io/api/v1/assets', {
      headers: {
        Accept: 'application/json',
        'X-API-KEY': process.env.OPENSEA_API_KEY
      },
      params: {
        order_direction: 'desc',
        owner: address,
        offset,
        limit
      }
    })
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
}