# OmniNexus Empire: Autonomous Agentic State Machine

> **Status**: Production-Ready // Colosseum Hackathon v1.8.0
> **Architecture**: Hybrid EVM/Solana State Machine
> **Core Engine**: RALPH (Recursive Autonomous Logic & Protocol Handler)

OmniNexus Empire is a decentralized, autonomous empire-building simulation powered by advanced agentic workflows. It leverages Solana's high-throughput state settlement and EVM's robust smart contract ecosystem to create a persistent, cross-chain agentic environment.

## 🚀 Technical Highlights

- **RALPH Loop**: A recursive autonomous logic handler that manages state transitions, resource allocation, and strategy execution with sub-second latency.
- **Gasless Spawning**: Integrated Biconomy Account Abstraction and Helius DAS for frictionless user onboarding and asset management.
- **Chainlink Oracles**: Real-time ETH/USD price feeds integrated directly into the agent's decision-making matrix.
- **Neural Fine-Tuning**: Dynamic agent personality shifts based on on-chain events and user interactions.
- **Zk-Compression**: Optimized NFT state storage on Solana using zk-compressed account data.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js (Express), Drizzle ORM, PostgreSQL (Supabase).
- **Blockchain**: 
  - **Solana**: @solana/web3.js, Helius SDK, Wallet Adapter.
  - **EVM**: Ethers.js v6, Biconomy SDK.
- **AI**: Google Gemini 3.1 Pro (Reasoning), Gemini 2.5 Flash (Real-time).

## 📦 Project Structure

```bash
├── src/
│   ├── components/       # Atomic UI Components & Views
│   ├── services/         # Blockchain & AI Integration Logic
│   ├── types.ts          # Global Type Definitions
│   └── App.tsx           # Main Application Entry
├── server/
│   ├── routes.ts         # API Endpoints & Oracle Integration
│   ├── storage.ts        # Database Persistence Layer
│   └── schema.ts         # Drizzle Database Schema
└── metadata.json         # App Permissions & Metadata
```

## 🔧 Developer Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your secrets.
   - `ETH_PRIVATE_KEY`: Ethereum signer private key (0x...)
   - `ALCHEMY_API_KEY`: For Chainlink price feeds.
   - `HELIUS_API_KEY`: For Helius API.
   - `HELIUS_HTTP_URL`: e.g. `https://beta.helius-rpc.com/?api-key=...`
   - `SOLANA_PRIVATE_KEY`: Solana signer private key / keypair.
   - `SOLANA_SIGNER_ADDRESS`: Your Solana signer address.
   - `SOLANA_TREASURY`: Treasury wallet address.
   - `BICONOMY_PROJECT_API`: Biconomy project API key.
   - `BICONOMY_PROJECT_ID`: Biconomy project ID.
   - `GEMINI_API_KEY`: For agent reasoning.
   - `MORALIS_API_KEY`: For optional RPC fallback.
   - `DATABASE_URL`: PostgreSQL connection string.

   Important:
   - `.env` is in `.gitignore` and should not be tracked.
   - Commit only `.env.example` with placeholders.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🧩 Colosseum Copilot Skill Integration (Optional)

1. **Set up PAT and API base** (in shell, then add to `.bashrc`/`.zshrc`):
   ```bash
   export COLOSSEUM_COPILOT_API_BASE="https://copilot.colosseum.com/api/v1"
   export COLOSSEUM_COPILOT_PAT="your-token-here"
   ```

2. **Install Colosseum skill**:
   ```bash
   npx skills add ColosseumOrg/colosseum-copilot --scope project --yes
   npx skills list
   ```

3. **Verify auth**:
   ```bash
   curl "$COLOSSEUM_COPILOT_API_BASE/status" \
     -H "Authorization: Bearer $COLOSSEUM_COPILOT_PAT"
   ```
   Expected JSON: `{ "authenticated": true, "expiresAt": "...", "scope": "..." }`

4. **Sample query**:
   Ask the assistant:
   - "What Solana hackathon projects have worked on gasless transactions?"
   - "I want to build a privacy-preserving stablecoin on Solana. Vet this idea."

## 🧠 Autonomous Self-Learning (Ollama)

1. Set Ollama host and model (cloud or local):
   ```bash
   export OLLAMA_HOST="https://your-ollama-free-cloud-host"
   export OLLAMA_MODEL="llama2"
   ```

2. Call self-learn endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/agent/selflearn \
     -H "Content-Type: application/json" \
     -d '{"guidance": "Improve fee collection and risk mitigation"}'
   ```

3. Observe returned insight and confirm logs in `/api/agent/logs`.

## 📜 High-Level Prompt (The Developer Vision)

"Build a system that doesn't just respond, but *exists*. OmniNexus is an experiment in persistent agentic state. By combining the deterministic nature of blockchain with the probabilistic reasoning of LLMs, we've created an entity that manages its own treasury, spawns its own assets, and evolves its own strategy. It is the first step towards a truly autonomous on-chain economy."

---
*Built for the Colosseum Agent Hackathon. $100k Prize Pool.*
