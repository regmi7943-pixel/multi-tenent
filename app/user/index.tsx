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

export default function UserDashboard() {
    const router = useRouter();
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const handleLogout = () => {
        api.setToken(null);
        router.replace('/');
    };

    const menuItems = [
        { title: 'My Orders', description: 'View your order history', icon: '📋' },
        { title: 'Make Order', description: 'Place a new order', icon: '🛍️' },
        { title: 'Profile', description: 'Manage your account', icon: '👤' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.contentContainer, !isMobile && { maxWidth: CONTENT_MAX_WIDTH.medium }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Heading level="h1">Welcome! 👋</Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                            Your personal dashboard
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
