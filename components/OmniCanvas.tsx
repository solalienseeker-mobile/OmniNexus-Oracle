import React, { useState, useRef, useCallback } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { IconUpload, IconWand } from './Icons';
import { ImageEditState } from '../types';

const OmniCanvas: React.FC = () => {
  const [state, setState] = useState<ImageEditState>({
    originalImage: null,
    generatedImage: null,
    prompt: '',
    isLoading: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip prefix for API usage, keep for display
        // The API wants just the base64 data, but our helper strips it? 
        // Actually, my helper expects plain base64 without prefix in the `data` field, 
        // but `reader.result` includes `data:image/png;base64,`.
        // Let's store the full string for display and parse it for the API.
        setState((prev) => ({
          ...prev,
          originalImage: base64String,
          generatedImage: null,
          error: null,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!state.originalImage || !state.prompt) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Clean base64 string
      const base64Data = state.originalImage.split(',')[1];
      // Get mime type
      const mimeType = state.originalImage.substring(
        state.originalImage.indexOf(':') + 1,
        state.originalImage.indexOf(';')
      );

      const resultBase64 = await editImageWithGemini(base64Data, mimeType, state.prompt);
      
      setState((prev) => ({
        ...prev,
        generatedImage: `data:image/png;base64,${resultBase64}`,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to process image. Ensure API Key is valid and image is supported.",
      }));
    }
  }, [state.originalImage, state.prompt]);

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wider font-mono">OMNI-CANVAS <span className="text-nexus-accent text-sm ml-2">v2.5</span></h2>
          <p className="text-gray-400 mt-1">Neural Image Editor / Powered by Gemini Nano Banana</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
        {/* Input Zone */}
        <div className="bg-nexus-panel rounded-xl border border-gray-800 p-4 flex flex-col relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-dark to-nexus-accent opacity-50"></div>
          <h3 className="text-nexus-accent font-mono mb-4 text-sm uppercase tracking-widest">Source Input</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg bg-black/40 hover:border-nexus-accent transition-colors cursor-pointer relative"
               onClick={() => fileInputRef.current?.click()}>
            
            {state.originalImage ? (
              <img 
                src={state.originalImage} 
                alt="Original" 
                className="max-h-full max-w-full object-contain rounded"
              />
            ) : (
              <div className="text-center p-6">
                <IconUpload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">Click to upload source matrix</p>
                <p className="text-xs text-gray-600 mt-2">Supports PNG, JPEG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Neural Prompt</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={state.prompt}
                onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="E.g., 'Make it cyberpunk', 'Add a neon crown'..."
                className="flex-1 bg-black border border-gray-700 rounded p-3 text-white focus:border-nexus-accent focus:outline-none focus:ring-1 focus:ring-nexus-accent transition-all font-mono"
              />
              <button
                onClick={handleGenerate}
                disabled={!state.originalImage || !state.prompt || state.isLoading}
                className={`px-6 py-2 rounded font-bold text-black flex items-center gap-2 transition-all
                  ${(!state.originalImage || !state.prompt || state.isLoading) 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-nexus-accent hover:bg-white hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]'}`}
              >
                {state.isLoading ? (
                   <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <IconWand className="w-5 h-5" />
                    DEPLOY
                  </>
                )}
              </button>
            </div>
            {state.error && (
              <p className="text-nexus-danger text-xs font-mono mt-1">{state.error}</p>
            )}
          </div>
        </div>

        {/* Output Zone */}
        <div className="bg-nexus-panel rounded-xl border border-gray-800 p-4 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-purple to-nexus-dark opacity-50"></div>
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-nexus-purple font-mono text-sm uppercase tracking-widest">Neural Output</h3>
              {state.generatedImage && (
                <a href={state.generatedImage} download="omni-edit.png" className="text-xs text-gray-400 hover:text-white underline">
                  Download Asset
                </a>
              )}
           </div>

           <div className="flex-1 flex items-center justify-center bg-black/40 rounded-lg border border-gray-800 relative">
             {state.isLoading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                 <div className="w-16 h-16 border-4 border-nexus-accent border-t-transparent rounded-full animate-spin"></div>
                 <p className="mt-4 text-nexus-accent animate-pulse font-mono">PROCESSING NEURAL NETWORK...</p>
               </div>
             )}
             
             {state.generatedImage ? (
               <img 
                src={state.generatedImage} 
                alt="Generated" 
                className="max-h-full max-w-full object-contain rounded shadow-[0_0_30px_rgba(188,19,254,0.2)]"
              />
             ) : (
               <div className="text-center text-gray-600 font-mono">
                 <p className="text-6xl mb-4 opacity-20">❖</p>
                 <p>Waiting for deployment...</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OmniCanvas;
