import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Trash2, LayoutGrid, Clock, ShieldCheck, Zap, ArrowLeft, Share2, Wallet, MapPin, Calendar, Info, Search, X, ChevronLeft, ChevronRight, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AppScreen, PolaroidPhoto, CameraSettings, LocationData } from './types';
import { COLORS, MINT_MESSAGES } from './constants';
import { Button } from './components/Button';
import { PolaroidCard } from './components/PolaroidCard';
import { generateImageHash } from './utils/solana-utils';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [gallery, setGallery] = useState<PolaroidPhoto[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [currentPhotoBlob, setCurrentPhotoBlob] = useState<Blob | null>(null);
  const [tempCaption, setTempCaption] = useState("");
  const [location, setLocation] = useState<LocationData>({ latitude: null, longitude: null });
  const [includeLocation, setIncludeLocation] = useState(true);
  const [mintStatus, setMintStatus] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({ flash: false, timer: 0 });

  const { publicKey, connected, disconnect } = useWallet();

  // Gallery view states
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('keep_it_real_gallery');
    if (saved) setGallery(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('keep_it_real_gallery', JSON.stringify(gallery));
  }, [gallery]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', aspectRatio: 1 },
        audio: false
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      trackRef.current = stream.getVideoTracks()[0];
    } catch (err) {
      alert("Camera access is required for Keep It Real.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    trackRef.current = null;
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCurrentPhoto(dataUrl);

        // Convert to blob for hashing
        canvas.toBlob((blob) => {
          if (blob) setCurrentPhotoBlob(blob);
        }, 'image/jpeg', 0.9);

        setScreen('preview');
      }
    }
  };

  const mintPhoto = async () => {
    if (!connected) { setScreen('wallet'); return; }
    if (!currentPhotoBlob) return;

    setIsMinting(true);
    setScreen('minting');

    // 1. Generate real hash from pixel data
    const photoHash = await generateImageHash(currentPhotoBlob);

    // 2. Simulate minting process (since we don't have program ID yet)
    for (let i = 0; i < MINT_MESSAGES.length; i++) {
      setMintStatus(i);
      await new Promise(r => setTimeout(r, 1200));
    }

    const newPhoto: PolaroidPhoto = {
      id: Math.random().toString(36).substr(2, 9),
      url: currentPhoto!,
      caption: tempCaption,
      timestamp: Date.now(),
      location: includeLocation ? { ...location } : { latitude: null, longitude: null },
      hash: photoHash,
      isMinted: true,
      rotation: (Math.random() - 0.5) * 10
    };

    setGallery([newPhoto, ...gallery]);
    setIsMinting(false);
    setScreen('printing');

    setTimeout(() => {
      setScreen('success');
    }, 4000);
  };

  useEffect(() => {
    if (screen === 'camera') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [screen]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F6F3EE] shadow-2xl overflow-hidden font-sans relative flex flex-col">
      <AnimatePresence mode="wait">

        {/* HOME SCREEN */}
        {screen === 'home' && (
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
              <header className="mb-16">
                <h1 className="text-4xl font-serif italic mb-2 text-[#2A2A2A] tracking-tight">keep it real</h1>
                <div className="flex items-center justify-center gap-3">
                  <span className="h-[1px] w-4 bg-[#D9D4CC]"></span>
                  <p className="text-[#A09E96] tracking-[0.4em] uppercase text-[7px] font-bold">Authentic Memories</p>
                  <span className="h-[1px] w-4 bg-[#D9D4CC]"></span>
                </div>
              </header>

              <div className="flex flex-col gap-6 w-full">
                <Button
                  onClick={() => setScreen('camera')}
                  className="w-full h-16 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] bg-[#2A2A2A]"
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
                    <LayoutGrid size={14} /> View Scrapbook ({gallery.length})
                  </Button>
                </div>
              </div>

              {!connected ? (
                <div className="mt-12 scale-90 opacity-80 transition-opacity hover:opacity-100">
                  <WalletMultiButton className="!bg-[#2A2A2A] !rounded-xl !h-12 !font-bold !text-[9px] !uppercase !tracking-widest" />
                </div>
              ) : (
                <div className="mt-8 flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-full border border-white/50">
                  <div className="w-1.5 h-1.5 bg-[#3FA37C] rounded-full"></div>
                  <span className="text-[8px] font-bold text-[#A09E96] uppercase tracking-widest">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CAMERA SCREEN */}
        {screen === 'camera' && (
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
        )}

        {/* PREVIEW SCREEN */}
        {screen === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-desk-bg flex flex-col items-center p-6"
          >
            <div className="flex-1 w-full flex items-center justify-center">
              <motion.div
                initial={{ y: 300, rotate: -5 }}
                animate={{ y: 0, rotate: (Math.random() - 0.5) * 4 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {currentPhoto && (
                  <PolaroidCard
                    imageSrc={currentPhoto}
                    isDeveloping={true}
                    caption={tempCaption}
                    onCaptionChange={setTempCaption}
                    editable={true}
                    className="max-w-[320px]"
                  />
                )}
              </motion.div>
            </div>

            <div className="w-full flex gap-4 pb-12 mt-8">
              <Button onClick={() => setScreen('camera')} variant="secondary" className="flex-1 py-4 border-none shadow-xl">
                Retake
              </Button>
              <Button onClick={() => setScreen('metadata')} className="flex-[2] py-4 shadow-xl">
                Secure Moment
              </Button>
            </div>
          </motion.div>
        )}

        {/* METADATA / MINT SCREEN */}
        {screen === 'metadata' && (
          <motion.div
            key="metadata"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-desk-bg flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-sm glass-panel p-8 rounded-2xl flex flex-col gap-6 text-[#2A2A2A]">
              <h3 className="text-2xl font-serif italic text-center mb-2">Verify Permanence</h3>
              <p className="text-[10px] text-center text-[#A09E96] uppercase tracking-[0.2em] mb-4">
                This moment will be verified on-chain.<br />It cannot be edited later.
              </p>

              <div className="space-y-4 font-typewriter text-xs">
                <div className="flex justify-between border-b border-[#D9D4CC] pb-2">
                  <span className="text-[#A09E96]">WALLET</span>
                  <span className="font-bold">{publicKey ? publicKey.toBase58().slice(0, 4) + '...' + publicKey.toBase58().slice(-4) : 'Not Connected'}</span>
                </div>
                <div className="flex justify-between border-b border-[#D9D4CC] pb-2">
                  <span className="text-[#A09E96]">TIMESTAMP</span>
                  <span className="font-bold">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <Button onClick={mintPhoto} className="w-full bg-[#3FA37C] hover:bg-emerald-700 border-none shadow-lg">
                  Verify & Mint on Solana
                </Button>
                <Button onClick={() => setScreen('preview')} variant="ghost" className="text-xs">
                  Back to edits
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* MINTING PROGRESS */}
        {screen === 'minting' && (
          <motion.div
            key="minting"
            className="flex-1 bg-desk-bg flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative w-24 h-24 mb-12">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#D9D4CC] rounded-full"></div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-x-0 bottom-0 bg-[#3FA37C] rounded-t-full opacity-20"
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={48} className="text-[#3FA37C] animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-serif italic mb-2 text-[#2A2A2A]">{MINT_MESSAGES[mintStatus]}</h2>
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#A09E96] font-bold">Securing pixel integrity on Devnet...</p>
          </motion.div>
        )}

        {/* PRINTING ANIMATION SCREEN */}
        {screen === 'printing' && (
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
                  timestamp={Date.now()}
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
        )}

        {/* SUCCESS SCREEN */}
        {screen === 'success' && (
          <motion.div
            key="success"
            className="flex-1 bg-desk-bg flex flex-col items-center justify-center p-8 text-center"
          >
            <PolaroidCard
              imageSrc={currentPhoto!}
              caption={tempCaption}
              isMinted={true}
              timestamp={Date.now()}
              className="max-w-[300px] mb-12 rotate-3"
            />
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl max-w-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Check className="text-[#3FA37C]" size={32} />
              </div>
              <h2 className="text-3xl font-serif italic mb-2 text-[#2A2A2A]">Secured.</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#A09E96] font-bold mb-8">Verified Moment on Solana</p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => setScreen('gallery')} className="w-full">View My Gallery</Button>
                <button onClick={() => { setScreen('home'); setCurrentPhoto(null); setTempCaption(""); }} className="text-[9px] uppercase tracking-widest text-[#A09E96] font-bold hover:text-[#2A2A2A]">New Memory</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* GALLERY SCREEN */}
        {screen === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-desk-bg flex flex-col p-6 animate-in fade-in"
          >
            <header className="flex justify-between items-center mt-6 mb-12">
              <div>
                <h2 className="text-3xl font-serif italic text-[#2A2A2A]">Your Memories</h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#A09E96] font-bold mt-1">{gallery.length} On-Chain Records</p>
              </div>
              <button onClick={() => setScreen('home')} className="p-3 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-white hover:scale-105 transition-transform"><ArrowLeft size={20} /></button>
            </header>

            <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
              {gallery.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#D9D4CC] py-20">
                  <div className="w-32 h-32 border-2 border-dashed border-[#D9D4CC] rounded-3xl mb-6 flex items-center justify-center opacity-30">
                    <Camera size={48} />
                  </div>
                  <p className="uppercase tracking-[0.3em] text-[10px] font-bold">No reality captured yet</p>
                </div>
              ) : (
                <div className="relative flex flex-col items-center gap-12 pt-6">
                  {gallery.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="w-full max-w-[280px]"
                      style={{
                        transform: `rotate(${photo.rotation}deg)`,
                        marginTop: idx === 0 ? 0 : '-20px',
                        zIndex: gallery.length - idx
                      }}
                    >
                      <PolaroidCard
                        {...photo}
                        imageSrc={photo.url}
                        className="shadow-xl hover:shadow-2xl transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[280px] px-6">
              <Button onClick={() => setScreen('camera')} className="w-full h-14 bg-[#2A2A2A] text-white shadow-2xl rounded-2xl">
                <Camera size={20} /> New Moment
              </Button>
            </div>
          </motion.div>
        )}

        {/* WALLET CONNECTION SCREEN */}
        {screen === 'wallet' && (
          <motion.div
            key="wallet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-desk-bg flex items-center justify-center p-8"
          >
            <div className="w-full max-w-sm glass-panel p-10 rounded-3xl text-center relative">
              <button onClick={() => setScreen('home')} className="absolute top-6 right-6 text-[#A09E96] hover:text-[#2A2A2A]"><ArrowLeft size={20} /></button>
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
        )}

      </AnimatePresence>
    </div>
  );
};

export default App;
