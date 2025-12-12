import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    style?: ViewStyle;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onClose,
    title = 'Success',
    message,
    buttonText = 'OK',
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    // Animation value for scale
    const scale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = 0; // Reset
            scale.value = withDelay(100, withSpring(1, {
                damping: 12,
                stiffness: 100,
            }));
        }
    }, [visible]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={[
                    styles.backdrop,
                    { backgroundColor: theme.colors.backdrop },
                ]}
                onPress={onClose}
            >
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Card
                        style={[
                            styles.modal,
                            {
                                width: isMobile ? '85%' : 380,
                                maxWidth: '90%',
                                alignItems: 'center',
                                paddingVertical: theme.spacing.xl,
                            },
                            style,
                        ]}
                    >
                        <Animated.View style={[
                            styles.iconContainer,
                            { backgroundColor: theme.colors.success + '20' }, // Light green bg
                            animatedIconStyle
                        ]}>
                            <Ionicons
                                name="checkmark"
                                size={40}
                                color={theme.colors.success}
                            />
                        </Animated.View>

                        <Heading level="h4" style={{ marginBottom: theme.spacing.sm, marginTop: theme.spacing.md }}>
                            {title}
                        </Heading>

                        <Text
                            size="md"
                            color={theme.colors.textSecondary}
                            style={{ marginBottom: theme.spacing.xl, textAlign: 'center' }}
                        >
                            {message}
                        </Text>

                        <Button
                            variant="primary"
                            onPress={onClose}
                            style={{ minWidth: 120 }}
                        >
                            {buttonText}
                        </Button>
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        alignSelf: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    }
});
