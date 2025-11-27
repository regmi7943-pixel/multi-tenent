import { StyleSheet } from 'react-native';

/**
 * Global styles that can be reused across the application
 * Import these in your components: import { globalStyles } from '../styles/globalStyles';
 */
export const globalStyles = StyleSheet.create({
    // Container Styles
    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    contentContainer: {
        width: '100%',
        alignItems: 'stretch' as any,
    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Layout Styles
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    column: {
        flexDirection: 'column',
    },

    // Spacing Styles
    mt8: { marginTop: 8 },
    mt16: { marginTop: 16 },
    mt24: { marginTop: 24 },
    mt32: { marginTop: 32 },

    mb8: { marginBottom: 8 },
    mb16: { marginBottom: 16 },
    mb24: { marginBottom: 24 },
    mb32: { marginBottom: 32 },

    p8: { padding: 8 },
    p16: { padding: 16 },
    p24: { padding: 24 },
    p32: { padding: 32 },

    // Grid/Card Layout
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },

    // Text Alignment
    textCenter: {
        textAlign: 'center',
    },

    textLeft: {
        textAlign: 'left',
    },

    textRight: {
        textAlign: 'right',
    },

    // Common Component Styles
    header: {
        marginBottom: 32,
    },

    formCard: {
        padding: 24,
    },

    inputGroup: {
        marginBottom: 20,
    },

    label: {
        fontWeight: '500' as any,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },

    // Icon Container
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },

    // Shadow Styles
    shadowSm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    shadowMd: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },

    shadowLg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    // Utility Styles
    fullWidth: {
        width: '100%',
    },

    flex1: {
        flex: 1,
    },

    absolute: {
        position: 'absolute',
    },

    relative: {
        position: 'relative',
    },
});

/**
 * Common responsive maxWidth for content
 */
export const CONTENT_MAX_WIDTH = {
    small: 400,
    medium: 800,
    large: 1200,
};
