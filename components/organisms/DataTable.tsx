import React from 'react';
import {
    DimensionValue,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

export interface DataTableColumn<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    width?: DimensionValue;
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    keyExtractor: (item: T, index: number) => string;
    onRowPress?: (item: T) => void;
    style?: ViewStyle;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    keyExtractor,
    onRowPress,
    style,
}: DataTableProps<T>) {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    if (isMobile) {
        // Card layout for mobile
        return (
            <ScrollView style={[styles.mobileContainer, style]} showsVerticalScrollIndicator={false}>
                {data.map((item, index) => (
                    <Card
                        key={keyExtractor(item, index)}
                        style={{ marginBottom: theme.spacing.sm }}
                        padding="md"
                        onPress={() => onRowPress?.(item)}
                    >
                        {columns.map((column) => (
                            <View
                                key={column.key}
                                style={[
                                    styles.mobileRow,
                                    { marginBottom: theme.spacing.sm },
                                ]}
                            >
                                <Text size="sm" semibold color={theme.colors.textSecondary}>
                                    {column.label}
                                </Text>
                                <Text size="md" style={{ marginTop: 2 }}>
                                    {column.render ? column.render(item) : item[column.key]}
                                </Text>
                            </View>
                        ))}
                    </Card>
                ))}
                {data.length === 0 && (
                    <View style={[styles.emptyContainer, { paddingVertical: theme.spacing.xxl }]}>
                        <Text size="md" color={theme.colors.textSecondary} center>
                            No data available
                        </Text>
                    </View>
                )}
            </ScrollView>
        );
    }

    // Table layout for tablet/desktop
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === 'web'}
            style={style}
        >
            <View style={styles.table}>
                {/* Header */}
                <View
                    style={[
                        styles.tableRow,
                        styles.tableHeader,
                        {
                            backgroundColor: theme.colors.surface,
                            borderBottomWidth: 2,
                            borderBottomColor: theme.colors.divider,
                        },
                    ]}
                >
                    {columns.map((column) => (
                        <View
                            key={column.key}
                            style={[
                                styles.tableCell,
                                {
                                    width: column.width || 150,
                                    paddingHorizontal: theme.spacing.md,
                                    paddingVertical: theme.spacing.md,
                                },
                            ]}
                        >
                            <Text size="sm" semibold>
                                {column.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Rows */}
                {data.map((item, index) => {
                    const Component = onRowPress ? Pressable : View;
                    return (
                        <Component
                            key={keyExtractor(item, index)}
                            onPress={() => onRowPress?.(item)}
                            style={[
                                styles.tableRow,
                                {
                                    backgroundColor:
                                        index % 2 === 0 ? theme.colors.background : theme.colors.surface,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.colors.divider,
                                },
                            ]}
                        >
                            {columns.map((column) => (
                                <View
                                    key={column.key}
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: column.width || 150,
                                            paddingHorizontal: theme.spacing.md,
                                            paddingVertical: theme.spacing.md,
                                        },
                                    ]}
                                >
                                    <Text size="md">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </Text>
                                </View>
                            ))}
                        </Component>
                    );
                })}

                {data.length === 0 && (
                    <View style={[styles.emptyContainer, { paddingVertical: theme.spacing.xxl }]}>
                        <Text size="md" color={theme.colors.textSecondary} center>
                            No data available
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mobileContainer: {
        flex: 1,
    },
    mobileRow: {
        width: '100%',
    },
    table: {
        minWidth: '100%',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {},
    tableCell: {
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});
