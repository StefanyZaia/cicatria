import { Platform } from 'react-native';

const tintColorLight = '#0B8C8F';
const tintColorDark = '#E5FAFF';

export const Colors = {
  light: {
    text: '#123D43',
    background: '#DDF7F0',
    tint: tintColorLight,
    icon: '#5D7F82',
    tabIconDefault: '#78A6A7',
    tabIconSelected: tintColorLight,
    card: '#F8FFFC',
    border: '#B7E2DB',
  },
  dark: {
    text: '#EAF8F3',
    background: '#0B2228',
    tint: tintColorDark,
    icon: '#9FC5B7',
    tabIconDefault: '#9FC5B7',
    tabIconSelected: tintColorDark,
    card: '#123D43',
    border: '#27555D',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
