import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

export interface PromptModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (value: string) => void;
    title: string;
    message: string;
    defaultValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    style?: ViewStyle;
}

export const PromptModal: React.FC<PromptModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    defaultValue = '',
    placeholder = '',
    confirmText = 'OK',
    cancelText = 'Cancel',
    keyboardType = 'default',
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const [value, setValue] = useState(defaultValue);

    // Reset value when modal opens
    React.useEffect(() => {
        if (visible) {
            setValue(defaultValue);
        }
    }, [visible, defaultValue]);

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
                            style={{ marginBottom: theme.spacing.md }}
                        >
                            {message}
                        </Text>

                        <Input
                            value={value}
                            onChangeText={setValue}
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            containerStyle={{ marginBottom: theme.spacing.lg }}
                            autoFocus
                        />

                        <View
                            style={[
                                styles.buttonContainer,
                                isMobile ? styles.buttonContainerMobile : styles.buttonContainerDesktop,
                                { gap: theme.spacing.sm },
                            ]}
                        >
                            <Button
                                variant="outline"
                                onPress={onClose}
                                style={isMobile ? styles.buttonMobile : styles.buttonDesktop}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant="primary"
                                onPress={() => {
                                    onConfirm(value);
                                    onClose();
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
