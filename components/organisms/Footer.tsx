import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Divider } from '../atoms/Divider';
import { Text } from '../atoms/Text';

export interface FooterProps {
    copyright?: string;
    links?: Array<{ label: string; onPress: () => void }>;
    style?: ViewStyle;
}

export const Footer: React.FC<FooterProps> = ({
    copyright = `© ${new Date().getFullYear()} All rights reserved`,
    links = [],
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    return (
        <View
            style={[
                styles.footer,
                {
                    backgroundColor: theme.colors.surface,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.xl,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.divider,
                },
                style,
            ]}
        >
            {links.length > 0 && (
                <>
                    <View
                        style={[
                            styles.linksContainer,
                            isMobile ? styles.linksContainerMobile : styles.linksContainerDesktop,
                            { gap: theme.spacing.md },
                        ]}
                    >
                        {links.map((link, index) => (
                            <TouchableOpacity key={index} onPress={link.onPress}>
                                <Text size="sm" variant="link">
                                    {link.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Divider spacing={theme.spacing.md} />
                </>
            )}
            <Text size="sm" color={theme.colors.textSecondary} center={isMobile}>
                {copyright}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        width: '100%',
    },
    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    linksContainerMobile: {
        justifyContent: 'center',
    },
    linksContainerDesktop: {
        justifyContent: 'flex-start',
    },
});
