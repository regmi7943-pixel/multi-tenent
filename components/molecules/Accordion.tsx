import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface AccordionItem {
    title: string;
    content: React.ReactNode;
    icon?: keyof typeof Ionicons.glyphMap;
}

export interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultExpanded?: number[];
    style?: ViewStyle;
}

export const Accordion: React.FC<AccordionProps> = ({
    items,
    allowMultiple = false,
    defaultExpanded = [],
    style,
}) => {
    const { theme } = useTheme();
    const [expandedItems, setExpandedItems] = useState<number[]>(defaultExpanded);

    const toggleItem = (index: number) => {
        if (allowMultiple) {
            setExpandedItems((prev) =>
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            );
        } else {
            setExpandedItems((prev) => (prev.includes(index) ? [] : [index]));
        }
    };

    return (
        <View style={[styles.container, style]}>
            {items.map((item, index) => {
                const isExpanded = expandedItems.includes(index);
                return (
                    <View
                        key={index}
                        style={[
                            styles.item,
                            {
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                borderRadius: theme.radius.md,
                                marginBottom: theme.spacing.sm,
                                backgroundColor: theme.colors.card,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => toggleItem(index)}
                            style={[
                                styles.header,
                                {
                                    padding: theme.spacing.md,
                                },
                            ]}
                        >
                            <View style={styles.headerLeft}>
                                {item.icon && (
                                    <Ionicons
                                        name={item.icon}
                                        size={20}
                                        color={theme.colors.text}
                                        style={{ marginRight: theme.spacing.sm }}
                                    />
                                )}
                                <Text style={{ flex: 1, fontWeight: '500' }}>{item.title}</Text>
                            </View>
                            <Ionicons
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                        {isExpanded && (
                            <View
                                style={[
                                    styles.content,
                                    {
                                        padding: theme.spacing.md,
                                        paddingTop: 0,
                                        borderTopWidth: 1,
                                        borderTopColor: theme.colors.divider,
                                    },
                                ]}
                            >
                                {item.content}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    item: {
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    content: {
        width: '100%',
    },
});
