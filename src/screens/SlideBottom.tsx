import React, { useRef, useState, useEffect } from 'react';
import { Easing, Animated, TouchableHighlight, Text, View, Dimensions, StyleSheet, PanResponder } from 'react-native'

import getStatusBarHeight from '../utils/getStatusBarHeight';

import { GestureDetector } from 'react-native-gesture-handler';
import { Gesture } from 'react-native-gesture-handler';

import { useTranslation } from "react-i18next";
import isDarkMode from '../utils/getColorSchame';

export default function SlideBottom (props: any): React.JSX.Element {
  const [isOpenWeatherForecast, setIsOpenWeatherForecast] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current
  const { t, i18n } = useTranslation();

  const state = {
    screenHeight: Dimensions.get("window").height,
    closeTop: Dimensions.get("window").height - getStatusBarHeight() - 39,
    openTop: 0,
    offsetMove: {x:0, y:0}
  }

  const styles = StyleSheet.create({
    weatherForecast: {
      position:'absolute',left:0,right:0,
      height:state.screenHeight,
      top: slideAnim,
      zIndex: 100
    },
    button: {
      alignItems: 'center',
      backgroundColor: ((isDarkMode())?'#16181d':'#a742f5'),
      padding: 10,
    },
    buttonText: {
      color: ((isDarkMode())?'#FFF':'#FFF'),
    },
    buttonRadius: {
      borderTopRightRadius: 10,
      borderTopLeftRadius:10
    }
  });

  useEffect(() => { slideAnim.setValue(isOpenWeatherForecast ? state.openTop : state.closeTop) }, []);

  useEffect(() => {
    // const subscription = Dimensions.addEventListener( 'change', ({window, screen}) => { setStatusBarHeight();},);
    triggerAnimted()
  }, [isOpenWeatherForecast]);

  const updateIsOpenStatus = (val) => {
    setIsOpenWeatherForecast(val)
  }

  const triggerAnimted = () => {
    let pos = isOpenWeatherForecast ? state.openTop : state.closeTop
    Animated.timing(slideAnim, {
      toValue: pos,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }

  const triggerWeatherForecast = () => {
    console.log('triggerWeatherForecast')
    let isOpen = isOpenWeatherForecast ? false : true
    updateIsOpenStatus(isOpen)
  }

  const openWeatherForecast = () => {
    console.log('openWeatherForecast')
    updateIsOpenStatus(true)
  }

  const closeWeatherForecast = () => {
    console.log('closeWeatherForecast')
    updateIsOpenStatus(false)
  }

  const onTapStart = () => {
    triggerWeatherForecast()
  }

  const onPanEnd = () => {
    if(state.offsetMove.y > -3 && state.offsetMove.y < 3 && state.offsetMove.x > -3 && state.offsetMove.x < 3){
      triggerWeatherForecast()
    } else if(isOpenWeatherForecast){
      if(state.offsetMove.y > 100){
        closeWeatherForecast()
      } else {
        triggerAnimted()
      }
    } else {
      if(state.offsetMove.y < -100){
        openWeatherForecast()
      } else {
        triggerAnimted()
      }
    }
  }

  const onPanMove = (e) => {
    if(isOpenWeatherForecast){
      if(e.translationY < 0){
        e.translationY = 0
      }
      slideAnim.setValue(state.openTop + e.translationY)
    } else {
      if(e.translationY > 0){
        e.translationY = 0
      }
      slideAnim.setValue(state.closeTop + e.translationY)
    }
    state.offsetMove = {x: e.translationX, y: e.translationY}
  }

    const panGesture = Gesture.Pan().onBegin(() => {
        state.offsetMove = {x: 0, y: 0}
      }).onUpdate((e) => {
        onPanMove(e)
      }).onEnd(() => {
        onPanEnd()
      }).onFinalize(() => { });
  
    const tapGesture = Gesture.Tap().onStart(() => {
      onTapStart()
    });;

    const composedGesture = Gesture.Race(panGesture, tapGesture);

  // onPress={triggerWeatherForecast}
  return (
    <Animated.View
      style={[styles.weatherForecast]}
    >
      <View>
        <TouchableHighlight style={[styles.buttonRadius]}>
          <GestureDetector gesture={composedGesture}>
            <View style={[styles.button, styles.buttonRadius]}>
              <Text style={[styles.buttonText]}>{t("Weather Forecast")}</Text>
            </View>
          </GestureDetector>
        </TouchableHighlight>
      </View>
      {props.children}
    </Animated.View>
  );
}