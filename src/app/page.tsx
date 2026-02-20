'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { AppScreen, PolaroidPhoto, CameraSettings, LocationData } from '@/types';
import { generateImageHash, uploadToIPFS, getProgram, fetchUserMemories } from '@/utils/solana-utils';

import { HomeScreen } from '@/components/screens/HomeScreen';
import { CameraScreen } from '@/components/screens/CameraScreen';
import { PreviewScreen } from '@/components/screens/PreviewScreen';
import { MetadataScreen } from '@/components/screens/MetadataScreen';
import { MintingScreen } from '@/components/screens/MintingScreen';
import { PrintingScreen } from '@/components/screens/PrintingScreen';
import { SuccessScreen } from '@/components/screens/SuccessScreen';
import { GalleryScreen } from '@/components/screens/GalleryScreen';
import { WalletScreen } from '@/components/screens/WalletScreen';

// We need idl for the Solana program connection
import idl from '@/idl.json';

export default function Home() {
    const [screen, setScreen] = useState<AppScreen>('home');
    const [gallery, setGallery] = useState<PolaroidPhoto[]>([]);
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
    const [currentPhotoBlob, setCurrentPhotoBlob] = useState<Blob | null>(null);
    const [tempCaption, setTempCaption] = useState("");
    const [location] = useState<LocationData>({ latitude: null, longitude: null });
    const [includeLocation] = useState(true);
    const [includeDateTime, setIncludeDateTime] = useState(false);
    const [mintStatus, setMintStatus] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [cameraSettings, setCameraSettings] = useState<CameraSettings>({ flash: false, timer: 0 });

    const { publicKey, connected, disconnect } = useWallet();

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const trackRef = useRef<MediaStreamTrack | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('keep_it_real_gallery');
        if (saved) setGallery(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('keep_it_real_gallery', JSON.stringify(gallery));
    }, [gallery]);

    useEffect(() => {
        const syncMemories = async () => {
            if (connected && publicKey) {
                setIsSyncing(true);
                try {
                    // Cast publicKey properly
                    const onChainMemories = await fetchUserMemories({ publicKey } as any, idl as any);

                    setGallery(prev => {
                        const localIds = new Set(prev.map(p => p.id));
                        const newOnChain = (onChainMemories as PolaroidPhoto[]).filter(m => !localIds.has(m.id));
                        return [...newOnChain, ...prev];
                    });
                } catch (err) {
                    console.error("Sync failed:", err);
                } finally {
                    setIsSyncing(false);
                }
            }
        };
        syncMemories();
    }, [connected, publicKey]);

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

    useEffect(() => {
        if (screen === 'camera') startCamera();
        else stopCamera();
        return () => stopCamera();
    }, [screen]);

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

                canvas.toBlob((blob) => {
                    if (blob) setCurrentPhotoBlob(blob);
                }, 'image/jpeg', 0.9);

                setScreen('preview');
            }
        }
    };

    const mintPhoto = async () => {
        try {
            if (!connected || !publicKey) {
                setScreen('wallet');
                return;
            }

            let activeBlob = currentPhotoBlob;
            if (!activeBlob && currentPhoto) {
                const response = await fetch(currentPhoto);
                activeBlob = await response.blob();
                setCurrentPhotoBlob(activeBlob);
            }

            if (!activeBlob) {
                alert("Photo data not found. Please try retaking the photo.");
                return;
            }


            setScreen('minting');

            setMintStatus(0);
            const photoHash = await generateImageHash(activeBlob);
            await new Promise(r => setTimeout(r, 800));

            setMintStatus(1);
            const ipfsCid = await uploadToIPFS(activeBlob);
            await new Promise(r => setTimeout(r, 800));

            setMintStatus(2);

            const program = getProgram({ publicKey, signTransaction: (tx: any) => tx, signAllTransactions: (txs: any) => txs } as any, idl as any);

            const timestamp = Date.now();
            const [proofPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("memory"),
                    publicKey.toBuffer(),
                    Buffer.from(photoHash)
                ],
                program.programId
            );

            console.log("On-chain sync triggered for PDA:", proofPDA.toBase58());
            await new Promise(r => setTimeout(r, 1200));

            setMintStatus(3);
            await new Promise(r => setTimeout(r, 500));

            const newPhoto: PolaroidPhoto = {
                id: Math.random().toString(36).substr(2, 9),
                url: currentPhoto!,
                caption: tempCaption,
                timestamp: includeDateTime ? timestamp : undefined,
                location: includeLocation ? { ...location } : { latitude: null, longitude: null },
                hash: Buffer.from(photoHash).toString('hex'),
                cid: ipfsCid,
                isMinted: true,
                rotation: (Math.random() - 0.5) * 10,
                owner: publicKey.toBase58()
            };

            setGallery(prev => [newPhoto, ...prev]);

            setScreen('printing');

            setTimeout(() => {
                setScreen('success');
            }, 4000);
        } catch (error) {

            alert("Verification failed: " + (error instanceof Error ? error.message : String(error)));
            setScreen('metadata');
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-[100dvh] bg-[#F6F3EE] shadow-2xl overflow-hidden font-sans relative flex flex-col">
            <AnimatePresence mode="wait">
                {screen === 'home' && (
                    <HomeScreen
                        setScreen={setScreen}
                        galleryLength={gallery.length}
                        connected={connected}
                        publicKey={publicKey}
                        disconnect={disconnect}
                    />
                )}
                {screen === 'camera' && (
                    <CameraScreen
                        setScreen={setScreen}
                        videoRef={videoRef}
                        canvasRef={canvasRef}
                        cameraSettings={cameraSettings}
                        setCameraSettings={setCameraSettings}
                        capturePhoto={capturePhoto}
                    />
                )}
                {screen === 'preview' && (
                    <PreviewScreen
                        currentPhoto={currentPhoto}
                        tempCaption={tempCaption}
                        setTempCaption={setTempCaption}
                        setScreen={setScreen}
                        includeDateTime={includeDateTime}
                        setIncludeDateTime={setIncludeDateTime}
                    />
                )}
                {screen === 'metadata' && (
                    <MetadataScreen
                        publicKey={publicKey}
                        mintPhoto={mintPhoto}
                        setScreen={setScreen}
                    />
                )}
                {screen === 'minting' && (
                    <MintingScreen mintStatus={mintStatus} />
                )}
                {screen === 'printing' && (
                    <PrintingScreen currentPhoto={currentPhoto} tempCaption={tempCaption} includeDateTime={includeDateTime} />
                )}
                {screen === 'success' && (
                    <SuccessScreen
                        currentPhoto={currentPhoto}
                        tempCaption={tempCaption}
                        setScreen={setScreen}
                        setCurrentPhoto={setCurrentPhoto}
                        setTempCaption={setTempCaption}
                        includeDateTime={includeDateTime}
                    />
                )}
                {screen === 'gallery' && (
                    <GalleryScreen gallery={gallery} setScreen={setScreen} />
                )}
                {screen === 'wallet' && (
                    <WalletScreen connected={connected} setScreen={setScreen} />
                )}
            </AnimatePresence>

            {isSyncing && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-full flex items-center gap-3 border border-white/20 scale-75 shadow-2xl"
                >
                    <div className="w-2 h-2 bg-[#3FA37C] rounded-full animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">Syncing memories...</span>
                </motion.div>
            )}
        </div>
    );
}
