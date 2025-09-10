import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

// MEMEXSOL token kontrat adresi
const MEMEXSOL_MINT = new PublicKey('AsjP9VyKUSuLSeycoTb9AqGs3PH6BWAvqDoKmxrWpump');

// Solana bağlantısı (mainnet-beta kullanıyoruz)
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

export interface PaymentRequest {
  amount: number; // MEMEXSOL miktarı
  recipient: string; // Alıcı wallet adresi
  orderId: string; // Sipariş ID'si
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const processPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResult> => {
  try {
    console.log('Ödeme işlemi başlatılıyor:', paymentRequest);

    // Phantom Wallet kontrolü
    if (typeof window === 'undefined' || !(window as any).solana) {
      return {
        success: false,
        error: 'Phantom Wallet bulunamadı. Lütfen Phantom Wallet\'ı yükleyin ve sayfayı yenileyin.'
      };
    }

    const phantom = (window as any).solana;
    
    // Phantom'un bağlı olup olmadığını kontrol et
    if (!phantom.isConnected) {
      try {
        await phantom.connect();
      } catch (error) {
        return {
          success: false,
          error: 'Phantom Wallet bağlantısı başarısız. Lütfen cüzdanınızı bağlayın.'
        };
      }
    }

    // Kullanıcının cüzdan adresini al
    const userPublicKey = phantom.publicKey;
    if (!userPublicKey) {
      return {
        success: false,
        error: 'Cüzdan adresi alınamadı. Lütfen Phantom Wallet\'ı yeniden bağlayın.'
      };
    }

    const fromPubkey = new PublicKey(userPublicKey.toString());
    const toPubkey = new PublicKey(paymentRequest.recipient);

    console.log('Transfer detayları:', {
      from: fromPubkey.toString(),
      to: toPubkey.toString(),
      amount: paymentRequest.amount,
      token: MEMEXSOL_MINT.toString()
    });

    try {
      // Kullanıcının MEMEXSOL token hesabını bul
      const fromTokenAccount = await getAssociatedTokenAddress(
        MEMEXSOL_MINT,
        fromPubkey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Alıcının MEMEXSOL token hesabını bul
      const toTokenAccount = await getAssociatedTokenAddress(
        MEMEXSOL_MINT,
        toPubkey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      console.log('Token hesapları:', {
        fromTokenAccount: fromTokenAccount.toString(),
        toTokenAccount: toTokenAccount.toString()
      });

      // Kullanıcının token bakiyesini kontrol et
      try {
        const fromTokenAccountInfo = await connection.getTokenAccountBalance(fromTokenAccount);
        const balance = parseFloat(fromTokenAccountInfo.value.uiAmount || '0');
        
        console.log('Kullanıcı MEMEXSOL bakiyesi:', balance);
        
        if (balance < paymentRequest.amount) {
          return {
            success: false,
            error: `Yetersiz MEMEXSOL bakiyesi. Mevcut: ${balance.toFixed(2)}, Gerekli: ${paymentRequest.amount.toFixed(2)}`
          };
        }
      } catch (balanceError) {
        console.error('Bakiye kontrolü hatası:', balanceError);
        return {
          success: false,
          error: 'MEMEXSOL bakiyesi kontrol edilemedi. Token hesabınız mevcut olmayabilir.'
        };
      }

      // Alıcının token hesabının var olup olmadığını kontrol et
      try {
        await connection.getTokenAccountBalance(toTokenAccount);
      } catch (error) {
        return {
          success: false,
          error: 'Alıcının MEMEXSOL token hesabı bulunamadı. Lütfen geçerli bir alıcı adresi kullanın.'
        };
      }

      // Transfer miktarını token'ın decimal değerine göre ayarla (genellikle 6 veya 9)
      // MEMEXSOL için decimal değerini kontrol edelim
      const mintInfo = await connection.getParsedAccountInfo(MEMEXSOL_MINT);
      let decimals = 9; // Varsayılan değer
      
      if (mintInfo.value && mintInfo.value.data && 'parsed' in mintInfo.value.data) {
        decimals = mintInfo.value.data.parsed.info.decimals;
      }
      
      const transferAmount = Math.floor(paymentRequest.amount * Math.pow(10, decimals));
      
      console.log('Transfer miktarı hesaplandı:', {
        originalAmount: paymentRequest.amount,
        decimals: decimals,
        transferAmount: transferAmount
      });

      // Transaction oluştur
      const transaction = new Transaction();
      
      // Son blockhash'i al
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Transfer instruction'ı ekle
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPubkey,
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction);

      console.log('Transaction oluşturuldu, Phantom\'a gönderiliyor...');

      // Phantom ile transaction'ı imzala ve gönder
      const signedTransaction = await phantom.signAndSendTransaction(transaction);
      
      if (signedTransaction && signedTransaction.signature) {
        console.log('İşlem başarıyla gönderildi:', signedTransaction.signature);
        
        // İşlem onayını bekle
        try {
          const confirmation = await connection.confirmTransaction(signedTransaction.signature, 'confirmed');
          
          if (confirmation.value.err) {
            console.error('İşlem onaylanmadı:', confirmation.value.err);
            return {
              success: false,
              error: 'İşlem blockchain tarafından reddedildi.'
            };
          }
          
          console.log('İşlem onaylandı:', signedTransaction.signature);
          
          return {
            success: true,
            transactionId: signedTransaction.signature
          };
        } catch (confirmError) {
          console.error('İşlem onay hatası:', confirmError);
          // İşlem gönderildi ama onay beklenemedi
          return {
            success: true,
            transactionId: signedTransaction.signature
          };
        }
      } else {
        return {
          success: false,
          error: 'İşlem imzalanamadı veya gönderilmedi.'
        };
      }
      
    } catch (transactionError: any) {
      console.error('İşlem hatası:', transactionError);
      
      // Kullanıcı işlemi iptal ettiyse
      if (transactionError.code === 4001 || 
          transactionError.message?.includes('User rejected') ||
          transactionError.message?.includes('User cancelled')) {
        return {
          success: false,
          error: 'İşlem kullanıcı tarafından iptal edildi.'
        };
      }
      
      // Yetersiz bakiye hatası
      if (transactionError.message?.includes('insufficient funds') ||
          transactionError.message?.includes('Insufficient funds')) {
        return {
          success: false,
          error: 'Yetersiz MEMEXSOL bakiyesi veya SOL gas ücreti için yetersiz bakiye.'
        };
      }

      // Token hesabı bulunamadı hatası
      if (transactionError.message?.includes('could not find account') ||
          transactionError.message?.includes('Invalid account')) {
        return {
          success: false,
          error: 'MEMEXSOL token hesabı bulunamadı. Önce MEMEXSOL token\'ı cüzdanınıza eklemeniz gerekebilir.'
        };
      }
      
      return {
        success: false,
        error: `İşlem hatası: ${transactionError.message || 'Bilinmeyen hata'}`
      };
    }

  } catch (error: any) {
    console.error('Ödeme işlemi hatası:', error);
    return {
      success: false,
      error: error.message || 'Ödeme işlemi sırasında bir hata oluştu'
    };
  }
};

export const getPaymentWalletAddress = (): string => {
  return import.meta.env.VITE_PAYMENT_WALLET_ADDRESS || '3H4YYu3SmkpBc4uy614aYjW7rt4nRBEQ8P3rKeFMMzyw';
};

// Phantom Wallet bağlantısını kontrol et
export const checkPhantomConnection = async (): Promise<{ connected: boolean; address?: string; error?: string }> => {
  try {
    if (typeof window === 'undefined' || !(window as any).solana) {
      return {
        connected: false,
        error: 'Phantom Wallet yüklü değil'
      };
    }

    const phantom = (window as any).solana;
    
    if (!phantom.isConnected) {
      return {
        connected: false,
        error: 'Phantom Wallet bağlı değil'
      };
    }

    return {
      connected: true,
      address: phantom.publicKey?.toString()
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message || 'Bağlantı kontrolü başarısız'
    };
  }
};

// Kullanıcının MEMEXSOL bakiyesini kontrol et
export const checkMemexSolBalance = async (walletAddress: string): Promise<{ balance: number; error?: string }> => {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccount = await getAssociatedTokenAddress(
      MEMEXSOL_MINT,
      publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccount);
    const balance = parseFloat(tokenAccountInfo.value.uiAmount || '0');

    return { balance };
  } catch (error: any) {
    console.error('Bakiye kontrol hatası:', error);
    return { 
      balance: 0, 
      error: 'MEMEXSOL bakiyesi kontrol edilemedi' 
    };
  }
};
