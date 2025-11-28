import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
import { useTheme } from '../../hooks/useTheme';
import { api } from '../../services/api';
import { BiometricService } from '../../services/biometrics';
import { dashboardStyles as styles } from '../../styles';

export default function SettingsScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        api.setToken(null);
        router.replace('/');
    };

    const handleClearCredentialsLogout = async () => {
        await BiometricService.clearCredentials();
        api.setToken(null);
        router.replace('/');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Heading level="h1">Settings ⚙️</Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                            App configuration and preferences
                        </Text>
                    </View>

                    <View style={{ marginTop: theme.spacing.xl }}>
                        <Heading level="h3" style={{ marginBottom: theme.spacing.md }}>Account Actions</Heading>

                        <TouchableOpacity
                            onPress={handleClearCredentialsLogout}
                            style={{
                                backgroundColor: theme.colors.warning + '20',
                                borderColor: theme.colors.warning,
                                borderWidth: 1,
                                padding: theme.spacing.md,
                                borderRadius: 8,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: theme.spacing.sm
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color={theme.colors.warning} />
                            <Text style={{ color: theme.colors.warning, marginLeft: theme.spacing.sm, fontWeight: '600' }}>Clear All & Logout</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            style={{
                                backgroundColor: theme.colors.error + '20',
                                borderColor: theme.colors.error,
                                borderWidth: 1,
                                padding: theme.spacing.md,
                                borderRadius: 8,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                            <Text style={{ color: theme.colors.error, marginLeft: theme.spacing.sm, fontWeight: '600' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
