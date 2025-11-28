import React from 'react';
import { ScrollView, View } from 'react-native';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
import { useTheme } from '../../hooks/useTheme';
import { dashboardStyles as styles } from '../../styles';

export default function OrdersScreen() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Heading level="h1">Orders 🛒</Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                            Manage your POS orders here
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100
                    }}>
                        <Text style={{ color: theme.colors.textSecondary }}>No orders yet</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
