import React from 'react';

interface BlueprintSectionProps {
  title: string;
  children?: React.ReactNode;
  color?: string;
}

const BlueprintSection = ({ title, children, color = 'nexus-accent' }: BlueprintSectionProps) => (
  <div className={`bg-nexus-panel border border-gray-800 p-6 rounded-xl relative overflow-hidden`}>
    <div className={`absolute top-0 left-0 w-1 h-full bg-${color}`}></div>
    <h3 className={`text-${color} font-mono text-sm uppercase tracking-widest mb-4 border-b border-gray-800 pb-2`}>
      {title}
    </h3>
    <div className="text-gray-300 font-sans text-sm md:text-base space-y-3 leading-relaxed">
      {children}
    </div>
  </div>
);

const ArchitectureBlueprint: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      <div className="border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-nexus-gold rounded-full animate-pulse"></div>
          <span className="text-nexus-gold font-mono text-xs uppercase tracking-[0.2em]">WhiteAIblock // SYSTEM SPECIFICATION</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-wider font-mono">WHITE-AI-BLOCK ARCHITECTURE</h2>
        <p className="text-gray-400 mt-1 font-mono text-xs">High-Performance Omni-Layer Protocol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Principles */}
        <BlueprintSection title="01 // Proof of History (PoH)" color="nexus-accent">
          <p>
            WhiteAIblock utilizes a cryptographically secure clock source across the network before consensus.
          </p>
          <ul className="list-disc pl-4 mt-2 space-y-2">
            <li><strong className="text-white">Verifiable Delay Functions (VDF):</strong> Sequential hashing provides a trustless passage of time.</li>
            <li><strong className="text-white">Sub-Second Finality:</strong> Blocks are produced every 400ms without communication overhead.</li>
          </ul>
        </BlueprintSection>

        {/* Runtime */}
        <BlueprintSection title="02 // Sealevel Parallel Runtime" color="nexus-gold">
          <p>
            Unlike single-threaded EVM chains, WhiteAIblock processes transactions in parallel.
          </p>
          <div className="mt-4 bg-black/40 p-3 rounded border border-gray-700 font-mono text-xs text-gray-400">
            {'>'} DETECTING_DEPENDENCIES...<br/>
            {'>'} SCHEDULING_THREADS: 65,535<br/>
            {'>'} EXECUTION_MODE: PARALLEL<br/>
            {'>'} STATE: NON_OVERLAPPING
          </div>
        </BlueprintSection>

        {/* Tokenomics */}
        <BlueprintSection title="03 // Tokenomics ($WAI)" color="nexus-purple">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-bold">Total Supply</span>
            <span className="font-mono text-nexus-purple">500,000,000 WAI</span>
          </div>
          <p className="text-sm">
            Native utility token for transaction fees, staking, and governance. Designed with a deflationary burn mechanism on every transaction.
          </p>
          <div className="space-y-2 mt-4">
             <div className="flex justify-between text-xs font-mono text-gray-500">
               <span>VALIDATOR STAKING</span>
               <span>60%</span>
             </div>
             <div className="w-full bg-gray-800 h-1 rounded">
               <div className="bg-nexus-purple w-[60%] h-full"></div>
             </div>
          </div>
        </BlueprintSection>

        {/* Smart Contracts */}
        <BlueprintSection title="04 // Pipeline Mechanism" color="nexus-danger">
          <p>
            Transaction Processing Unit (TPU) pipeline for aggressive optimization.
          </p>
          <ul className="list-square pl-4 mt-2 space-y-2">
            <li><span className="text-gray-400">Data Fetching:</span> Kernel level packet forwarding.</li>
            <li><span className="text-gray-400">Signature Verification:</span> Offloaded to GPU for massive scale.</li>
            <li><span className="text-gray-400">Banking:</span> Transactions are written to the ledger immediately.</li>
          </ul>
        </BlueprintSection>

      </div>
      
      <div className="mt-6 p-4 border border-dashed border-gray-700 rounded bg-black/50 text-center font-mono text-xs text-gray-500">
        // WHITE_AI_BLOCK // GENESIS_HASH: 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d
      </div>
    </div>
  );
};

export default ArchitectureBlueprint;
