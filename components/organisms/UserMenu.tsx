import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Divider } from '../atoms/Divider';
import { Switch } from '../atoms/Switch';
import { Text } from '../atoms/Text';
import { BottomSheet } from '../molecules/BottomSheet';
import { ListItem } from '../molecules/ListItem';
import { UserTile } from '../molecules/UserTile';

export interface UserMenuProps {
    userName: string;
    userEmail?: string;
    userAvatar?: any;
    userInitials?: string;
    onProfile?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
    onToggleTheme?: () => void;
    isDarkMode?: boolean;
    customItems?: Array<{
        label: string;
        icon: keyof typeof Ionicons.glyphMap;
        onPress: () => void;
    }>;
    style?: ViewStyle;
}

export const UserMenu: React.FC<UserMenuProps> = ({
    userName,
    userEmail,
    userAvatar,
    userInitials,
    onProfile,
    onSettings,
    onLogout,
    onToggleTheme,
    isDarkMode = false,
    customItems = [],
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const [menuVisible, setMenuVisible] = useState(false);

    const menuItems = [
        ...(onProfile
            ? [
                {
                    label: 'Profile',
                    icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
                    onPress: () => {
                        onProfile();
                        setMenuVisible(false);
                    },
                },
            ]
            : []),
        ...(onSettings
            ? [
                {
                    label: 'Settings',
                    icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
                    onPress: () => {
                        onSettings();
                        setMenuVisible(false);
                    },
                },
            ]
            : []),
        ...customItems.map((item) => ({
            ...item,
            onPress: () => {
                item.onPress();
                setMenuVisible(false);
            },
        })),
    ];

    const MenuContent = (
        <View style={styles.menuContent}>
            <UserTile
                name={userName}
                email={userEmail}
                avatarSource={userAvatar}
                initials={userInitials}
            />

            <Divider spacing={theme.spacing.md} />

            {menuItems.map((item, index) => (
                <ListItem
                    key={index}
                    title={item.label}
                    leftIcon={<Ionicons name={item.icon} size={20} color={theme.colors.text} />}
                    onPress={item.onPress}
                />
            ))}

            {onToggleTheme && (
                <View
                    style={[
                        styles.themeToggle,
                        {
                            paddingHorizontal: theme.spacing.md,
                            paddingVertical: theme.spacing.sm,
                        },
                    ]}
                >
                    <View style={styles.themeToggleLeft}>
                        <Ionicons name="moon-outline" size={20} color={theme.colors.text} />
                        <Text size="md" style={{ marginLeft: theme.spacing.md }}>
                            Dark Mode
                        </Text>
                    </View>
                    <Switch value={isDarkMode} onValueChange={onToggleTheme} />
                </View>
            )}

            {onLogout && (
                <>
                    <Divider spacing={theme.spacing.md} />
                    <ListItem
                        title="Logout"
                        leftIcon={<Ionicons name="log-out-outline" size={20} color={theme.colors.error} />}
                        onPress={() => {
                            onLogout();
                            setMenuVisible(false);
                        }}
                    />
                </>
            )}
        </View>
    );

    if (isMobile) {
        // Full modal on mobile
        return (
            <>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={style}>
                    <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
                </TouchableOpacity>
                <BottomSheet visible={menuVisible} onClose={() => setMenuVisible(false)} height="auto">
                    {MenuContent}
                </BottomSheet>
            </>
        );
    }

    // Dropdown on desktop
    return (
        <View style={style}>
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                <UserTile
                    name={userName}
                    email={userEmail}
                    avatarSource={userAvatar}
                    initials={userInitials}
                />
            </TouchableOpacity>

            {menuVisible && (
                <>
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setMenuVisible(false)}
                        activeOpacity={1}
                    />
                    <View
                        style={[
                            styles.dropdown,
                            {
                                backgroundColor: theme.colors.card,
                                borderRadius: theme.radius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                minWidth: 280,
                            },
                            theme.shadows.lg,
                        ]}
                    >
                        {MenuContent}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    menuContent: {
        width: '100%',
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    themeToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        zIndex: 999,
    },
});
