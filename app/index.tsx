import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
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

    // Food icons to rotate through
    const foodIcons = ['🍕', '🍔', '🍟', '🌮', '🍝', '🍜', '🍱', '🍽️', '🥗', '🍱'];
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    // Animation for the food icon
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Initial slide in animation
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
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
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                // Change icon
                setCurrentIconIndex((prev) => (prev + 1) % foodIcons.length);

                // Fade in and scale up
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    })
                ]).start();
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
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
                        router.replace('/admin-dashboard');
                    } else {
                        router.replace('/user-dashboard');
                    }
                } else {
                    Alert.alert('Success', 'Login successful!');
                }
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'An error occurred');
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

                    <Card style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
                                Email Address
                            </Text>
                            <Input
                                placeholder="name@example.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                disabled={loading}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
                                Password
                            </Text>
                            <Input
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                disabled={loading}
                                rightIcon={
                                    <EyeIcon
                                        visible={showPassword}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                        </View>

                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            onPress={handleLogin}
                            loading={loading}
                            style={{ marginTop: theme.spacing.md }}
                        >
                            Sign In
                        </Button>

                        <View style={styles.footer}>


                        </View>
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


