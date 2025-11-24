import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface PieChartData {
    label: string;
    value: number;
    color?: string;
}

export interface PieChartProps {
    data: PieChartData[];
    size?: number;
    showLegend?: boolean;
    innerRadius?: number; // 0-1, 0 = full pie, 0.5 = donut
    style?: ViewStyle;
}

export const PieChart: React.FC<PieChartProps> = ({
    data,
    size = 200,
    showLegend = true,
    innerRadius = 0.5,
    style,
}) => {
    const { theme } = useTheme();
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const defaultColors = [
        theme.colors.primary,
        theme.colors.success,
        theme.colors.warning,
        theme.colors.error,
        theme.colors.info,
    ];

    const segments = data.map((item, index) => ({
        ...item,
        color: item.color || defaultColors[index % defaultColors.length],
        percentage: (item.value / total) * 100,
    }));

    // Calculate path for each segment
    const radius = size / 2;
    const innerR = radius * innerRadius;
    let currentAngle = -90; // Start from top

    const createArc = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
        const start = polarToCartesian(radius, radius, outerRadius, endAngle);
        const end = polarToCartesian(radius, radius, outerRadius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        if (innerRadius > 0) {
            // Donut chart
            const innerStart = polarToCartesian(radius, radius, innerRadius, endAngle);
            const innerEnd = polarToCartesian(radius, radius, innerRadius, startAngle);

            return [
                `M ${start.x} ${start.y}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
                `L ${innerEnd.x} ${innerEnd.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
                'Z',
            ].join(' ');
        } else {
            // Full pie chart
            return [
                `M ${radius} ${radius}`,
                `L ${start.x} ${start.y}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
                'Z',
            ].join(' ');
        }
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    return (
        <View style={[styles.container, style]}>
            {/* Pie Chart SVG */}
            <View style={styles.pieContainer}>
                <Svg width={size} height={size}>
                    <G>
                        {segments.map((segment, index) => {
                            const angle = (segment.percentage / 100) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;
                            currentAngle = endAngle;

                            const path = createArc(startAngle, endAngle, radius, innerR);

                            return <Path key={index} d={path} fill={segment.color} />;
                        })}
                        {/* Center circle for donut */}
                        {innerRadius > 0 && (
                            <Circle cx={radius} cy={radius} r={innerR} fill={theme.colors.card} />
                        )}
                    </G>
                </Svg>

                {/* Center text for donut */}
                {innerRadius > 0 && (
                    <View style={[styles.centerText, { width: size, height: size }]}>
                        <Text bold size="lg">
                            {total}
                        </Text>
                        <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                            Total
                        </Text>
                    </View>
                )}
            </View>

            {/* Legend */}
            {showLegend && (
                <View style={styles.legend}>
                    {segments.map((segment, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendColor,
                                    {
                                        backgroundColor: segment.color,
                                        borderRadius: theme.radius.xs,
                                    },
                                ]}
                            />
                            <Text size="sm" style={{ flex: 1 }}>
                                {segment.label}
                            </Text>
                            <Text size="sm" bold>
                                {segment.value} ({segment.percentage.toFixed(1)}%)
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    pieContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    centerText: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    legend: {
        width: '100%',
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
    },
});
