import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Share2, Camera, X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { PolaroidPhoto, AppScreen } from '../../types';
import { PolaroidCard } from '../PolaroidCard';

interface GalleryScreenProps {
    gallery: PolaroidPhoto[];
    setScreen: (screen: AppScreen) => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
    gallery,
    setScreen,
}) => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const handleShare = async (photo: PolaroidPhoto) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Keep It Real Memory',
                    text: photo.caption || 'Check out this authentic memory!',
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            alert('Sharing is not supported on this browser. You can copy the link manually.');
        }
    };

    const nextPhoto = () => {
        if (selectedPhotoIndex !== null && selectedPhotoIndex < gallery.length - 1) {
            setSelectedPhotoIndex(selectedPhotoIndex + 1);
        }
    };

    const prevPhoto = () => {
        if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
            setSelectedPhotoIndex(selectedPhotoIndex - 1);
        }
    };

    return (
        <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 desk-bg flex flex-col min-h-screen relative"
        >
            <header className="sticky top-0 z-30 bg-[#F6F3EE]/80 backdrop-blur-md px-6 py-6 border-b border-[#D9D4CC]/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setScreen('home')}
                        className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl hover:shadow-md transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-xl font-serif italic text-[#2A2A2A]">Scrapbook</h2>
                        <p className="text-[7px] uppercase tracking-[0.4em] text-[#A09E96] font-black">{gallery.length} Authentic Moments</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl active:scale-95 transition-all">
                        <Search size={16} className="text-[#A09E96]" />
                    </button>
                </div>
            </header>

            <div className="flex-1 p-6 pb-32">
                {gallery.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {gallery.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layoutId={`photo-${photo.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedPhotoIndex(index)}
                                className="aspect-square relative cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all group"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ExternalLink size={20} className="text-white" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-40 opacity-30 select-none">
                        <div className="w-24 h-24 mb-6 border-2 border-dashed border-[#2A2A2A] rounded-full flex items-center justify-center">
                            <Camera size={32} />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.5em] font-black">No memories captured yet</p>
                    </div>
                )}
            </div>

            {/* Detail View Overlay (Apple Photos Style) */}
            <AnimatePresence>
                {selectedPhotoIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col"
                    >
                        {/* Detail Header */}
                        <div className="flex justify-between items-center p-6 text-white">
                            <button
                                onClick={() => setSelectedPhotoIndex(null)}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">
                                    {new Date(gallery[selectedPhotoIndex].timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="text-[8px] uppercase tracking-[0.1em] text-white/40">
                                    {gallery[selectedPhotoIndex].location.label || 'Unknown Reality'}
                                </p>
                            </div>

                            <button
                                onClick={() => handleShare(gallery[selectedPhotoIndex])}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
                            >
                                <Share2 size={18} />
                            </button>
                        </div>

                        {/* Main Carousel Area */}
                        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                            <button
                                onClick={prevPhoto}
                                disabled={selectedPhotoIndex === 0}
                                className={`absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white transition-all ${selectedPhotoIndex === 0 ? 'opacity-0' : 'hover:bg-white/20'}`}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <motion.div
                                key={gallery[selectedPhotoIndex].id}
                                layoutId={`photo-${gallery[selectedPhotoIndex].id}`}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = offset.x;
                                    if (swipe < -100) nextPhoto();
                                    else if (swipe > 100) prevPhoto();
                                }}
                                className="w-full max-w-lg px-6"
                            >
                                <PolaroidCard
                                    {...gallery[selectedPhotoIndex]}
                                    imageSrc={gallery[selectedPhotoIndex].url}
                                    isMinted={true}
                                    className="mx-auto shadow-[0_50px_100px_rgba(0,0,0,0.5)] rotate-0"
                                />
                            </motion.div>

                            <button
                                onClick={nextPhoto}
                                disabled={selectedPhotoIndex === gallery.length - 1}
                                className={`absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white transition-all ${selectedPhotoIndex === gallery.length - 1 ? 'opacity-0' : 'hover:bg-white/10'}`}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 pb-12 flex justify-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white transition-all">
                                    <Download size={20} />
                                </button>
                                <span className="text-[7px] uppercase tracking-widest text-white/40">Save</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handleShare(gallery[selectedPhotoIndex])}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-all"
                                >
                                    <Share2 size={20} />
                                </button>
                                <span className="text-[7px] uppercase tracking-widest text-white/60">Share</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScreen('camera')}
                    className="bg-[#2A2A2A] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
                >
                    <Camera size={18} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Hold the Moment</span>
                </motion.button>
            </div>
        </motion.div>
    );
};
