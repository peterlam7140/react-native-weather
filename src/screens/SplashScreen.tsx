import React, { useEffect } from 'react'
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import splashIcon from "../assets/splash_icon.png";
import { useTranslation } from "react-i18next";
import isDarkMode from '../utils/getColorSchame';
import GenPermission from '../model/GenPermission';

export default function SplashScreen (): React.JSX.Element {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const a = new GenPermission();
    a.storage();
    a.location();
    i18n.changeLanguage('en')
    setTimeout(() => {
        navigation.reset({
            index: 0,
            routes: [ { name: 'Start' } ]
          })
    }, 500);
  }, [])

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ((isDarkMode())?'#CCC':'#FFF'),
        alignItems: "center",
        justifyContent: 'center'
    },
    splashIcon: {
        width: "60%",
        height: 'auto',
        aspectRatio: '506/140'
    },
    activityIndicator: {
      marginTop: 30,
    },
    loading: {
      color: ((isDarkMode())?'#1C559C':'#1C559C'),
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10
    },
});

  return (
    <View style={styles.container}>
        <Image style={styles.splashIcon} source={splashIcon} />
        <ActivityIndicator style={styles.activityIndicator} size="large" color={"#1C559C"} />
        <Text style={styles.loading}>Loading...</Text>
    </View>
  )
}