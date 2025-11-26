// pages/api/opensea/get-nft-listing.js
import axios from 'axios';

// The NFT Contract Address and a placeholder for the Token ID of the Nation Pass
// In a real scenario, the Token ID might be dynamic. For now, we assume it's "1".
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NATION_PASS_CONTRACT_ADDRESS;
const NFT_TOKEN_ID = "1"; // Assuming a single, specific NFT for the pass
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!NFT_CONTRACT_ADDRESS || !OPENSEA_API_KEY) {
    return res.status(500).json({ message: 'Server configuration error: Missing OpenSea credentials.' });
  }

  const options = {
    method: 'GET',
    headers: {
      'x-api-key': OPENSEA_API_KEY,
    },
  };

  try {
    // 1. First, get the NFT details to find the collection slug
    const nftResponse = await axios.get(
      `https://api.opensea.io/api/v2/chain/base/contract/${NFT_CONTRACT_ADDRESS}/nfts/${NFT_TOKEN_ID}`,
      options
    );
    const collectionSlug = nftResponse.data.nft.collection;

    // 2. Then, use the collection slug to get the best listing
    const listingResponse = await axios.get(
      `https://api.opensea.io/api/v2/listings/collection/${collectionSlug}/best`,
      options
    );

    // Combine the NFT data with the listing data
    const responseData = {
        ...listingResponse.data.listings[0], // Get the first (best) listing
        nft: nftResponse.data.nft
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error fetching from OpenSea API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch listing from OpenSea.' });
  }
}
