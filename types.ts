
export type AppScreen = 'home' | 'camera' | 'preview' | 'metadata' | 'minting' | 'printing' | 'success' | 'gallery' | 'wallet' | 'settings';

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  label?: string;
}

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  timestamp: number;
  location: LocationData;
  hash: string;
  isMinted: boolean;
  rotation: number;
  owner: string;
}

export interface CameraSettings {
  flash: boolean;
  timer: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: 'phantom' | 'solflare' | 'none';
}
