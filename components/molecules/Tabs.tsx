import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface TabItem {
    key: string;
    label: string;
    icon?: any; // Optional icon
}

export interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (key: string) => void;
    style?: ViewStyle;
    scrollable?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    style,
    scrollable = false,
}) => {
    const { theme } = useTheme();

    const TabContent = (
        <View style={[styles.container, scrollable ? null : styles.fullWidth, style]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onTabChange(tab.key)}
                        style={[
                            styles.tab,
                            {
                                borderBottomColor: isActive ? theme.colors.primary : 'transparent',
                                paddingHorizontal: theme.spacing.md,
                                paddingVertical: theme.spacing.sm,
                            },
                            scrollable ? { marginRight: theme.spacing.md } : { flex: 1 },
                        ]}
                    >
                        <Text
                            style={{
                                color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                                textAlign: 'center',
                                fontWeight: isActive ? '600' : '400',
                            }}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    if (scrollable) {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
                style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.divider }}
            >
                {TabContent}
            </ScrollView>
        );
    }

    return (
        <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.divider }}>
            {TabContent}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fullWidth: {
        width: '100%',
        justifyContent: 'space-between',
    },
    tab: {
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
});
