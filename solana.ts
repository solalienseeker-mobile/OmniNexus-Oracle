import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const HELIUS_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY || 'a24bbb32-39d5-4edd-aa84-e1af1fa4a05b'}`;
const connection = new Connection(HELIUS_URL);

export const TREASURY_WALLET = new PublicKey("76x25b6XWTwbm6MTBJtbFU1hFopBSDKsfmGC7MK929RX");

export async function getBalance(address: string) {
  try {
    const pubKey = new PublicKey(address);
    const balance = await connection.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

export async function getTreasuryBalance() {
  return await getBalance(TREASURY_WALLET.toString());
}

export async function getNetworkStatus() {
  try {
    const slot = await connection.getSlot();
    const version = await connection.getVersion();
    return {
      status: "online",
      slot,
      version: version["solana-core"],
    };
  } catch (error) {
    return { status: "offline", error: String(error) };
  }
}

export async function getRecentTransactions(address: string, limit = 10) {
  try {
    const pubKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
    return signatures;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
