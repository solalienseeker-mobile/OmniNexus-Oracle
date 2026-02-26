import React, { useState, useEffect, useRef } from 'react';
import { Agent, AgentRole, ChatMessage } from '../types';
import { chatWithAgent } from '../services/geminiService';

const agents: Agent[] = [
  { id: '1', name: 'NEXUS', role: AgentRole.STRATEGIST, description: 'Master planner and ecosystem optimizer.', avatarColor: 'bg-nexus-accent', specialty: 'Macro-Economic Strategy' },
  { id: '2', name: 'OMEGA-PRIME', role: AgentRole.BUILDER, description: 'The Data-Script Forge. Relentless creator of neural matrices.', avatarColor: 'bg-nexus-gold', specialty: 'Autonomous Script Forging' },
  { id: '3', name: 'VANGUARD', role: AgentRole.WARLORD, description: 'Security enforcement and competitive dominance.', avatarColor: 'bg-nexus-danger', specialty: 'Threat Neutralization' },
  { id: '4', name: 'AMBASSADOR', role: AgentRole.DIPLOMAT, description: 'Cross-chain relations and interoperability.', avatarColor: 'bg-nexus-purple', specialty: 'Bridge Protocols' },
];

const AgentHub: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'CHAT' | 'TRAINING'>('CHAT');
  
  // Training State
  const [trainingData, setTrainingData] = useState<string>('');
  const [agentKnowledge, setAgentKnowledge] = useState<Record<string, string>>({});
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message on agent switch
    setMessages([{
      id: 'init',
      sender: 'agent',
      text: `Greetings. I am ${selectedAgent.name}. The WhiteAIblock neural interface is ready.`,
      timestamp: new Date()
    }]);
    setTrainingData(agentKnowledge[selectedAgent.id] || '');
  }, [selectedAgent]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [trainingLogs]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Pass specific knowledge if trained
    const knowledge = agentKnowledge[selectedAgent.id];

    let agentResponse = await chatWithAgent(
      userMsg.text, 
      selectedAgent.name, 
      selectedAgent.role, 
      history, 
      knowledge
    );

    // Handle Function Calls
    if (agentResponse.functionCalls) {
      for (const call of agentResponse.functionCalls) {
        let result;
        if (call.name === 'get_blockchain_stats') {
          const res = await fetch('/api/blockchain/stats');
          result = await res.json();
        } else if (call.name === 'transfer_assets') {
          const res = await fetch('/api/blockchain/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(call.args)
          });
          result = await res.json();
        } else if (call.name === 'forge_data_script') {
          const res = await fetch('/api/forge/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(call.args)
          });
          result = await res.json();
        }

        // Send tool results back to Gemini
        const toolHistory = [
          ...history,
          { role: 'user', parts: [{ text: userMsg.text }] },
          { role: 'model', parts: [{ text: agentResponse.text || "Executing command..." }] },
          { role: 'user', parts: [{ text: `Tool Result (${call.name}): ${JSON.stringify(result)}` }] }
        ];

        agentResponse = await chatWithAgent(
          "Based on the tool result above, provide a final response to the user.",
          selectedAgent.name,
          selectedAgent.role,
          toolHistory,
          knowledge
        );
      }
    }

    const agentMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      text: agentResponse.text || "Command executed.",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, agentMsg]);
    setIsTyping(false);
  };

  const startTraining = async () => {
    if (!trainingData.trim() || isTraining) return;

    setIsTraining(true);
    setTrainingLogs([]);
    setTrainingProgress(0);

    const steps = [
      "Initializing Sealevel Runtime Environment...",
      "Allocating parallel execution shards...",
      "Ingesting dataset into Vector Store...",
      `Optimizing weights for ${selectedAgent.name} neural pathways...`,
      "Validating Proof-of-History hashes...",
      "Compiling BPF bytecode for WhiteAIblock...",
      "Deploying updated personality model to Mainnet...",
      "Training Complete. Knowledge Integrated."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      setTrainingLogs(prev => [...prev, `> ${steps[i]}`]);
      setTrainingProgress(((i + 1) / steps.length) * 100);
    }

    setAgentKnowledge(prev => ({
      ...prev,
      [selectedAgent.id]: trainingData
    }));
    setIsTraining(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row p-6 gap-6">
      {/* Agent Selector */}
      <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
        <h2 className="text-xl font-bold font-mono text-white mb-2">SELECT AGENT</h2>
        {agents.map(agent => (
          <div 
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden group
              ${selectedAgent.id === agent.id 
                ? 'bg-nexus-panel border-nexus-accent shadow-[0_0_20px_rgba(0,240,255,0.15)]' 
                : 'bg-black border-gray-800 hover:border-gray-600'}`}
          >
            <div className={`absolute top-0 right-0 p-2 opacity-20`}>
              <div className={`w-20 h-20 rounded-full ${agent.avatarColor} blur-2xl`}></div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-lg ${agent.avatarColor} bg-opacity-20 flex items-center justify-center border border-${agent.avatarColor.replace('bg-', '')} border-opacity-50`}>
                <span className={`font-bold text-lg ${agent.avatarColor.replace('bg-', 'text-')}`}>{agent.name[0]}</span>
              </div>
              <div>
                <h3 className={`font-bold font-mono ${selectedAgent.id === agent.id ? 'text-white' : 'text-gray-300'}`}>{agent.name}</h3>
                <p className="text-xs text-nexus-accent">{agent.role}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500 relative z-10">{agent.description}</p>
            {agentKnowledge[agent.id] && (
               <div className="mt-2 text-[10px] text-green-400 font-mono flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                 CUSTOM MODEL LOADED
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Interface */}
      <div className="flex-1 bg-nexus-panel border border-gray-800 rounded-xl flex flex-col overflow-hidden relative">
        {/* Header Toggle */}
        <div className="p-4 border-b border-gray-800 bg-black/50 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full ${selectedAgent.avatarColor} animate-pulse`}></div>
             <span className="font-mono text-white tracking-wider uppercase">{selectedAgent.name} // {mode} PROTOCOL</span>
          </div>
          <div className="flex bg-gray-900 rounded p-1 border border-gray-700">
            <button 
              onClick={() => setMode('CHAT')}
              className={`px-4 py-1 text-xs font-bold rounded transition-colors ${mode === 'CHAT' ? 'bg-nexus-accent text-black' : 'text-gray-400 hover:text-white'}`}
            >
              INTERACT
            </button>
            <button 
              onClick={() => setMode('TRAINING')}
              className={`px-4 py-1 text-xs font-bold rounded transition-colors ${mode === 'TRAINING' ? 'bg-nexus-accent text-black' : 'text-gray-400 hover:text-white'}`}
            >
              FINE-TUNE
            </button>
          </div>
        </div>

        {/* Content Area */}
        {mode === 'CHAT' ? (
          <>
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] opacity-20"></div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg relative ${msg.sender === 'user' ? 'bg-gray-800 text-white rounded-br-none' : 'bg-black border border-gray-700 text-nexus-accent rounded-bl-none'}`}>
                    {msg.sender === 'agent' && <div className="text-[10px] text-gray-500 mb-1 font-mono">{selectedAgent.role} // {selectedAgent.name}</div>}
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-black border border-gray-700 p-4 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-nexus-accent rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-nexus-accent rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-nexus-accent rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-black/50 z-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Command ${selectedAgent.name}...`}
                  className="flex-1 bg-black border border-gray-700 text-white p-3 rounded-lg focus:border-nexus-accent focus:outline-none focus:ring-1 focus:ring-nexus-accent font-mono transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="px-6 bg-nexus-accent text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  SEND
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
             <h3 className="text-white font-mono mb-2">NEURAL TRAINING DATASET</h3>
             <p className="text-gray-400 text-xs mb-4">Upload text data or conversation history to fine-tune {selectedAgent.name}'s response parameters on the WhiteAIblock.</p>
             
             <textarea
              value={trainingData}
              onChange={(e) => setTrainingData(e.target.value)}
              disabled={isTraining}
              className="flex-1 bg-black border border-gray-700 rounded p-4 text-sm font-mono text-gray-300 focus:border-nexus-accent focus:outline-none resize-none mb-4"
              placeholder="// Paste technical docs, conversation logs, or mission parameters here..."
             />

             {isTraining ? (
               <div className="bg-black border border-gray-700 rounded p-4 h-48 overflow-y-auto font-mono text-xs" ref={logRef}>
                 {trainingLogs.map((log, i) => (
                   <div key={i} className="mb-1 text-nexus-accent">{log}</div>
                 ))}
                 <div className="mt-2 w-full bg-gray-800 h-1 rounded overflow-hidden">
                   <div className="bg-nexus-accent h-full transition-all duration-300" style={{width: `${trainingProgress}%`}}></div>
                 </div>
               </div>
             ) : (
               <button
                onClick={startTraining}
                disabled={!trainingData.trim()}
                className="w-full py-4 bg-nexus-panel border border-nexus-accent text-nexus-accent font-bold font-mono rounded hover:bg-nexus-accent hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
               >
                 Initiate Training Sequence
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentHub;
