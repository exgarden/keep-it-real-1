import { Inter, Bodoni_Moda, Special_Elite } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { SolanaProvider } from '@/components/providers/SolanaProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni' });
const typewriter = Special_Elite({ weight: '400', subsets: ['latin'], variable: '--font-typewriter' });

export const metadata: Metadata = {
    title: 'Keep It Real',
    description: 'Polaroid Camera App on Solana',
    manifest: '/manifest.json', // Will be added later for PWA
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Keep It Real'
    }
};

export const viewport = {
    themeColor: '#2A2A2A',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${bodoni.variable} ${typewriter.variable}`}>
            <body className="bg-desk-texture bg-desk-size bg-vintage-white text-charcoal font-sans antialiased selection:bg-emerald/30">
                <SolanaProvider>
                    {children}
                </SolanaProvider>
            </body>
        </html>
    );
}
