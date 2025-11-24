import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface AreaChartData {
    label: string;
    value: number;
}

export interface AreaChartProps {
    data: AreaChartData[];
    height?: number;
    fillColor?: string;
    lineColor?: string;
    showDots?: boolean;
    style?: ViewStyle;
}

export const AreaChart: React.FC<AreaChartProps> = ({
    data,
    height = 200,
    fillColor,
    lineColor,
    showDots = true,
    style,
}) => {
    const { theme } = useTheme();
    const [width, setWidth] = React.useState(0);
    const line = lineColor || theme.colors.primary;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const chartHeight = height - 60;
    const padding = 20;

    // Create smooth curve path using cubic bezier curves
    const createSmoothPath = (points: { x: number; y: number }[], isFill: boolean) => {
        if (points.length === 0) return '';

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            const controlX1 = current.x + (next.x - current.x) / 3;
            const controlY1 = current.y;
            const controlX2 = current.x + 2 * (next.x - current.x) / 3;
            const controlY2 = next.y;

            path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
        }

        if (isFill) {
            path += ` L ${points[points.length - 1].x} ${chartHeight + padding}`;
            path += ` L ${points[0].x} ${chartHeight + padding}`;
            path += ' Z';
        }

        return path;
    };

    const points = width > 0 ? data.map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = padding + ((maxValue - point.value) / range) * chartHeight;
        return { x, y, value: point.value };
    }) : [];

    const linePath = createSmoothPath(points, false);
    const areaPath = createSmoothPath(points, true);

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

                {/* Chart area with SVG */}
                <View
                    style={styles.chartArea}
                    onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
                >
                    {width > 0 && (
                        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                            <Defs>
                                <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor={line} stopOpacity="0.4" />
                                    <Stop offset="100%" stopColor={line} stopOpacity="0.0" />
                                </LinearGradient>
                            </Defs>

                            {/* Grid Lines */}
                            <Path
                                d={`M 0 ${padding} L ${width} ${padding}`}
                                stroke={theme.colors.divider}
                                strokeDasharray="4, 4"
                                strokeWidth="1"
                            />
                            <Path
                                d={`M 0 ${padding + chartHeight / 2} L ${width} ${padding + chartHeight / 2}`}
                                stroke={theme.colors.divider}
                                strokeDasharray="4, 4"
                                strokeWidth="1"
                            />
                            <Path
                                d={`M 0 ${padding + chartHeight} L ${width} ${padding + chartHeight}`}
                                stroke={theme.colors.divider}
                                strokeDasharray="4, 4"
                                strokeWidth="1"
                            />

                            {/* Area fill */}
                            <Path d={areaPath} fill="url(#areaGradient)" />

                            {/* Line */}
                            <Path d={linePath} stroke={line} strokeWidth="3" fill="none" />

                            {/* Data points */}
                            {showDots && points.map((point, index) => (
                                <Circle
                                    key={index}
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill={theme.colors.card}
                                    stroke={line}
                                    strokeWidth="2"
                                />
                            ))}
                        </Svg>
                    )}
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
        paddingRight: 12,
        paddingVertical: 20,
    },
    chartArea: {
        flex: 1,
        overflow: 'hidden',
    },
    xAxis: {
        flexDirection: 'row',
        marginTop: 4,
        paddingLeft: 40,
    },
});
