import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    visible: boolean;
    message: string;
    variant?: ToastVariant;
    duration?: number;
    onDismiss: () => void;
    action?: {
        label: string;
        onPress: () => void;
    };
    style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    variant = 'info',
    duration = 3000,
    onDismiss,
    action,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const translateY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: Platform.OS !== 'web',
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: Platform.OS !== 'web',
                }),
            ]).start();

            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleDismiss();
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            handleDismiss();
        }
    }, [visible, duration]);

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 100,
                duration: 200,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start(() => {
            onDismiss();
        });
    };

    const variantConfig: Record<
        ToastVariant,
        { bg: string; icon: keyof typeof Ionicons.glyphMap }
    > = {
        success: { bg: theme.colors.success, icon: 'checkmark-circle' },
        error: { bg: theme.colors.error, icon: 'close-circle' },
        warning: { bg: theme.colors.warning, icon: 'warning' },
        info: { bg: theme.colors.info, icon: 'information-circle' },
    };

    const config = variantConfig[variant];

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: config.bg,
                    borderRadius: theme.radius.md,
                    padding: theme.spacing.md,
                    ...theme.shadows.lg,
                    transform: [{ translateY }],
                    opacity,
                    maxWidth: isMobile ? '90%' : 600,
                    bottom: isMobile ? theme.spacing.lg : theme.spacing.xl,
                },
                isMobile ? styles.containerMobile : styles.containerDesktop,
                style,
            ]}
        >
            <Ionicons name={config.icon} size={24} color="#ffffff" style={{ marginRight: theme.spacing.sm }} />
            <Text
                size="md"
                style={{ color: '#ffffff', flex: 1 }}
            >
                {message}
            </Text>
            {action && (
                <TouchableOpacity
                    onPress={() => {
                        action.onPress();
                        handleDismiss();
                    }}
                    style={{ marginLeft: theme.spacing.md }}
                >
                    <Text size="md" bold style={{ color: '#ffffff' }}>
                        {action.label}
                    </Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                onPress={handleDismiss}
                style={{ marginLeft: theme.spacing.sm }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 9999,
    },
    containerMobile: {
        left: '5%',
        right: '5%',
    },
    containerDesktop: {
        left: '50%',
        transform: [{ translateX: -300 }],
    },
});
