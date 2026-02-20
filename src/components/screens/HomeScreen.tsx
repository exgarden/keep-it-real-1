'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, LayoutGrid } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { Button } from '../Button';
import { AppScreen } from '@/types';

interface HomeScreenProps {
    setScreen: (screen: AppScreen) => void;
    galleryLength: number;
    connected: boolean;
    publicKey: PublicKey | null;
    disconnect: () => Promise<void>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
    setScreen,
    galleryLength,
    connected,
    publicKey,
    disconnect,
}) => {
    return (
        <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 desk-bg relative overflow-hidden"
        >
            {/* Background Scattered Polaroids */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] rotate-[-12deg] w-48 h-56 bg-white shadow-2xl border border-gray-100 p-2">
                    <div className="w-full aspect-square bg-[#EFE9E1]"></div>
                </div>
                <div className="absolute top-[40%] right-[-15%] rotate-[8deg] w-52 h-60 bg-white shadow-2xl border border-gray-100 p-2">
                    <div className="w-full aspect-square bg-[#EAE3D9]"></div>
                </div>
                <div className="absolute bottom-[5%] left-[5%] rotate-[15deg] w-44 h-52 bg-white shadow-2xl border border-gray-100 p-2">
                    <div className="w-full aspect-square bg-[#F1EBE2]"></div>
                </div>
            </div>

            <div className="z-10 text-center flex flex-col items-center w-full max-w-xs">
                <header className="mb-12 flex flex-col items-center">
                    <img src="/logo.png" alt="Keep It Real Logo" className="w-48 h-auto mb-6 opacity-90 drop-shadow-sm" />
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-[1px] w-4 bg-[#D9D4CC]"></span>
                        <p className="text-[#A09E96] tracking-[0.4em] uppercase text-[7px] font-bold">Authentic Memories</p>
                        <span className="h-[1px] w-4 bg-[#D9D4CC]"></span>
                    </div>
                </header>

                <div className="flex flex-col gap-6 w-full">
                    <Button
                        onClick={() => setScreen('camera')}
                        className="w-full h-16 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] bg-[#2A2A2A] hover:bg-black transition-all"
                    >
                        <Camera size={18} strokeWidth={2.5} /> Capture Real Moment
                    </Button>

                    <div className="text-center">
                        <p className="text-[#A09E96] text-[8px] uppercase tracking-[0.2em] font-bold">“Only real-time photos allowed”</p>
                    </div>

                    <div className="mt-4 pt-8 border-t border-[#D9D4CC]/50">
                        <Button
                            onClick={() => setScreen('gallery')}
                            variant="secondary"
                            className="w-full h-12 bg-white/50 border-none shadow-sm"
                        >
                            <LayoutGrid size={14} /> View Scrapbook ({galleryLength})
                        </Button>
                    </div>
                </div>

                {!connected ? (
                    <div className="mt-12 scale-90 opacity-80 transition-opacity hover:opacity-100">
                        <WalletMultiButton className="!bg-[#2A2A2A] !rounded-xl !h-12 !font-bold !text-[9px] !uppercase !tracking-widest" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 mt-8">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-full border border-white/50">
                            <div className="w-1.5 h-1.5 bg-[#3FA37C] rounded-full"></div>
                            <span className="text-[8px] font-bold text-[#A09E96] uppercase tracking-widest leading-none">
                                {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                            </span>
                        </div>
                        <button
                            onClick={() => disconnect()}
                            className="text-[9px] uppercase tracking-widest font-bold text-[#A09E96] hover:text-[#2A2A2A] transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
