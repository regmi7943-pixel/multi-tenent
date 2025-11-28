import React from 'react';
import { ScrollView, View } from 'react-native';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
import { useTheme } from '../../hooks/useTheme';
import { dashboardStyles as styles } from '../../styles';

export default function InventoryScreen() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Heading level="h1">Inventory 📦</Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                            Manage your products and stock
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100
                    }}>
                        <Text style={{ color: theme.colors.textSecondary }}>Inventory management coming soon</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
