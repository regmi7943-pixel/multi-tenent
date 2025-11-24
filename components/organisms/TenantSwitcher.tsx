import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { TenantConfig, useTheme } from '../../hooks/useTheme';
import { Heading } from '../atoms/Heading';
import { BottomSheet } from '../molecules/BottomSheet';
import { SearchBar } from '../molecules/SearchBar';
import { TenantTile } from '../molecules/TenantTile';

export interface TenantSwitcherProps {
    tenants: TenantConfig[];
    currentTenantId?: string;
    onSelectTenant: (tenant: TenantConfig) => void;
    visible: boolean;
    onClose: () => void;
    style?: ViewStyle;
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
    tenants,
    currentTenantId,
    onSelectTenant,
    visible,
    onClose,
    style,
}) => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTenants = tenants.filter((tenant) =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <BottomSheet visible={visible} onClose={onClose} height="70%" style={style}>
            <View style={styles.container}>
                <Heading level="h4" style={{ marginBottom: theme.spacing.md }}>
                    Switch Tenant
                </Heading>

                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search tenants..."
                    containerStyle={{ marginBottom: theme.spacing.md }}
                />

                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {filteredTenants.map((tenant) => (
                        <TenantTile
                            key={tenant.id}
                            name={tenant.name}
                            logo={tenant.logo}
                            isActive={tenant.id === currentTenantId}
                            onPress={() => {
                                onSelectTenant(tenant);
                                onClose();
                            }}
                            style={{ marginBottom: theme.spacing.sm }}
                        />
                    ))}
                    {filteredTenants.length === 0 && (
                        <View style={[styles.emptyState, { paddingVertical: theme.spacing.xxl }]}>
                            <Heading level="h6" color={theme.colors.textSecondary} center>
                                No tenants found
                            </Heading>
                        </View>
                    )}
                </ScrollView>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
