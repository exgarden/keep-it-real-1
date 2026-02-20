'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// Webpack ProvidePlugin now handles Buffer and process globally.
// This file focuses on the provider configuration.

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Devnet;

    // Helius RPC is recommended for production-grade Devnet stability
    const endpoint = useMemo(() => {
        const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
        if (apiKey) return `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
        return clusterApiUrl(network);
    }, [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
