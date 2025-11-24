import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../atoms/Badge';
import { Text } from '../atoms/Text';

export interface TenantTileProps {
    name: string;
    logo?: any;
    isActive?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

export const TenantTile: React.FC<TenantTileProps> = ({
    name,
    logo,
    isActive = false,
    onPress,
    style,
}) => {
    const { theme } = useTheme();

    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            onPress={onPress}
            style={[
                styles.container,
                {
                    padding: theme.spacing.md,
                    borderRadius: theme.radius.md,
                    borderWidth: 2,
                    borderColor: isActive ? theme.colors.primary : 'transparent',
                    backgroundColor: theme.colors.surface,
                },
                style,
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.logoContainer}>
                {logo ? (
                    <Image
                        source={logo}
                        style={[
                            styles.logo,
                            {
                                width: 40,
                                height: 40,
                                borderRadius: theme.radius.sm,
                            },
                        ]}
                    />
                ) : (
                    <View
                        style={[
                            styles.placeholderLogo,
                            {
                                width: 40,
                                height: 40,
                                borderRadius: theme.radius.sm,
                                backgroundColor: theme.colors.primary,
                            },
                        ]}
                    >
                        <Text size="lg" bold style={{ color: '#ffffff' }}>
                            {name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
            <View style={[styles.content, { marginLeft: theme.spacing.md }]}>
                <Text size="md" semibold numberOfLines={1}>
                    {name}
                </Text>
                {isActive && (
                    <Badge variant="success" value="Active" size="sm" style={{ marginTop: 4 }} />
                )}
            </View>
        </Component>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        resizeMode: 'contain',
    },
    placeholderLogo: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
});
