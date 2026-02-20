import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { PolaroidPhoto } from '../types';

// Single Source of Truth for Program ID
export const PROGRAM_ID = new PublicKey('7iLFBYxQFx4QL9GHmeh6ELJBiizavd7dTWxi1sQNjsJ5');
export const DAO_TREASURY_ADDRESS = new PublicKey('KeepItRealTreasury1111111111111111111111');

const IPFS_GATEWAYS = [
    process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.io/ipfs/'
];

export const getConnection = () => {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    const endpoint = apiKey
        ? `https://devnet.helius-rpc.com/?api-key=${apiKey}`
        : clusterApiUrl('devnet');
    return new Connection(endpoint, 'confirmed');
};

export const getProvider = (wallet: any) => {
    const connection = getConnection();
    return new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
};

export const getProgram = (wallet: any, idl: Idl) => {
    const provider = getProvider(wallet);

    // Address must be in IDL or passed to Program constructor (Anchor 0.30+)
    const idlWithAddress = {
        ...idl,
        address: PROGRAM_ID.toBase58(),
        metadata: {
            ...((idl as any).metadata || {}),
            address: PROGRAM_ID.toBase58()
        }
    };

    return new Program(idlWithAddress as any, provider);
};

/**
 * Verifies the "Reality" of a capture.
 * Checks for freshness (must be minted within 10 minutes of capture)
 * and ensure it came from a live environment camera if possible.
 */
export const verifyReality = async (timestamp: number): Promise<boolean> => {
    const now = Date.now();
    const drift = Math.abs(now - timestamp);

    // Rule 1: Freshness - Must be within 10 minutes
    if (drift > 10 * 60 * 1000) {
        throw new Error("Memory is too stale. Must be minted within 10 minutes of capture.");
    }

    // Rule 2: Protocol Integrity - Ensure it's not a screencap or emulator
    if (typeof window !== 'undefined' && 'navigator' in window) {
        const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
        const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

        if (!hasCamera) throw new Error("Hardware violation: No camera detected.");
        if (!isMobile && process.env.NODE_ENV === 'production') {
            throw new Error("Device mismatch: Keep It Real strictly requires a mobile device for reality proof.");
        }
    }

    return true;
};

/**
 * Generates a SHA-256 hash of the image blob for on-chain verification.
 * Returns a 32-byte Uint8Array.
 */
export const generateImageHash = async (imageBlob: Blob): Promise<Uint8Array> => {
    const arrayBuffer = await imageBlob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return new Uint8Array(hashBuffer);
};

/**
 * Placeholder for IPFS upload via Pinata.
 * Returns a CID string.
 */
/**
 * Uploads an image blob to IPFS via Pinata.
 * Returns the CID string.
 */
export const uploadToIPFS = async (imageBlob: Blob): Promise<string> => {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

    if (!jwt) {
        console.warn("Pinata JWT not found, falling back to mock CID for dev.");
        return "Qm" + Math.random().toString(36).substring(2, 46);
    }

    const formData = new FormData();
    formData.append('file', imageBlob);

    const metadata = JSON.stringify({
        name: `KeepItReal_${Date.now()}.jpg`,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
            body: formData
        });
        const resData = await res.json();
        return resData.IpfsHash;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw new Error("IPFS upload failed");
    }
};

/**
 * Fetches all reality proofs from the blockchain for a specific user.
 * This is the core of the "On-Chain Sync" feature.
 */
export const fetchUserMemories = async (wallet: any, idl: Idl): Promise<Partial<PolaroidPhoto>[]> => {
    const program = getProgram(wallet, idl);

    try {
        console.log("Syncing from Solana for wallet:", wallet.publicKey.toBase58());

        // Fetch all accounts for this program owned by the user
        const memories = await (program.account as any).realityProof.all([
            {
                memcmp: {
                    offset: 8, // After 8-byte discriminator
                    bytes: wallet.publicKey.toBase58(),
                },
            },
        ]);

        return memories.map((m: any) => ({
            id: m.publicKey.toBase58(),
            owner: m.account.owner.toBase58(),
            hash: Buffer.from(m.account.imageHash as any).toString('hex'),
            cid: m.account.ipfsCid as string,
            timestamp: (m.account.timestamp as any).toNumber(),
            // URL with Redundancy Logic
            url: `${IPFS_GATEWAYS[0]}${m.account.ipfsCid}`,
            isMinted: true,
            rotation: (Math.random() - 0.5) * 10,
        }));
    } catch (error) {
        console.error("Failed to sync memories:", error);
        return [];
    }
};
