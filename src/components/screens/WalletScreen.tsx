'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '../Button';

interface WalletScreenProps {
    connected: boolean;
    setScreen: (screen: any) => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
    connected,
    setScreen,
}) => {
    return (
        <motion.div
            key="wallet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 desk-bg flex items-center justify-center p-8 min-h-[100dvh]"
        >
            <div className="w-full max-w-sm glass-panel p-12 rounded-[32px] text-center relative shadow-2xl border-white/40">
                <div className="w-20 h-20 bg-[#2A2A2A] rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-2xl rotate-3">
                    <Wallet size={36} className="text-[#FDFBF7]" />
                </div>

                <h1 className="text-3xl font-serif italic mb-3 text-[#2A2A2A]">Keep It Real</h1>
                <p className="text-[10px] text-[#A09E96] uppercase tracking-[0.3em] mb-12 font-bold px-4">
                    Your memories belong to your wallet identity.
                </p>

                <div className="flex flex-col items-center gap-6">
                    {!connected ? (
                        <div className="w-full group">
                            <WalletMultiButton className="!bg-[#2A2A2A] hover:!bg-black !rounded-2xl !h-16 !w-full !flex !items-center !justify-center !font-bold !text-[11px] !uppercase !tracking-[0.2em] !transition-all !shadow-lg group-hover:!shadow-xl group-hover:!-translate-y-0.5" />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full space-y-4"
                        >
                            <div className="text-[10px] text-[#3FA37C] font-black uppercase tracking-widest mb-4">
                                Identity Verified
                            </div>
                            <Button
                                onClick={() => setScreen('home')}
                                className="w-full h-16 bg-[#2A2A2A] hover:bg-black shadow-xl"
                            >
                                Enter Reality
                            </Button>
                        </motion.div>
                    )}
                </div>

                <div className="mt-16 opacity-30">
                    <p className="text-[8px] uppercase tracking-[0.4em] font-medium text-[#A09E96]">
                        Devnet / Authenticated Proof
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
