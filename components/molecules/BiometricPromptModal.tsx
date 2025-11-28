import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../atoms/Button';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

interface BiometricPromptModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const BiometricPromptModal: React.FC<BiometricPromptModalProps> = ({
    visible,
    onConfirm,
    onCancel,
}) => {
    const { theme } = useTheme();
    const slideAnim = useRef(new Animated.Value(300)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: theme.colors.surface,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
                            <Ionicons name="finger-print" size={48} color={theme.colors.primary} />
                        </View>
                    </View>

                    <Heading level="h2" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
                        Enable Biometric Login?
                    </Heading>

                    <Text
                        style={{
                            textAlign: 'center',
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.xl,
                            lineHeight: 22,
                        }}
                    >
                        Would you like to use your fingerprint or face ID for faster and more secure login next time?
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Button
                            variant="ghost"
                            onPress={onCancel}
                            style={{ flex: 1, marginRight: theme.spacing.sm }}
                        >
                            No, Thanks
                        </Button>
                        <Button
                            variant="primary"
                            onPress={onConfirm}
                            style={{ flex: 1, marginLeft: theme.spacing.sm }}
                        >
                            Yes, Enable
                        </Button>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
