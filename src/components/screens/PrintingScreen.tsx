'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PolaroidCard } from '../PolaroidCard';

interface PrintingScreenProps {
    currentPhoto: string | null;
    tempCaption: string;
    includeDateTime: boolean;
}

export const PrintingScreen: React.FC<PrintingScreenProps> = ({
    currentPhoto,
    tempCaption,
    includeDateTime,
}) => {
    return (
        <motion.div
            key="printing"
            className="flex-1 desk-bg flex flex-col items-center justify-start pt-12"
        >
            <div className="w-full max-w-sm h-40 relative z-20 px-8">
                {/* Camera Body Slot */}
                <div className="w-full h-24 bg-[#1a1a1a] rounded-xl shadow-2xl border-b-[8px] border-black/20 flex items-end justify-center pb-2 px-6">
                    <div className="w-full h-2.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/10 blur-2xl"></div>
            </div>

            <div className="w-full flex justify-center z-10 -mt-16 overflow-hidden px-8">
                <motion.div
                    initial={{ y: -450 }}
                    animate={{ y: 0 }}
                    transition={{
                        duration: 4.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.5
                    }}
                >
                    <PolaroidCard
                        imageSrc={currentPhoto!}
                        caption={tempCaption}
                        isMinted={true}
                        timestamp={includeDateTime ? Date.now() : undefined}
                        className="max-w-[300px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                    />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 }}
                className="mt-16 flex flex-col items-center gap-2"
            >
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#A09E96] font-black italic">Physicalizing Reality</p>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="w-1 h-1 bg-[#3FA37C] rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};
