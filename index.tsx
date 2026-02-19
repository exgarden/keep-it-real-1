console.log("index.tsx starting...");
import { Buffer } from 'buffer';
window.Buffer = Buffer;
console.log("Buffer polyfill set");

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
console.log("App component imported");

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
console.log("Solana imports done");

import '@solana/wallet-adapter-react-ui/styles.css';

const Root = () => {
  console.log("Rendering Root component");
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const rootElement = document.getElementById('root');
console.log("Root element found:", !!rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
  console.log("React render called");
}
