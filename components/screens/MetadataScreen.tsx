import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { Button } from '../Button';

interface MetadataScreenProps {
    publicKey: PublicKey | null;
    mintPhoto: () => void;
    setScreen: (screen: any) => void;
}

export const MetadataScreen: React.FC<MetadataScreenProps> = ({
    publicKey,
    mintPhoto,
    setScreen,
}) => {
    return (
        <motion.div
            key="metadata"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 desk-bg flex flex-col items-center justify-center p-6"
        >
            <div className="w-full max-w-sm glass-panel p-10 rounded-[2.5rem] flex flex-col gap-8 text-[#2A2A2A]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-[#2A2A2A] rounded-2xl flex items-center justify-center shadow-lg">
                        <ShieldCheck size={24} className="text-[#F6F3EE]" />
                    </div>
                    <h3 className="text-3xl font-serif italic text-center mt-2">Verify Reality</h3>
                </div>

                <div className="space-y-6">
                    <p className="text-[10px] text-center text-[#A09E96] uppercase tracking-[0.25em] leading-relaxed">
                        This moment will be hashed and secured on-chain.<br />
                        <span className="font-black text-[#2A2A2A]/40 mt-1 block">Immutable. Authentic. Yours.</span>
                    </p>

                    <div className="space-y-4 font-typewriter text-[9px] bg-[#F6F3EE]/50 p-6 rounded-2xl border border-white/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <ShieldCheck size={40} />
                        </div>
                        <div className="flex justify-between border-b border-[#D9D4CC]/30 pb-3">
                            <span className="text-[#A09E96] uppercase tracking-widest font-bold">Provenance</span>
                            <span className="font-bold text-[#2A2A2A]">{publicKey ? publicKey.toBase58().slice(0, 6) + '...' + publicKey.toBase58().slice(-6) : 'Anonymous'}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#D9D4CC]/30 pb-3">
                            <span className="text-[#A09E96] uppercase tracking-widest font-bold">Entropy Source</span>
                            <div className="flex gap-1 overflow-hidden max-w-[120px]">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex gap-0.5">
                                        {Array.from({ length: 4 }).map((_, j) => {
                                            const randomValue = window.crypto.getRandomValues(new Uint8Array(1))[0];
                                            return (
                                                <div
                                                    key={j}
                                                    className={`w-1 h-1 rounded-sm ${randomValue > 127 ? 'bg-[#3FA37C]/60' : 'bg-[#2A2A2A]/20'} animate-pulse`}
                                                    style={{ animationDelay: `${(i * 100) + (j * 50)}ms` }}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2 opacity-60">
                            <div className="flex justify-between">
                                <span className="text-[#A09E96] uppercase tracking-widest font-bold">Temporal Log</span>
                                <span className="font-bold text-[#2A2A2A]">{new Date().toLocaleTimeString()} (UTC{new Date().getTimezoneOffset() / -60})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#A09E96] uppercase tracking-widest font-bold">Atmospheric Seed</span>
                                <span className="font-bold text-[#2A2A2A] uppercase font-mono">
                                    {Array.from(window.crypto.getRandomValues(new Uint8Array(4)))
                                        .map(b => b.toString(16).padStart(2, '0')).join('')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#A09E96] uppercase tracking-widest font-bold">Dither Factor</span>
                                <span className="font-bold text-[#2A2A2A]">
                                    {(performance.now() % 1).toFixed(4)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#A09E96] uppercase tracking-widest font-bold">Reality Hash</span>
                                <span className="font-bold text-[#2A2A2A] flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#3FA37C] mt-1 shadow-[0_0_8px_#3FA37C]"></span>
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={mintPhoto}
                        className="w-full h-14 bg-[#3FA37C] hover:bg-emerald-700 border-none shadow-[0_15px_30px_-5px_rgba(63,163,124,0.3)]"
                    >
                        Verify & Mint Proof
                    </Button>
                    <button
                        onClick={() => setScreen('preview')}
                        className="text-[9px] uppercase tracking-[0.3em] text-[#A09E96] font-black hover:text-[#2A2A2A] transition-colors"
                    >
                        Discard & Retake
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
