import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

interface BiometricWelcomeModalProps {
    visible: boolean;
    onBiometricPress: () => void;
    onPasswordPress: () => void;
}

export const BiometricWelcomeModal: React.FC<BiometricWelcomeModalProps> = ({
    visible,
    onBiometricPress,
    onPasswordPress,
}) => {
    const { theme } = useTheme();
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            slideAnim.setValue(-50);
            fadeAnim.setValue(0);

            // Animate in
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                {/* Background with pattern */}
                <View style={styles.background}>
                    <View style={styles.circlePattern1} />
                    <View style={styles.circlePattern2} />
                </View>

                {/* Welcome text with animation */}
                <Animated.View
                    style={[
                        styles.welcomeArea,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Heading level="h1" style={styles.welcomeTitle}>
                        Welcome
                    </Heading>
                    <Text style={styles.welcomeSubtitle}>
                        quick sign in
                    </Text>
                </Animated.View>

                {/* Fingerprint button - centered */}
                <View style={styles.fingerprintArea}>
                    <TouchableOpacity
                        style={[styles.fingerprintButton, { borderColor: theme.colors.primary + '30' }]}
                        onPress={onBiometricPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="finger-print" size={60} color={theme.colors.primary} />
                        <Text style={styles.tapHereText}>Tap here</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom button with theme color */}
                <TouchableOpacity
                    style={[styles.bottomButton, { backgroundColor: theme.colors.primary }]}
                    onPress={onPasswordPress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.bottomButtonText}>Login with Password</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E1A',
        position: 'relative',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    circlePattern1: {
        position: 'absolute',
        top: -100,
        left: -150,
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        borderStyle: 'solid',
    },
    circlePattern2: {
        position: 'absolute',
        top: 20,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    welcomeArea: {
        position: 'absolute',
        top: 100,
        left: 40,
    },
    welcomeTitle: {
        fontSize: 52,
        fontWeight: '300',
        color: '#FFFFFF',
        marginBottom: 8,
        textTransform: 'lowercase',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        fontWeight: '400',
    },
    fingerprintArea: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fingerprintButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(30, 40, 60, 0.6)',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    tapHereText: {
        marginTop: 12,
        fontSize: 15,
        color: '#B0B0B0',
        fontWeight: '500',
    },
    bottomButton: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    bottomButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
