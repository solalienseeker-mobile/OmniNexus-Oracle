import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Sword, Globe, Plus, Cpu, Database, ChevronRight, Wallet, Activity } from 'lucide-react';

interface Empire {
  id: number;
  empireId: string;
  owner: string;
  chain: string;
  nftAddress: string;
  level: string;
  resources: any;
  buildings: any;
  status: string;
  txHash: string;
  createdAt: string;
}

const EmpireSpawnerView: React.FC = () => {
  const [empires, setEmpires] = useState<Empire[]>([]);
  const [wallets, setWallets] = useState<{ solana: string; ethereum: string; evmPrivateKey: string } | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isSpawning, setIsSpawning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchEmpires();
    fetchWallets();
  }, []);

  useEffect(() => {
    if (wallets?.solana) {
      fetchSolBalance(wallets.solana);
    }
  }, [wallets]);

  const fetchEmpires = async () => {
    try {
      const res = await fetch('/api/empire/list');
      const data = await res.json();
      setEmpires(data);
    } catch (err) {
      addLog("Error fetching empires.");
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/empire/wallets');
      const data = await res.json();
      setWallets(data);
    } catch (err) {
      addLog("Error fetching wallets.");
    }
  };

  const fetchSolBalance = async (address: string) => {
    try {
      const res = await fetch(`/api/solana/balance/${address}`);
      const data = await res.json();
      setSolBalance(data.balance);
    } catch (err) {
      console.error("Error fetching SOL balance:", err);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleSpawn = async (chain: 'solana' | 'ethereum') => {
    setIsSpawning(true);
    addLog(`Initiating gasless spawn sequence on ${chain.toUpperCase()}...`);
    
    const traits = {
      hash: Math.random().toString(36).substring(2, 10),
      attributes: [
        { trait_type: 'Strength', value: Math.floor(Math.random() * 100) },
        { trait_type: 'Defense', value: Math.floor(Math.random() * 100) },
        { trait_type: 'Magic', value: Math.floor(Math.random() * 100) }
      ]
    };

    try {
      const res = await fetch('/api/empire/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chain, traits })
      });
      
      if (!res.ok) throw new Error("Spawn failed");
      
      const data = await res.json();
      addLog(`Empire spawned successfully: ${data.empire.empireId}`);
      addLog(`TX Hash: ${data.spawnResult.tx}`);
      fetchEmpires();
      if (wallets?.solana) fetchSolBalance(wallets.solana);
    } catch (err) {
      addLog(`Spawn failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSpawning(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden bg-black/20">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-nexus-accent animate-pulse" />
            <span className="text-nexus-accent font-mono text-xs tracking-widest uppercase">Gasless Empire Spawner // v1.0.0</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wider font-mono uppercase">Empire Command Center</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/40 border border-gray-800 px-4 py-2 rounded-lg flex items-center gap-3">
            <Wallet className="w-4 h-4 text-gray-500" />
            <div className="text-[10px] font-mono">
              <div className="text-gray-500 uppercase flex justify-between items-center gap-4">
                <span>SOLANA_NODE</span>
                {solBalance !== null && (
                  <span className="text-nexus-accent font-bold">{solBalance.toFixed(4)} SOL</span>
                )}
              </div>
              <div className="text-nexus-accent truncate w-32">{wallets?.solana || 'GENERATING...'}</div>
            </div>
          </div>
          <div className="bg-black/40 border border-gray-800 px-4 py-2 rounded-lg flex items-center gap-3">
            <Shield className="w-4 h-4 text-gray-500" />
            <div className="text-[10px] font-mono">
              <div className="text-gray-500 uppercase">EVM_NODE</div>
              <div className="text-nexus-gold truncate w-32">{wallets?.ethereum || 'GENERATING...'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Empire List */}
        <div className="w-2/3 flex flex-col gap-4 overflow-hidden">
          <div className="bg-nexus-panel border border-gray-800 rounded-xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/30">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Active Empires</span>
              </div>
              <span className="text-[10px] font-mono text-gray-600">{empires.length} UNITS_DETECTED</span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-nexus-panel z-10">
                  <tr className="border-b border-gray-800 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    <th className="p-4 font-normal">Empire ID</th>
                    <th className="p-4 font-normal">Chain</th>
                    <th className="p-4 font-normal">Level</th>
                    <th className="p-4 font-normal">Resources</th>
                    <th className="p-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {empires.map((empire) => (
                    <tr key={empire.id} className="border-b border-gray-900 hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="text-white group-hover:text-nexus-accent transition-colors">{empire.empireId}</div>
                        <div className="text-[9px] text-gray-600 truncate w-32">{empire.txHash}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${empire.chain === 'solana' ? 'bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20' : 'bg-nexus-gold/10 text-nexus-gold border border-nexus-gold/20'}`}>
                          {empire.chain}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">LVL_{empire.level}</td>
                      <td className="p-4">
                        <div className="flex gap-2 text-[9px]">
                          <span className="text-nexus-gold">G:{empire.resources?.gold || 0}</span>
                          <span className="text-nexus-accent">W:{empire.resources?.wood || 0}</span>
                          <span className="text-gray-500">S:{empire.resources?.stone || 0}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${empire.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-nexus-gold'}`}></div>
                          <span className="uppercase text-[10px]">{empire.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {empires.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-600 italic">
                        No empires detected in the current matrix.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Controls & Logs */}
        <div className="w-1/3 flex flex-col gap-6 overflow-hidden">
          {/* Spawner Controls */}
          <div className="bg-nexus-panel border border-gray-800 rounded-xl p-6 space-y-6">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-2">Spawner Protocols</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleSpawn('solana')}
                disabled={isSpawning}
                className="w-full group relative overflow-hidden bg-nexus-accent/10 border border-nexus-accent/30 hover:bg-nexus-accent/20 p-4 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-nexus-accent/20 rounded-lg text-nexus-accent">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">Spawn Solana Empire</div>
                      <div className="text-[9px] text-nexus-accent/70 font-mono">GASLESS_VIA_HELIUS</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-nexus-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => handleSpawn('ethereum')}
                disabled={isSpawning}
                className="w-full group relative overflow-hidden bg-nexus-gold/10 border border-nexus-gold/30 hover:bg-nexus-gold/20 p-4 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-nexus-gold/20 rounded-lg text-nexus-gold">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">Spawn EVM Empire</div>
                      <div className="text-[9px] text-nexus-gold/70 font-mono">GASLESS_VIA_BICONOMY</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-nexus-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="p-4 bg-black/40 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">Relayer Status</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] text-gray-600 uppercase">Latency</div>
                  <div className="text-xs font-mono text-green-500">14ms</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-600 uppercase">Success Rate</div>
                  <div className="text-xs font-mono text-green-500">99.9%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="flex-1 bg-black border border-gray-800 rounded-xl p-4 font-mono text-[10px] overflow-hidden flex flex-col">
            <div className="text-gray-600 mb-3 uppercase tracking-widest border-b border-gray-900 pb-2 flex justify-between">
              <span>Relayer Logs</span>
              <span className="animate-pulse">● LIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="text-gray-400 border-l border-gray-800 pl-2 py-0.5">
                  <span className="text-nexus-accent opacity-50 mr-2">❯</span>{log}
                </div>
              ))}
              {logs.length === 0 && <div className="text-gray-800 italic">Waiting for signal...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Spawning Overlay */}
      <AnimatePresence>
        {isSpawning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="w-32 h-32 border-2 border-nexus-accent/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-t-2 border-nexus-accent rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-12 h-12 text-nexus-accent animate-pulse" />
              </div>
            </div>
            <div className="mt-12 text-center space-y-2">
              <h3 className="text-nexus-accent font-mono text-lg tracking-[0.5em] animate-pulse uppercase">Forging Empire</h3>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Rewriting matrix protocols...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmpireSpawnerView;
