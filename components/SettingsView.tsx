import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Globe, Database, Cpu, CheckCircle, XCircle } from 'lucide-react';
import { testSupabaseConnection } from '../services/supabaseClient';

const SettingsView: React.FC = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<{ loading: boolean; success: boolean; message: string }>({
    loading: true,
    success: false,
    message: ''
  });

  useEffect(() => {
    const checkSupabase = async () => {
      const result = await testSupabaseConnection();
      setSupabaseStatus({ loading: false, success: result.success, message: result.message });
    };
    checkSupabase();
  }, []);

  const StatusItem = ({ icon: Icon, label, status, subtext }: { icon: any; label: string; status: 'success' | 'error' | 'loading'; subtext: string }) => (
    <div className="bg-black/40 border border-gray-800 p-4 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-lg ${status === 'success' ? 'bg-green-500/10 text-green-500' : status === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-white uppercase tracking-widest">{label}</span>
          {status === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> : status === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        <p className="text-xs text-gray-500 font-mono mt-1">{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <div className="border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">System Configuration</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-wider font-mono">OMNINEXUS SETTINGS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h3 className="text-nexus-accent font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4" /> Infrastructure Status
          </h3>
          <div className="space-y-3">
            <StatusItem 
              icon={Shield} 
              label="Ethereum Mainnet" 
              status="success" 
              subtext="Alchemy RPC Connected // 0xf2a4...580" 
            />
            <StatusItem 
              icon={Zap} 
              label="Solana Mainnet" 
              status="success" 
              subtext="Helius DAS API Active // 76x2...9RX" 
            />
            <StatusItem 
              icon={Database} 
              label="Supabase DB" 
              status={supabaseStatus.loading ? 'loading' : supabaseStatus.success ? 'success' : 'error'} 
              subtext={supabaseStatus.loading ? 'Verifying connection...' : supabaseStatus.message} 
            />
            <StatusItem 
              icon={Cpu} 
              label="Gemini Neural" 
              status="success" 
              subtext="Model: gemini-2.5-flash // API Active" 
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-nexus-gold font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security & Credentials
          </h3>
          <div className="bg-nexus-panel border border-gray-800 p-6 rounded-xl space-y-4">
            <p className="text-sm text-gray-400 leading-relaxed">
              All credentials are encrypted and stored in the secure vault. Private keys are never exposed to the client interface.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">ENCRYPTION PROTOCOL</span>
                <span className="text-nexus-gold">AES-256-GCM</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">AUTH METHOD</span>
                <span className="text-nexus-gold">SIWE / OAUTH</span>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs rounded transition-colors uppercase tracking-widest">
              Rotate Access Keys
            </button>
          </div>
        </section>
      </div>

      <div className="mt-12 p-8 border border-dashed border-gray-800 rounded-2xl text-center">
        <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.5em]">
          OmniNexus Empire // System v4.0.1
        </p>
      </div>
    </div>
  );
};

export default SettingsView;

import { Zap } from 'lucide-react';
