import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { api } from '../../services/api';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

export interface CreateWaiterModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    style?: ViewStyle;
}

export const CreateWaiterModal: React.FC<CreateWaiterModalProps> = ({
    visible,
    onClose,
    onSuccess,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ name: false, email: false, password: false });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        // Reset errors
        setErrors({ name: false, email: false, password: false });

        // Validation
        let hasError = false;
        const newErrors = { name: false, email: false, password: false };

        if (!name.trim()) {
            newErrors.name = true;
            hasError = true;
        }

        if (!email.trim() || !validateEmail(email)) {
            newErrors.email = true;
            hasError = true;
        }

        if (!password || password.length < 6) {
            newErrors.password = true;
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            Alert.alert('Validation Error', 'Please fill all fields correctly. Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await api.register(name, email, password);
            Alert.alert('Success', `Waiter "${name}" has been created successfully!`);

            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setErrors({ name: false, email: false, password: false });

            onSuccess?.();
            onClose();
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create waiter. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setName('');
            setEmail('');
            setPassword('');
            setErrors({ name: false, email: false, password: false });
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <Pressable
                style={[
                    styles.backdrop,
                    { backgroundColor: theme.colors.backdrop },
                ]}
                onPress={handleClose}
            >
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Card
                        style={[
                            styles.modal,
                            {
                                width: isMobile ? '90%' : 450,
                                maxWidth: '90%',
                            },
                            style,
                        ]}
                    >
                        <Heading level="h4" style={{ marginBottom: theme.spacing.sm }}>
                            Create New Waiter
                        </Heading>
                        <Text
                            size="sm"
                            color={theme.colors.textSecondary}
                            style={{ marginBottom: theme.spacing.lg }}
                        >
                            Add a new waiter account to the system
                        </Text>

                        {/* Name Input */}
                        <View style={{ marginBottom: theme.spacing.md }}>
                            <Text
                                size="sm"
                                medium
                                style={{ marginBottom: theme.spacing.xs }}
                            >
                                Name
                            </Text>
                            <Input
                                placeholder="Enter waiter name"
                                value={name}
                                onChangeText={setName}
                                error={errors.name}
                                editable={!loading}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={{ marginBottom: theme.spacing.md }}>
                            <Text
                                size="sm"
                                medium
                                style={{ marginBottom: theme.spacing.xs }}
                            >
                                Email
                            </Text>
                            <Input
                                placeholder="Enter email address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={errors.email}
                                editable={!loading}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={{ marginBottom: theme.spacing.lg }}>
                            <Text
                                size="sm"
                                medium
                                style={{ marginBottom: theme.spacing.xs }}
                            >
                                Password
                            </Text>
                            <Input
                                placeholder="Enter password (min 6 characters)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                error={errors.password}
                                editable={!loading}
                            />
                        </View>

                        <View
                            style={[
                                styles.buttonContainer,
                                isMobile ? styles.buttonContainerMobile : styles.buttonContainerDesktop,
                                { gap: theme.spacing.sm },
                            ]}
                        >
                            <Button
                                variant="outline"
                                onPress={handleClose}
                                style={isMobile ? styles.buttonMobile : styles.buttonDesktop}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onPress={handleSubmit}
                                style={isMobile ? styles.buttonMobile : styles.buttonDesktop}
                                loading={loading}
                                disabled={loading}
                            >
                                Create Waiter
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
