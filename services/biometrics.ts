import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'biometric_credentials';

export class BiometricService {
    /**
     * Check if the device supports biometric authentication
     */
    static async checkDeviceSupport(): Promise<boolean> {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) return false;

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            return enrolled;
        } catch (error) {
            console.error('Error checking biometric support:', error);
            return false;
        }
    }

    /**
     * Authenticate using biometrics
     */
    static async authenticate(): Promise<boolean> {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to continue',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
            });

            return result.success;
        } catch (error) {
            console.error('Biometric authentication error:', error);
            return false;
        }
    }

    /**
     * Save credentials securely
     */
    static async saveCredentials(token: string, user: any): Promise<void> {
        try {
            const credentials = JSON.stringify({ token, user });
            await SecureStore.setItemAsync(CREDENTIALS_KEY, credentials);
        } catch (error) {
            console.error('Error saving credentials:', error);
            throw error;
        }
    }

    /**
     * Get saved credentials
     */
    static async getCredentials(): Promise<{ token: string | null; user: any | null }> {
        try {
            const credentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
            if (credentials) {
                const parsed = JSON.parse(credentials);
                return { token: parsed.token, user: parsed.user };
            }
            return { token: null, user: null };
        } catch (error) {
            console.error('Error getting credentials:', error);
            return { token: null, user: null };
        }
    }

    /**
     * Clear stored credentials
     */
    static async clearCredentials(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
        } catch (error) {
            console.error('Error clearing credentials:', error);
        }
    }

    /**
     * Get the type of biometric authentication available
     * Returns 'face' for facial recognition, 'fingerprint' for fingerprint, or null if none
     */
    static async getBiometricType(): Promise<'face' | 'fingerprint' | null> {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) return null;

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) return null;

            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

            // Prioritize face recognition if available
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                return 'face';
            }

            // Fallback to fingerprint
            if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                return 'fingerprint';
            }

            // For iris or other types, default to fingerprint icon
            return 'fingerprint';
        } catch (error) {
            console.error('Error detecting biometric type:', error);
            return null;
        }
    }
}
