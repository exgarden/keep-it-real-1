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
            className="flex-1 desk-bg flex items-center justify-center p-8"
        >
            <div className="w-full max-w-sm glass-panel p-10 rounded-3xl text-center relative">
                <button onClick={() => setScreen('home')} className="absolute top-6 right-6 text-[#A09E96] hover:text-[#2A2A2A] transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="w-16 h-16 bg-[#2A2A2A] rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl">
                    <Wallet size={32} className="text-[#F6F3EE]" />
                </div>
                <h2 className="text-2xl font-serif italic mb-2 text-[#2A2A2A]">Connect Identity</h2>
                <p className="text-[10px] text-[#A09E96] uppercase tracking-[0.2em] mb-12">Required to sign the proof of reality</p>

                <div className="flex flex-col items-center gap-4">
                    <WalletMultiButton className="!bg-[#2A2A2A] !rounded-xl !h-14 !w-full !flex !items-center !justify-center !font-bold !text-[12px] !uppercase !tracking-widest" />
                    {connected && (
                        <Button onClick={() => setScreen('home')} className="w-full">Continue</Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
