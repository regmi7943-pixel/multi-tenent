import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface BarChartData {
    label: string;
    value: number;
    color?: string;
}

export interface BarChartProps {
    data: BarChartData[];
    maxValue?: number;
    height?: number;
    showValues?: boolean;
    style?: ViewStyle;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    maxValue,
    height = 200,
    showValues = true,
    style,
}) => {
    const { theme } = useTheme();
    const max = maxValue || Math.max(...data.map(d => d.value));

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.chart, { height }]}>
                {data.map((item, index) => {
                    const barHeight = (item.value / max) * (height - 40);
                    const barColor = item.color || theme.colors.primary;

                    return (
                        <View key={index} style={styles.barContainer}>
                            <View style={styles.barWrapper}>
                                {showValues && (
                                    <Text
                                        size="sm"
                                        style={{
                                            marginBottom: 4,
                                            color: theme.colors.text,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.value}
                                    </Text>
                                )}
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: barHeight,
                                            backgroundColor: barColor,
                                            borderRadius: theme.radius.sm,
                                        },
                                    ]}
                                />
                            </View>
                            <Text
                                size="sm"
                                style={{
                                    marginTop: 8,
                                    color: theme.colors.textSecondary,
                                    textAlign: 'center',
                                }}
                            >
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    chart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    barWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        minHeight: 4,
    },
});
