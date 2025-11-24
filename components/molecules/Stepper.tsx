import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface Step {
    title: string;
    description?: string;
}

export interface StepperProps {
    steps: Step[];
    currentStep: number;
    style?: ViewStyle;
}

export const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    style,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <View key={index} style={styles.stepContainer}>
                        <View style={styles.stepIndicatorContainer}>
                            <View
                                style={[
                                    styles.stepCircle,
                                    {
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        borderWidth: 2,
                                        borderColor: isCompleted || isActive
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                        backgroundColor: isCompleted
                                            ? theme.colors.primary
                                            : isActive
                                                ? theme.colors.background
                                                : 'transparent',
                                    },
                                ]}
                            >
                                <Text
                                    size="sm"
                                    bold
                                    style={{
                                        color: isCompleted
                                            ? '#ffffff'
                                            : isActive
                                                ? theme.colors.primary
                                                : theme.colors.textSecondary,
                                    }}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </Text>
                            </View>
                            {index < steps.length - 1 && (
                                <View
                                    style={[
                                        styles.stepLine,
                                        {
                                            backgroundColor: isCompleted
                                                ? theme.colors.primary
                                                : theme.colors.border,
                                        },
                                    ]}
                                />
                            )}
                        </View>
                        <View style={[styles.stepContent, { marginTop: theme.spacing.sm }]}>
                            <Text
                                size="md"
                                semibold
                                color={isActive ? theme.colors.primary : theme.colors.text}
                            >
                                {step.title}
                            </Text>
                            {step.description && (
                                <Text
                                    size="sm"
                                    color={theme.colors.textSecondary}
                                    style={{ marginTop: 2 }}
                                >
                                    {step.description}
                                </Text>
                            )}
                        </View>
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
    stepContainer: {
        marginBottom: 24,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepLine: {
        flex: 1,
        height: 2,
        marginLeft: 8,
    },
    stepContent: {
        paddingLeft: 40,
    },
});
