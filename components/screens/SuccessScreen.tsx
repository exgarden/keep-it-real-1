import React from 'react';
import { motion } from 'framer-motion';
import { Check, Share2 } from 'lucide-react';
import { PolaroidCard } from '../PolaroidCard';
import { Button } from '../Button';

interface SuccessScreenProps {
    currentPhoto: string | null;
    tempCaption: string;
    setScreen: (screen: any) => void;
    setCurrentPhoto: (photo: string | null) => void;
    setTempCaption: (caption: string) => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
    currentPhoto,
    tempCaption,
    setScreen,
    setCurrentPhoto,
    setTempCaption,
}) => {
    return (
        <motion.div
            key="success"
            className="flex-1 desk-bg flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="relative group">
                <PolaroidCard
                    imageSrc={currentPhoto!}
                    caption={tempCaption}
                    isMinted={true}
                    timestamp={Date.now()}
                    className="max-w-[300px] mb-12 rotate-3 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.25)]"
                />
                <motion.div
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                    <div className="w-32 h-32 border-[6px] border-[#3FA37C] rounded-full flex items-center justify-center text-[#3FA37C] font-black uppercase tracking-[0.2em] rotate-[-25deg] shadow-[0_10px_30px_rgba(63,163,124,0.4)] bg-[#F6F3EE]/10 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center">
                            <span className="text-[14px]">Verified</span>
                            <Check size={24} strokeWidth={4} />
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl max-w-xs relative overflow-hidden"
            >
                <img src="/logo.png" alt="Keep It Real Logo" className="w-32 h-auto mb-6 opacity-80 mx-auto" />
                <h2 className="text-3xl font-serif italic mb-2 text-[#2A2A2A]">Moment Secured.</h2>
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#A09E96] font-black mb-10">Proof of reality permanent</p>

                <div className="flex flex-col gap-4">
                    <Button onClick={() => setScreen('gallery')} className="w-full h-14 bg-[#2A2A2A]">View in Scrapbook</Button>

                    <button
                        onClick={async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: 'Keep It Real',
                                        text: `I just secured a verified moment: "${tempCaption}"`,
                                        url: window.location.href,
                                    });
                                } catch (err) {
                                    console.log('Error sharing:', err);
                                }
                            } else {
                                alert('Sharing not supported on this browser. Your moment is secured in your scrapbook!');
                            }
                        }}
                        className="flex items-center justify-center gap-2 w-full h-12 border border-[#2A2A2A]/10 rounded-2xl text-[9px] uppercase tracking-[0.2em] font-black text-[#2A2A2A] hover:bg-[#2A2A2A]/5 transition-colors"
                    >
                        <Share2 size={12} /> Share Moment
                    </button>

                    <button
                        onClick={() => { setScreen('home'); setCurrentPhoto(null); setTempCaption(""); }}
                        className="text-[9px] uppercase tracking-[0.3em] text-[#A09E96] font-black hover:text-[#2A2A2A] py-2"
                    >
                        Return Home
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
