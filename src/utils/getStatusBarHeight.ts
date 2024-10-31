import { Platform, StatusBar } from 'react-native'

export default function getStatusBarHeight(): number {
  return 0
  const platformOS = Platform.OS;
  return (platformOS === "android" ? StatusBar.currentHeight : 0)
}