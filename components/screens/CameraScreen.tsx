import React from 'react';
import { motion } from 'framer-motion';
import { X, Zap, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { CameraSettings } from '../../types';

interface CameraScreenProps {
    setScreen: (screen: any) => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    cameraSettings: CameraSettings;
    setCameraSettings: React.Dispatch<React.SetStateAction<CameraSettings>>;
    capturePhoto: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
    setScreen,
    videoRef,
    canvasRef,
    cameraSettings,
    setCameraSettings,
    capturePhoto,
}) => {
    return (
        <motion.div
            key="camera"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 bg-[#1a1a1a] flex flex-col relative overflow-hidden"
        >
            {/* Camera Header Toggles */}
            <div className="flex justify-between items-center px-6 pt-12 pb-6 text-[#F6F3EE] z-20">
                <button
                    onClick={() => setScreen('home')}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex gap-3 bg-black/30 backdrop-blur-xl p-1.5 rounded-full border border-white/10">
                    <button
                        onClick={() => setCameraSettings(prev => ({ ...prev, flash: !prev.flash }))}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${cameraSettings.flash ? 'bg-[#3FA37C] text-white shadow-[0_0_15px_rgba(63,163,124,0.4)]' : 'hover:bg-white/10 text-white/60'}`}
                    >
                        <Zap size={18} fill={cameraSettings.flash ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={() => setCameraSettings(prev => ({ ...prev, timer: prev.timer === 0 ? 3 : 0 }))}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${cameraSettings.timer > 0 ? 'bg-[#3FA37C] text-white' : 'hover:bg-white/10 text-white/60'}`}
                    >
                        <Clock size={18} />
                    </button>
                </div>
            </div>

            {/* Viewfinder area */}
            <div className="flex-1 relative flex items-center justify-center p-8">
                <div className="w-full max-w-sm aspect-square relative border-[16px] border-[#F6F3EE] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-[4px] overflow-hidden group">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" />

                    {/* Viewfinder Overlay Elements */}
                    <div className="absolute inset-0 border-[1px] border-black/10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>

                    <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
                        <motion.div
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-red-500 rounded-full"
                        ></motion.div>
                        <span className="text-[7px] text-white font-black tracking-[0.2em] uppercase">Real Time Only</span>
                    </div>

                    <div className="absolute bottom-4 right-4 text-white/40">
                        <ShieldCheck size={14} />
                    </div>
                </div>
            </div>

            {/* Shutter Area */}
            <div className="h-56 bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 relative">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="flex items-center gap-12">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center grayscale opacity-40">
                        <div className="w-8 h-8 rounded-lg bg-white/20"></div>
                    </div>

                    <button
                        onClick={capturePhoto}
                        className="group relative w-24 h-24"
                    >
                        <div className="absolute inset-0 rounded-full bg-[#333] shadow-inner scale-110"></div>
                        <div className="absolute inset-1.5 rounded-full bg-[#fcfcfc] border-[6px] border-[#D9D4CC] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-active:scale-95 group-active:bg-gray-200 transition-all flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border border-black/5"></div>
                        </div>
                    </button>

                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center grayscale opacity-40">
                        <RefreshCw size={20} className="text-white" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <p className="text-white/40 text-[8px] uppercase tracking-[0.4em] font-black">Real. Unfiltered. Permanent.</p>
                    <div className="h-1 w-12 bg-[#3FA37C]/40 rounded-full"></div>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </motion.div>
    );
};
