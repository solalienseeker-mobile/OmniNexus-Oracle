import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import { storage } from "./storage";

class EmpireSpawner {
  private solWallet: Keypair;
  private evmWallet: ethers.HDNodeWallet;

  constructor() {
    this.solWallet = Keypair.generate();
    this.evmWallet = ethers.Wallet.createRandom();
  }

  getWallets() {
    return {
      solana: this.solWallet.publicKey.toString(),
      ethereum: this.evmWallet.address,
      evmPrivateKey: this.evmWallet.privateKey
    };
  }

  async spawnSolanaNFT(traits: any) {
    console.log('Spawning Solana NFT with traits:', traits);
    // Mocking gasless spawn via Helius
    return {
      success: true,
      tx: Math.random().toString(36).substring(7),
      mint: Keypair.generate().publicKey.toString()
    };
  }

  async spawnEVMNFT(traits: any) {
    console.log('Spawning EVM NFT with traits:', traits);
    // Mocking gasless spawn via Biconomy
    return {
      success: true,
      tx: Math.random().toString(36).substring(7),
      address: ethers.Wallet.createRandom().address
    };
  }

  async buildEmpire(spawnData: any) {
    const empireId = `EMP-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const empire = await storage.createEmpire({
      empireId,
      owner: spawnData.mint || spawnData.address,
      chain: spawnData.mint ? 'solana' : 'ethereum',
      nftAddress: spawnData.mint || spawnData.address,
      status: 'active',
      txHash: spawnData.tx,
      level: "1",
      resources: { gold: 100, wood: 100, stone: 100 },
      buildings: []
    });
    return empire;
  }
}

export const empireSpawner = new EmpireSpawner();
