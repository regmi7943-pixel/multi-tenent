import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { EyeIcon } from '../components/atoms/EyeIcon';
import { Heading } from '../components/atoms/Heading';
import { Input } from '../components/atoms/Input';
import { Text } from '../components/atoms/Text';
import { BiometricPromptModal } from '../components/molecules/BiometricPromptModal';
import { BiometricWelcomeModal } from '../components/molecules/BiometricWelcomeModal';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { BiometricService } from '../services/biometrics';
import { loginStyles as styles } from '../styles/loginStyles';

export default function LoginScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    // Biometric Modal State
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [pendingBiometricData, setPendingBiometricData] = useState<{ token: string, user: any } | null>(null);

    // Food icons to rotate through
    const foodIcons = ['🍕', '🍔', '🍟', '🌮', '🍝', '🍜', '🍱', '🍽️', '🥗', '🍱'];
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    // Animations
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const checkBiometrics = async () => {
        const supported = await BiometricService.checkDeviceSupport();
        if (supported) {
            // Check if we have stored credentials
            const { token } = await BiometricService.getCredentials();
            if (token) {
                setIsBiometricSupported(true);
                // Show welcome modal on app open
                setShowWelcomeModal(true);
            } else {
                setIsBiometricSupported(false);
            }
        } else {
            setIsBiometricSupported(false);
        }
    };

    useEffect(() => {
        // Check for biometric support
        checkBiometrics();

        // Initial slide in animation
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, []);

    useEffect(() => {
        // Rotate icons every 3 seconds
        const interval = setInterval(() => {
            // Fade out and scale down
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 300,
                    useNativeDriver: Platform.OS !== 'web',
                })
            ]).start(() => {
                // Change icon
                setCurrentIconIndex((prev) => (prev + 1) % foodIcons.length);

                // Fade in and scale up
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: Platform.OS !== 'web',
                    })
                ]).start();
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: Platform.OS !== 'web' }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: Platform.OS !== 'web' }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: Platform.OS !== 'web' }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: Platform.OS !== 'web' })
        ]).start();
    };

    const handleBiometricLogin = async () => {
        const authenticated = await BiometricService.authenticate();
        if (authenticated) {
            setLoading(true);
            try {
                const { token, user } = await BiometricService.getCredentials();
                if (token && user) {
                    api.setToken(token);
                    api.setUser(user);

                    // Navigate based on role
                    if (user.role === 'admin') {
                        router.replace('/admin' as any);
                    } else {
                        router.replace('/user' as any);
                    }
                } else {
                    setErrorMessage('No stored credentials found. Please login with password first.');
                    triggerShake();
                }
            } catch (error) {
                setErrorMessage('Biometric login failed');
                triggerShake();
            } finally {
                setLoading(false);
            }
        }
    };

    const promptForBiometrics = async (token: string, user: any) => {
        const supported = await BiometricService.checkDeviceSupport();
        if (!supported) {
            navigateToDashboard(user);
            return;
        }

        // Check if already enabled
        const { token: existingToken } = await BiometricService.getCredentials();
        if (existingToken) {
            navigateToDashboard(user);
            return;
        }

        // Store data for callback and show modal immediately
        setPendingBiometricData({ token, user });
        setShowBiometricModal(true);
    };

    const handleBiometricConfirm = async () => {
        if (pendingBiometricData) {
            const authenticated = await BiometricService.authenticate();
            if (authenticated) {
                await BiometricService.saveCredentials(pendingBiometricData.token, pendingBiometricData.user);
                setIsBiometricSupported(true);
            }
            setShowBiometricModal(false);
            navigateToDashboard(pendingBiometricData.user);
        }
    };

    const handleBiometricCancel = () => {
        setShowBiometricModal(false);
        if (pendingBiometricData) {
            navigateToDashboard(pendingBiometricData.user);
        }
    };

    const navigateToDashboard = (user: any) => {
        if (user.role === 'admin') {
            router.replace('/admin' as any);
        } else {
            router.replace('/user' as any);
        }
    };

    const handleLogin = async () => {
        setErrorMessage(''); // Clear previous errors

        if (!email || !password) {
            setErrorMessage('Please enter both email and password');
            triggerShake();
            return;
        }

        setLoading(true);
        try {
            const response = await api.login(email, password);
            if (response.token) {
                api.setToken(response.token);

                // Store user info
                if (response.user || response._id) {
                    const user = response.user || response;
                    api.setUser(user);

                    // Check if we need to prompt for biometrics
                    // If we do, the modal will handle navigation
                    // If not, promptForBiometrics will handle navigation immediately
                    promptForBiometrics(response.token, user);
                } else {
                    // Fallback if no user object
                    router.replace('/user' as any);
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Invalid email or password');
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const handleWelcomeBiometricPress = async () => {
        // Don't close modal yet - keep it open during authentication
        const authenticated = await BiometricService.authenticate();
        if (authenticated) {
            try {
                const { token, user } = await BiometricService.getCredentials();
                if (token && user) {
                    api.setToken(token);
                    api.setUser(user);

                    // Close modal on success
                    setShowWelcomeModal(false);

                    // Navigate based on role
                    if (user.role === 'admin') {
                        router.replace('/admin' as any);
                    } else {
                        router.replace('/user' as any);
                    }
                } else {
                    // Close modal and show error
                    setShowWelcomeModal(false);
                    setErrorMessage('No stored credentials found.');
                    triggerShake();
                }
            } catch (error) {
                // Close modal and show error
                setShowWelcomeModal(false);
                setErrorMessage('Biometric login failed');
                triggerShake();
            }
        }
        // If authentication was cancelled, modal stays open
    };

    const handleUsePassword = () => {
        setShowWelcomeModal(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[
                    styles.contentContainer,
                    !isMobile && { maxWidth: 400, width: '100%' }
                ]}>
                    {/* Food Icon with slide and rotation animation */}
                    <Animated.View style={[
                        styles.iconContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}>
                        <Animated.View style={[
                            styles.foodIcon,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}>
                            <Text style={styles.foodIconText}>{foodIcons[currentIconIndex]}</Text>
                        </Animated.View>
                    </Animated.View>

                    <View style={styles.header}>
                        <Heading level="h1" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
                            Welcome Back
                        </Heading>
                        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
                            Sign in to continue to your account
                        </Text>
                    </View>

                    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                        <Card style={styles.formCard}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
                                    Email Address
                                </Text>
                                <Input
                                    placeholder="name@example.com"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setErrorMessage('');
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    disabled={loading}
                                    style={errorMessage ? { borderColor: theme.colors.error } : undefined}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
                                    Password
                                </Text>
                                <Input
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setErrorMessage('');
                                    }}
                                    secureTextEntry={!showPassword}
                                    disabled={loading}
                                    style={errorMessage ? { borderColor: theme.colors.error } : undefined}
                                    rightIcon={
                                        <EyeIcon
                                            visible={showPassword}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />
                            </View>

                            {errorMessage ? (
                                <Text style={{
                                    color: theme.colors.error,
                                    textAlign: 'center',
                                    marginBottom: theme.spacing.md,
                                    fontWeight: '500'
                                }}>
                                    {errorMessage}
                                </Text>
                            ) : null}

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: errorMessage ? 0 : theme.spacing.md }}>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onPress={handleLogin}
                                    loading={loading}
                                    style={{ flex: 1, marginRight: theme.spacing.sm }}
                                >
                                    Sign In
                                </Button>

                                {isBiometricSupported && (
                                    <TouchableOpacity
                                        onPress={() => setShowWelcomeModal(true)}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            backgroundColor: theme.colors.primary + '10',
                                            borderColor: theme.colors.primary,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Ionicons
                                            name="finger-print"
                                            size={24}
                                            color={theme.colors.primary}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>

            <BiometricWelcomeModal
                visible={showWelcomeModal}
                onBiometricPress={handleWelcomeBiometricPress}
                onPasswordPress={handleUsePassword}
            />

            <BiometricPromptModal
                visible={showBiometricModal}
                onConfirm={handleBiometricConfirm}
                onCancel={handleBiometricCancel}
            />
        </KeyboardAvoidingView>
    );
}
