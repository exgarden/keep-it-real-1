'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { MINT_MESSAGES } from '@/constants';

interface MintingScreenProps {
    mintStatus: number;
}

export const MintingScreen: React.FC<MintingScreenProps> = ({
    mintStatus,
}) => {
    return (
        <motion.div
            key="minting"
            className="flex-1 desk-bg flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="relative w-32 h-32 mb-16">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#3FA37C] rounded-full opacity-20"
                ></motion.div>

                <div className="absolute inset-4 bg-white/40 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center border border-white">
                    <ShieldCheck size={48} className="text-[#3FA37C] animate-pulse" />
                </div>

                <div className="absolute -inset-2 bg-gradient-to-tr from-[#3FA37C]/20 to-transparent rounded-full animate-spin-slow"></div>
            </div>

            <motion.h2
                key={mintStatus}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-serif italic mb-4 text-[#2A2A2A]"
            >
                {MINT_MESSAGES[mintStatus]}
            </motion.h2>
            <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#A09E96] font-black">Validating Reality on Solana</p>
                <div className="h-1 w-24 bg-[#D9D4CC] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="w-full h-full bg-[#3FA37C]"
                    ></motion.div>
                </div>
            </div>
        </motion.div>
    );
};
