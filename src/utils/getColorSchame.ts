import { useColorScheme } from 'react-native';

export default function isDarkMode() {
    return useColorScheme() === 'dark';
}