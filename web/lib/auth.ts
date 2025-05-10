import { getRedisClient } from './redis';

export async function verifyNonce(walletAddress: string, nonce: string): Promise<boolean> {
  try {
    const redis = await getRedisClient();
    const nonceKey = `auth:nonce:${walletAddress}`;
    
    const storedNonce = await redis.get(nonceKey);
    
    if (!storedNonce || storedNonce !== nonce) {
      return false;
    }
    
    await redis.del(nonceKey);
    
    return true;
  } catch (error) {
    console.error('Error verifying nonce:', error);
    return false;
  }
}

export function generateSignMessage(walletAddress: string, nonce: string): string {
  return `Sign this message to authenticate with Roster Rumble: ${nonce}`;
}