'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock } from 'lucide-react';
import { PolaroidCard } from '../PolaroidCard';
import { Button } from '../Button';

interface PreviewScreenProps {
    currentPhoto: string | null;
    tempCaption: string;
    setTempCaption: (caption: string) => void;
    setScreen: (screen: any) => void;
    includeDateTime: boolean;
    setIncludeDateTime: (include: boolean) => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
    currentPhoto,
    tempCaption,
    setTempCaption,
    setScreen,
    includeDateTime,
    setIncludeDateTime,
}) => {
    return (
        <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 desk-bg flex flex-col items-center p-6"
        >
            <div className="flex-1 w-full flex items-center justify-center">
                <motion.div
                    initial={{ y: 320, rotate: -8 }}
                    animate={{ y: 0, rotate: (Math.random() - 0.5) * 6 }}
                    transition={{ type: "spring", damping: 18, stiffness: 120 }}
                >
                    {currentPhoto && (
                        <PolaroidCard
                            imageSrc={currentPhoto}
                            isDeveloping={true}
                            caption={tempCaption}
                            onCaptionChange={setTempCaption}
                            editable={true}
                            timestamp={includeDateTime ? Date.now() : undefined}
                            className="max-w-[320px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"
                        />
                    )}
                </motion.div>
            </div>

            <div className="w-full flex flex-col gap-4 pb-12 mt-8 max-w-sm">
                <div className="flex justify-end px-2 mb-2">
                    <button
                        onClick={() => setIncludeDateTime(!includeDateTime)}
                        className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-colors ${includeDateTime ? 'text-emerald-600' : 'text-[#A09E96]'}`}
                    >
                        <Clock size={14} />
                        {includeDateTime ? 'Time Included' : 'Add Time'}
                    </button>
                </div>
                <Button
                    onClick={() => setScreen('metadata')}
                    className="w-full h-14 bg-[#2A2A2A] shadow-xl"
                >
                    Secure Moment
                </Button>
                <div className="flex gap-4">
                    <Button
                        onClick={() => setScreen('camera')}
                        variant="secondary"
                        className="flex-1 py-3 bg-white/50 border-none shadow-md"
                    >
                        <RefreshCw size={14} /> Retake
                    </Button>
                    <div className="flex-1 flex items-center justify-center px-4 py-3 bg-white/20 rounded-xl border border-white/40">
                        <span className="text-[7px] uppercase tracking-[0.2em] font-black text-[#A09E96]">Authentic Capture</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
