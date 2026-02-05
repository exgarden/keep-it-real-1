import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';

// Placeholder for the program ID and IDL
// This will be updated once the program is deployed
export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); // Placeholder

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

export interface MemoryMetadata {
    imageHash: string;
    timestamp: number;
    caption: string;
    location?: string;
}

/**
 * Mocks the hash generation for the image.
 * In a production app, this would be a SHA-256 hash or an IPFS CID.
 */
export const generateImageHash = async (imageBlob: Blob): Promise<string> => {
    // Simple representation for now
    const arrayBuffer = await imageBlob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
};
