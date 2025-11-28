import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const BiometricService = {
    /**
     * Check if the device supports biometric authentication
     */
    checkDeviceSupport: async (): Promise<boolean> => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            return hasHardware && isEnrolled;
        } catch (error) {
            console.error('Biometric support check failed:', error);
            return false;
        }
    },

    /**
     * Get the available biometric types (Fingerprint, FaceID, etc.)
     */
    getBiometricTypes: async (): Promise<LocalAuthentication.AuthenticationType[]> => {
        try {
            return await LocalAuthentication.supportedAuthenticationTypesAsync();
        } catch (error) {
            console.error('Failed to get biometric types:', error);
            return [];
        }
    },

    /**
     * Authenticate the user using biometrics
     */
    authenticate: async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with Biometrics',
                fallbackLabel: 'Use Passcode',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
            });
            return result.success;
        } catch (error) {
            console.error('Biometric authentication failed:', error);
            return false;
        }
    },

    /**
     * Securely store the auth token
     */
    saveCredentials: async (token: string, user: any): Promise<void> => {
        try {
            if (Platform.OS !== 'web') {
                await SecureStore.setItemAsync(TOKEN_KEY, token);
                await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
            } else {
                // Fallback for web (not secure, but functional for dev)
                localStorage.setItem(TOKEN_KEY, token);
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            }
        } catch (error) {
            console.error('Failed to save credentials:', error);
        }
    },

    /**
     * Retrieve stored credentials
     */
    getCredentials: async (): Promise<{ token: string | null; user: any | null }> => {
        try {
            let token: string | null = null;
            let userStr: string | null = null;

            if (Platform.OS !== 'web') {
                token = await SecureStore.getItemAsync(TOKEN_KEY);
                userStr = await SecureStore.getItemAsync(USER_KEY);
            } else {
                token = localStorage.getItem(TOKEN_KEY);
                userStr = localStorage.getItem(USER_KEY);
            }

            return {
                token,
                user: userStr ? JSON.parse(userStr) : null,
            };
        } catch (error) {
            console.error('Failed to get credentials:', error);
            return { token: null, user: null };
        }
    },

    /**
     * Clear stored credentials (logout)
     */
    clearCredentials: async (): Promise<void> => {
        try {
            if (Platform.OS !== 'web') {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync(USER_KEY);
            } else {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        } catch (error) {
            console.error('Failed to clear credentials:', error);
        }
    }
};
