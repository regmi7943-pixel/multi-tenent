import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../../components/atoms/Avatar';
import { Heading } from '../../../components/atoms/Heading';
import { Text } from '../../../components/atoms/Text';
import { useResponsive } from '../../../hooks/useResponsive';
import { useTheme } from '../../../hooks/useTheme';
import { api } from '../../../services/api';

interface Table {
    id: number;
    name: string;
    seats: number;
    type: 'Round' | 'Rect';
    zone: 'Main Hall' | 'Patio' | 'Booths';
}

// Mock Table Configuration
const TABLES_CONFIG: Table[] = [
    { id: 1, name: 'T1', seats: 4, type: 'Round', zone: 'Main Hall' },
    { id: 2, name: 'T2', seats: 4, type: 'Round', zone: 'Main Hall' },
    { id: 3, name: 'T3', seats: 4, type: 'Round', zone: 'Main Hall' },
    { id: 4, name: 'T4', seats: 4, type: 'Round', zone: 'Main Hall' },
    { id: 5, name: 'T5', seats: 2, type: 'Rect', zone: 'Patio' },
    { id: 6, name: 'T6', seats: 2, type: 'Rect', zone: 'Patio' },
    { id: 7, name: 'T7', seats: 6, type: 'Rect', zone: 'Booths' },
    { id: 8, name: 'T8', seats: 6, type: 'Rect', zone: 'Booths' },
];

export default function UserDashboard() {
    const router = useRouter();
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const user = api.getUser();

    const handleTableSelect = (tableNumber: number) => {
        router.push(`/user/order?table=${tableNumber}`);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Group tables by zone
    const zones = ['Main Hall', 'Booths', 'Patio'] as const;

    const renderTable = (table: Table) => {
        const isRound = table.type === 'Round';

        // Colors - Neutral/Available style
        const baseColor = theme.colors.textSecondary; // Neutral border

        // Dynamic Chair layout
        const renderReviewChairs = () => {
            if (isRound) {
                // 4 chairs around
                return (
                    <>
                        <View style={{ position: 'absolute', top: -5, width: 20, height: 4, backgroundColor: theme.colors.border, borderRadius: 2 }} />
                        <View style={{ position: 'absolute', bottom: -5, width: 20, height: 4, backgroundColor: theme.colors.border, borderRadius: 2 }} />
                        <View style={{ position: 'absolute', left: -5, width: 4, height: 20, backgroundColor: theme.colors.border, borderRadius: 2 }} />
                        <View style={{ position: 'absolute', right: -5, width: 4, height: 20, backgroundColor: theme.colors.border, borderRadius: 2 }} />
                    </>
                );
            } else {
                // Rect: 2 chairs (left/right) or more
                return (
                    <>
                        <View style={{ position: 'absolute', left: -6, width: 4, height: '60%', backgroundColor: theme.colors.border, borderRadius: 2 }} />
                        <View style={{ position: 'absolute', right: -6, width: 4, height: '60%', backgroundColor: theme.colors.border, borderRadius: 2 }} />
                    </>
                );
            }
        };

        return (
            <TouchableOpacity
                key={table.id}
                onPress={() => handleTableSelect(table.id)}
                style={{
                    width: isRound ? 92 : 110,
                    height: isRound ? 92 : 70,
                    margin: theme.spacing.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Table Shape */}
                <View style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: isRound ? 50 : 6,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 2,
                    borderColor: theme.colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                }}>
                    {/* Table Number */}
                    <Text medium style={{ fontSize: 18, color: theme.colors.text }}>{table.id}</Text>

                    {/* Visual Chairs */}
                    {renderReviewChairs()}
                </View>

                {/* Capacity Label */}
                <View style={{ position: 'absolute', bottom: -20 }}>
                    <Text size="xs" color={theme.colors.textSecondary}>{table.seats} Seats</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={{
                    paddingHorizontal: theme.spacing.lg,
                    paddingTop: theme.spacing.xl,
                    paddingBottom: theme.spacing.lg,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.colors.background,
                }}>
                    <View>
                        <Text size="sm" color={theme.colors.textSecondary}>Restaurant Floor</Text>
                        <Heading level="h2">Tables</Heading>
                    </View>
                    <Avatar
                        size="md"
                        initials={user ? getInitials(user.name) : 'W'}
                        backgroundColor={theme.colors.primary}
                    />
                </View>

                {/* Zones */}
                {zones.map(zone => (
                    <View key={zone} style={{ marginBottom: theme.spacing.xl }}>
                        <View style={{
                            paddingHorizontal: theme.spacing.lg,
                            marginBottom: theme.spacing.md,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.border,
                            marginHorizontal: theme.spacing.lg,
                            paddingBottom: 4
                        }}>
                            <Text medium color={theme.colors.textSecondary} style={{ letterSpacing: 1, fontSize: 12 }}>
                                {zone.toUpperCase()}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingHorizontal: theme.spacing.md,
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            {TABLES_CONFIG.filter(t => t.zone === zone).map(renderTable)}
                        </View>
                    </View>
                ))}

            </ScrollView>
        </View>
    );
}
