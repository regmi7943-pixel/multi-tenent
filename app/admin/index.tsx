import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { api } from '../../services/api';
import { CONTENT_MAX_WIDTH, dashboardStyles as styles } from '../../styles';

export default function AdminDashboard() {
    const router = useRouter();
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const handleLogout = () => {
        api.setToken(null);
        router.replace('/');
    };

    const menuItems = [
        { title: 'Products Management', description: 'Add, edit, and manage products', icon: '📦' },
        { title: 'Orders (POS)', description: 'View and manage POS orders', icon: '🛒' },
        { title: 'Customers', description: 'Manage customer accounts and credit', icon: '👥' },
        { title: 'Waiter Orders', description: 'View orders from waiter app', icon: '🍽️' },
        { title: 'Payments', description: 'Track payments and credits', icon: '💰' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.contentContainer, !isMobile && { maxWidth: CONTENT_MAX_WIDTH.medium }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Heading level="h1">Admin Dashboard 👨‍💼</Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                            Welcome back! Manage your POS system
                        </Text>
                    </View>

                    {/* Menu Grid */}
                    <View style={styles.grid}>
                        {menuItems.map((item, index) => (
                            <Card
                                key={index}
                                style={[
                                    styles.menuCard,
                                    isMobile && styles.menuCardMobile
                                ]}
                                elevated
                            >
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Heading level="h3" style={{ marginTop: theme.spacing.sm }}>
                                    {item.title}
                                </Heading>
                                <Text
                                    style={{
                                        color: theme.colors.textSecondary,
                                        marginTop: theme.spacing.xs,
                                        textAlign: 'center'
                                    }}
                                >
                                    {item.description}
                                </Text>
                            </Card>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <Button
                        variant="outline"
                        size="md"
                        onPress={handleLogout}
                        style={{ marginTop: theme.spacing.xl }}
                    >
                        Logout
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}
