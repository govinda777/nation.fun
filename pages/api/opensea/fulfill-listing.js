// pages/api/opensea/fulfill-listing.js
import { OpenSeaSDK, Network } from 'opensea-js';
import { ethers } from 'ethers';

// This API endpoint will securely use the OpenSea SDK to prepare a transaction.
// The frontend will then receive the transaction parameters and ask the user to sign.

const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;

// We need a provider with a private key to initialize the SDK on the backend.
// This wallet does not need to hold funds; it's used to sign API requests.
// IMPORTANT: In a real production environment, this should be a secure, dedicated wallet.
const provider = new ethers.JsonRpcProvider(process.env.BASE_MAINNET_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const seaport = new OpenSeaSDK(signer, {
  networkName: Network.Base,
  apiKey: OPENSEA_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { order, fulfillerAddress } = req.body;

  if (!order || !fulfillerAddress) {
    return res.status(400).json({ message: 'Missing order or fulfiller address in request body.' });
  }

  try {
    // The `fulfillOrder` method prepares the transaction needed to buy the NFT.
    // It returns the necessary transaction data for the user to sign on the frontend.
    const { actions } = await seaport.fulfillOrder({
      order,
      accountAddress: fulfillerAddress,
    });

    // We expect a single transaction action to fulfill the listing.
    const transaction = actions[0];
    const transactionParameters = await transaction.buildTransaction();

    res.status(200).json({ transactionParameters });

  } catch (error) {
    console.error('Error fulfilling OpenSea order:', error);
    res.status(500).json({ message: 'Failed to fulfill OpenSea order.' });
  }
}
