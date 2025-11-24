import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
    size?: AvatarSize;
    source?: ImageSourcePropType;
    initials?: string;
    backgroundColor?: string;
    color?: string;
    style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
    size = 'md',
    source,
    initials,
    backgroundColor,
    color,
    style,
}) => {
    const { theme } = useTheme();

    const sizeConfig = {
        xs: { dimension: 24, fontSize: theme.fontSize.xs },
        sm: { dimension: 32, fontSize: theme.fontSize.sm },
        md: { dimension: 40, fontSize: theme.fontSize.md },
        lg: { dimension: 56, fontSize: theme.fontSize.lg },
        xl: { dimension: 72, fontSize: theme.fontSize.xl },
    };

    const config = sizeConfig[size];

    return (
        <View
            style={[
                styles.container,
                {
                    width: config.dimension,
                    height: config.dimension,
                    borderRadius: config.dimension / 2,
                    backgroundColor: backgroundColor || theme.colors.primary,
                },
                style,
            ]}
        >
            {source ? (
                <Image
                    source={source}
                    style={[
                        styles.image,
                        {
                            width: config.dimension,
                            height: config.dimension,
                            borderRadius: config.dimension / 2,
                        },
                    ]}
                />
            ) : initials ? (
                <Text
                    size="md"
                    bold
                    style={{
                        fontSize: config.fontSize,
                        color: color || '#ffffff',
                    }}
                >
                    {initials}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        resizeMode: 'cover',
    },
});
