import React from 'react';
import {
    FlatList,
    ListRenderItem,
    Platform,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Spinner } from '../atoms/Spinner';
import { Text } from '../atoms/Text';

export interface InteractiveListProps<T> {
    data: T[];
    renderItem: ListRenderItem<T>;
    keyExtractor: (item: T, index: number) => string;
    onRefresh?: () => void;
    refreshing?: boolean;
    onLoadMore?: () => void;
    loading?: boolean;
    emptyMessage?: string;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    style?: ViewStyle;
}

export function InteractiveList<T>({
    data,
    renderItem,
    keyExtractor,
    onRefresh,
    refreshing = false,
    onLoadMore,
    loading = false,
    emptyMessage = 'No items found',
    ListHeaderComponent,
    ListFooterComponent,
    style,
}: InteractiveListProps<T>) {
    const { theme } = useTheme();

    const renderEmpty = () => (
        <View style={[styles.emptyContainer, { paddingVertical: theme.spacing.xxl }]}>
            <Text size="md" color={theme.colors.textSecondary} center>
                {emptyMessage}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!loading) return ListFooterComponent || null;
        return (
            <View style={{ paddingVertical: theme.spacing.lg }}>
                <Spinner size="small" />
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter()}
            showsVerticalScrollIndicator={Platform.OS === 'web'}
            contentContainerStyle={[
                styles.contentContainer,
                data.length === 0 && styles.contentContainerEmpty,
            ]}
            style={[{ backgroundColor: theme.colors.background }, style]}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
    },
    contentContainerEmpty: {
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
