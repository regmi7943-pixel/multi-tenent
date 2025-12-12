import React from 'react';
import { Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export interface ConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
    style?: ViewStyle;
    showCancel?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    style,
    showCancel = true,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

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
                                width: isMobile ? '90%' : 400,
                                maxWidth: '90%',
                            },
                            style,
                        ]}
                    >
                        <Heading level="h4" style={{ marginBottom: theme.spacing.md }}>
                            {title}
                        </Heading>
                        <Text
                            size="md"
                            color={theme.colors.textSecondary}
                            style={{ marginBottom: theme.spacing.lg }}
                        >
                            {message}
                        </Text>
                        <View
                            style={[
                                styles.buttonContainer,
                                isMobile ? styles.buttonContainerMobile : styles.buttonContainerDesktop,
                                { gap: theme.spacing.sm },
                            ]}
                        >
                            {showCancel && (
                                <Button
                                    variant="outline"
                                    onPress={onClose}
                                    style={isMobile ? styles.buttonMobile : styles.buttonDesktop}
                                >
                                    {cancelText}
                                </Button>
                            )}
                            <Button
                                variant={variant === 'danger' ? 'danger' : 'primary'}
                                onPress={() => {
                                    onConfirm();
                                    if (!showCancel) onClose(); // Auto-close if acting as alert
                                }}
                                style={isMobile ? styles.buttonMobile : styles.buttonDesktop}
                            >
                                {confirmText}
                            </Button>
                        </View>
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
    buttonContainer: {
        flexDirection: 'row',
    },
    buttonContainerMobile: {
        flexDirection: 'column-reverse',
    },
    buttonContainerDesktop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonMobile: {
        width: '100%',
    },
    buttonDesktop: {
        minWidth: 100,
    },
});
