import React, { useState } from 'react';
import { Wallet, ExternalLink, Copy, Check } from 'lucide-react';

interface WalletConnectionProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: (connected: boolean) => void;
  onAddressChange: (address: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  walletAddress,
  onConnect,
  onAddressChange
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // This component is specifically designed for Phantom Wallet (Solana).
      // It does NOT interact with MetaMask (window.ethereum).
      // If you are seeing MetaMask errors, please check other parts of your application.
      if (typeof window !== 'undefined' && (window as any).solana) {
        const phantom = (window as any).solana;
        
        // Gerçek Phantom bağlantısı
        const response = await phantom.connect();
        
        if (response.publicKey) {
          const address = response.publicKey.toString();
          onAddressChange(address);
          onConnect(true);
          console.log('Phantom Wallet bağlandı:', address);
        } else {
          throw new Error('Phantom Wallet bağlantısı başarısız');
        }
        
        setIsConnecting(false);
      } else {
        // Phantom not installed, redirect to install page
        window.open('https://phantom.app/', '_blank');
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Phantom Wallet bağlantısı başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    // Phantom'dan bağlantıyı kes
    if (typeof window !== 'undefined' && (window as any).solana) {
      try {
        (window as any).solana.disconnect();
      } catch (error) {
        console.error('Phantom disconnect error:', error);
      }
    }
    
    onConnect(false);
    onAddressChange('');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isConnecting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
        }`}
      >
        <Wallet size={16} />
        <span>{isConnecting ? 'Connecting...' : 'Connect Phantom'}</span>
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
        <Wallet size={16} />
        <span className="hidden sm:inline">
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </span>
        <span className="sm:hidden">Connected</span>
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Wallet Address</span>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-600" />}
            </button>
          </div>
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3 break-all">
            {walletAddress}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank')}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              <ExternalLink size={14} />
              <span>View Explorer</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
