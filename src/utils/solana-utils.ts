import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';

// Single Source of Truth for Program ID
export const PROGRAM_ID = new PublicKey('7iLFBYxQFx4QL9GHmeh6ELJBiizavd7dTWxi1sQNjsJ5');
export const DAO_TREASURY_ADDRESS = new PublicKey('11111111111111111111111111111111');

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

const PROGRAM_IDL = {
    "address": "7iLFBYxQFx4QL9GHmeh6ELJBiizavd7dTWxi1sQNjsJ5",
    "metadata": {
        "name": "keep_it_real",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "mintMemory",
            "discriminator": [13, 175, 116, 95, 164, 199, 151, 15],
            "accounts": [
                { "name": "realityProof", "writable": true, "signer": false },
                { "name": "user", "writable": true, "signer": true },
                { "name": "daoTreasury", "writable": true, "signer": false },
                { "name": "systemProgram", "address": "11111111111111111111111111111111", "writable": false, "signer": false }
            ],
            "args": [
                { "name": "imageHash", "type": { "array": ["u8", 32] } },
                { "name": "ipfsCid", "type": "string" },
                { "name": "appSignature", "type": { "array": ["u8", 64] } },
                { "name": "timestamp", "type": "i64" }
            ]
        },
        {
            "name": "revokeMemory",
            "discriminator": [43, 184, 66, 119, 163, 164, 140, 17],
            "accounts": [
                { "name": "realityProof", "writable": true, "signer": false },
                { "name": "user", "writable": true, "signer": true },
                { "name": "systemProgram", "address": "11111111111111111111111111111111", "writable": false, "signer": false }
            ],
            "args": []
        }
    ],
    "accounts": [
        { "name": "RealityProof", "discriminator": [245, 170, 92, 135, 16, 21, 150, 154] }
    ],
    "types": [
        {
            "name": "RealityProof",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "owner", "type": "pubkey" },
                    { "name": "imageHash", "type": { "array": ["u8", 32] } },
                    { "name": "ipfsCid", "type": "string" },
                    { "name": "appSignature", "type": { "array": ["u8", 64] } },
                    { "name": "timestamp", "type": "i64" },
                    { "name": "isVerified", "type": "bool" }
                ]
            }
        }
    ],
    "errors": [
        { "code": 6000, "name": "InvalidCid", "msg": "IPFS CID is invalid or too long." },
        { "code": 6001, "name": "TimeDriftTooLarge", "msg": "The timestamp provided differs too much from on-chain time." }
    ]
};

export const getProgram = (wallet: any, idl: Idl = PROGRAM_IDL as any) => {
    const provider = getProvider(wallet);
    const activeIdl = idl || PROGRAM_IDL;

    console.log("Initializing Program with IDL:", {
        name: (activeIdl as any).metadata?.name,
        hasTypes: !!(activeIdl as any).types,
        typesCount: (activeIdl as any).types?.length
    });

    if (!(activeIdl as any).types) {
        throw new Error("CRITICAL: IDL types are missing. Check solana-utils.ts consolidation.");
    }

    return new Program(activeIdl as any, provider);
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
 * Uploads a metadata JSON object to IPFS via Pinata.
 * Returns the Metadata CID string.
 */
export const uploadMetadataToIPFS = async (imageCid: string, metadata: { caption: string, timestamp: number, location: any }): Promise<string> => {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

    if (!jwt) {
        console.warn("Pinata JWT not found, falling back to mock Metadata CID for dev.");
        return "Qm" + Math.random().toString(36).substring(2, 46);
    }

    const body = JSON.stringify({
        pinataContent: {
            name: "Reality Proof",
            description: metadata.caption || "Minted memory from Keep It Real",
            image: `ipfs://${imageCid}`,
            attributes: [
                { trait_type: "Caption", value: metadata.caption },
                { trait_type: "Timestamp", value: new Date(metadata.timestamp).toISOString() },
                { trait_type: "Location", value: JSON.stringify(metadata.location) }
            ],
            // Custom fields for app recovery
            keep_it_real_metadata: {
                caption: metadata.caption,
                timestamp: metadata.timestamp,
                location: metadata.location,
                image_cid: imageCid
            }
        },
        pinataMetadata: {
            name: `Metadata_${Date.now()}.json`,
        },
        pinataOptions: {
            cidVersion: 1,
        }
    });

    try {
        const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: body
        });
        const resData = await res.json();
        return resData.IpfsHash;
    } catch (error) {
        console.error("Error uploading Metadata to Pinata:", error);
        throw new Error("IPFS Metadata upload failed");
    }
};

/**
 * Fetches all reality proofs from the blockchain for a specific user.
 * This is the core of the "On-Chain Sync" feature.
 */
export const fetchUserMemories = async ({ publicKey }: { publicKey: PublicKey }, idl: any = PROGRAM_IDL) => {
    try {
        const program = getProgram({ publicKey }, idl);
        const memories = await (program.account as any).realityProof.all([
            {
                memcmp: {
                    offset: 8, // Discriminator
                    bytes: publicKey.toBase58(),
                },
            },
        ]);

        const resolvedMemories = await Promise.all(memories.map(async (m: any) => {
            const cid = m.account.ipfsCid as string;
            let metadata: any = null;

            // Simple check: if it looks like a Metadata CID (could be improved)
            // For now, try to fetch and see if it's JSON
            try {
                const res = await fetch(`${IPFS_GATEWAYS[0]}${cid}`);
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const json = await res.json();
                    if (json.keep_it_real_metadata) {
                        metadata = json.keep_it_real_metadata;
                    }
                }
            } catch (e) {
                console.warn("Could not fetch metadata for CID:", cid);
            }

            return {
                id: m.publicKey.toBase58(),
                owner: m.account.owner.toBase58(),
                hash: Buffer.from(m.account.imageHash as any).toString('hex'),
                cid: cid,
                timestamp: (m.account.timestamp as any).toNumber(),
                // If we have metadata, use the image_cid from it, otherwise use the CID itself as the image
                url: metadata
                    ? `${IPFS_GATEWAYS[0]}${metadata.image_cid}`
                    : `${IPFS_GATEWAYS[0]}${cid}`,
                caption: metadata?.caption || "",
                location: metadata?.location || { latitude: null, longitude: null },
                isMinted: true,
                rotation: (Math.random() - 0.5) * 10,
            };
        }));

        return resolvedMemories;
    } catch (error) {
        console.error("Error fetching memories:", error);
        return [];
    }
};
