import React from 'react';
import { ScrollView, View } from 'react-native';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
import { useTheme } from '../../hooks/useTheme';
import { dashboardStyles as styles } from '../../styles';

export default function ProfileScreen() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Heading level="h1">Profile 👤</Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                            Manage your admin profile
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100
                    }}>
                        <Text style={{ color: theme.colors.textSecondary }}>Profile settings coming soon</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
