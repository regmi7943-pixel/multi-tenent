import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View
} from 'react-native';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { EyeIcon } from '../components/atoms/EyeIcon';
import { Heading } from '../components/atoms/Heading';
import { Input } from '../components/atoms/Input';
import { Text } from '../components/atoms/Text';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
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

    // Food icons to rotate through
    const foodIcons = ['🍕', '🍔', '🍟', '🌮', '🍝', '🍜', '🍱', '🍽️', '🥗', '🍱'];
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    // Animations
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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

                    // Navigate based on role
                    if (user.role === 'admin') {
                        router.replace('/admin' as any);
                    } else {
                        router.replace('/user' as any);
                    }
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

                            <Button
                                variant="primary"
                                size="md"
                                fullWidth
                                onPress={handleLogin}
                                loading={loading}
                                style={{ marginTop: errorMessage ? 0 : theme.spacing.md }}
                            >
                                Sign In
                            </Button>

                            <View style={styles.footer}>
                                <Text style={{ color: theme.colors.textSecondary }}>
                                    Don't have an account?{' '}
                                </Text>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => router.push('/register' as any)}
                                >
                                    Sign Up
                                </Button>
                            </View>
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
