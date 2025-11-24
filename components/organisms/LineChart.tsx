import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface LineChartData {
    label: string;
    value: number;
}

export interface LineChartProps {
    data: LineChartData[];
    height?: number;
    lineColor?: string;
    showDots?: boolean;
    style?: ViewStyle;
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    height = 200,
    lineColor,
    showDots = true,
    style,
}) => {
    const { theme } = useTheme();
    const color = lineColor || theme.colors.primary;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.chart, { height }]}>
                {/* Y-axis labels */}
                <View style={styles.yAxis}>
                    <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                        {maxValue}
                    </Text>
                    <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                        {Math.round((maxValue + minValue) / 2)}
                    </Text>
                    <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                        {minValue}
                    </Text>
                </View>

                {/* Chart area */}
                <View style={styles.chartArea}>
                    {/* Grid lines */}
                    <View style={styles.gridLines}>
                        {[0, 1, 2, 3, 4].map(i => (
                            <View
                                key={i}
                                style={[
                                    styles.gridLine,
                                    { borderColor: theme.colors.divider },
                                ]}
                            />
                        ))}
                    </View>

                    {/* Data points and line simulation */}
                    <View style={styles.dataArea}>
                        {data.map((point, index) => {
                            const yPosition =
                                ((maxValue - point.value) / range) * (height - 60);

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.pointContainer,
                                        { top: yPosition },
                                    ]}
                                >
                                    {showDots && (
                                        <View
                                            style={[
                                                styles.dot,
                                                {
                                                    backgroundColor: color,
                                                    borderColor: theme.colors.card,
                                                },
                                            ]}
                                        />
                                    )}
                                    {index < data.length - 1 && (
                                        <View
                                            style={[
                                                styles.line,
                                                {
                                                    backgroundColor: color,
                                                    width: `${100 / (data.length - 1)}%`,
                                                },
                                            ]}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* X-axis labels */}
            <View style={styles.xAxis}>
                {data.map((point, index) => (
                    <Text
                        key={index}
                        size="sm"
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            color: theme.colors.textSecondary,
                        }}
                    >
                        {point.label}
                    </Text>
                ))}
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
        position: 'relative',
    },
    yAxis: {
        width: 40,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    chartArea: {
        flex: 1,
        position: 'relative',
    },
    gridLines: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
    },
    gridLine: {
        height: 1,
        borderTopWidth: 1,
        borderStyle: 'dashed',
    },
    dataArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    pointContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 2,
    },
    line: {
        height: 2,
        marginLeft: 4,
    },
    xAxis: {
        flexDirection: 'row',
        marginTop: 8,
        paddingLeft: 48,
    },
});
