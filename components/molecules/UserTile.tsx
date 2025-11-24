import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';

export interface UserTileProps {
    name: string;
    email?: string;
    avatarSource?: any;
    initials?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export const UserTile: React.FC<UserTileProps> = ({
    name,
    email,
    avatarSource,
    initials,
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
                },
                style,
            ]}
            activeOpacity={0.7}
        >
            <Avatar size="md" source={avatarSource} initials={initials} />
            <View style={[styles.content, { marginLeft: theme.spacing.md }]}>
                <Text size="md" semibold numberOfLines={1}>
                    {name}
                </Text>
                {email && (
                    <Text
                        size="sm"
                        color={theme.colors.textSecondary}
                        numberOfLines={1}
                        style={{ marginTop: 2 }}
                    >
                        {email}
                    </Text>
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
    content: {
        flex: 1,
    },
});
