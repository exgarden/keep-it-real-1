import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PolaroidPhoto } from '../types';

// Finalized Program ID for Keep It Real
export const PROGRAM_ID = new PublicKey('KrealMoment11111111111111111111111111111111');

export const getConnection = () => {
    return new Connection(clusterApiUrl('devnet'), 'confirmed');
};

export const getProvider = (wallet: any) => {
    const connection = getConnection();
    return new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
};

export const getProgram = (wallet: any, idl: Idl) => {
    const provider = getProvider(wallet);
    return new Program(idl, provider);
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
export const uploadToIPFS = async (imageBlob: Blob): Promise<string> => {
    console.log("Mocking IPFS upload...");
    // Return a mock CID for development
    return "Qm" + Math.random().toString(36).substring(2, 46);
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
        const memories = await program.account.realityProof.all([
            {
                memcmp: {
                    offset: 8, // After 8-byte discriminator
                    bytes: wallet.publicKey.toBase58(),
                },
            },
        ]);

        return memories.map(m => ({
            id: m.publicKey.toBase58(),
            owner: m.account.owner.toBase58(),
            hash: Buffer.from(m.account.imageHash as any).toString('hex'),
            cid: m.account.ipfsCid as string,
            timestamp: (m.account.timestamp as any).toNumber(),
            // URL reconstructed from IPFS gateway
            url: `https://gateway.pinata.cloud/ipfs/${m.account.ipfsCid}`,
            isMinted: true,
            rotation: (Math.random() - 0.5) * 10,
        }));
    } catch (error) {
        console.error("Failed to sync memories:", error);
        return [];
    }
};
