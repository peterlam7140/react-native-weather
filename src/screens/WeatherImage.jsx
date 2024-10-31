import React, { useEffect, useState, useRef } from 'react';
import { Text, Easing, View, Image, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import axios from 'axios';
import cheerio from 'react-native-cheerio';
import { useNavigation } from '@react-navigation/native';
import isDarkMode from '../utils/getColorSchame';
import moment from 'moment/min/moment-with-locales'
import WeatherForecastModel from '../model/WeatherForecastModel';

function WeatherImageItem({item}) {
    const navigation = useNavigation();

    const [isOpen, setIsOpen] = useState(false);

    const spinAnim = useRef(new Animated.Value(1)).current

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    })

    useEffect(() => {
        spinAnim.setValue(isOpen?1:0)
    }, [])

    function onPress() {
        const pos = !isOpen
        setIsOpen(pos)
        Animated.timing(spinAnim, {
          toValue: (pos)?1:0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();
    }

    const styles = StyleSheet.create({
        image: {
            aspectRatio: '720/405',
            height: 'auto',
            width: "100%",
        },
        container: {
            borderRadius: 8,
            padding: 8,
            marginVertical: 8,
            borderWidth: 2,
            borderColor: '#13a19a',
            backgroundColor: (isDarkMode())?'#23272f':'#FFF',
    
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        text: {
            fontWeight: 'bold', 
            fontSize: 14, 
            textAlign: 'left',
            paddingRight: 4,
            flex: 1,
            color: (isDarkMode())?'#FFF':'#000'
    
        },
        button: {
            flexDirection: "row",
    
            paddingBottom: 14
        },
        arrow: {
            width: 14, 
            height: 14,
        }
    })

    return (
        // <View style={styles.wrapper}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.text}>{item.name}:</Text>
                    <Animated.View style={[{transform: [{ rotate: spin }], flexDirection: 'column', justifyContent: 'center'}]}>
                        <View style={{verticalAlign: "center"}}>
                            <Image style={[styles.arrow]} source={require('../assets/arrow-down.png')} />
                        </View>
                    </Animated.View>
                </TouchableOpacity>
                {isOpen?
                    <View>
                    <TouchableOpacity onPress={() => { navigation.navigate('ZoomImage', { source: {uri: item.url} }) }}>
                        <Image style={styles.image} source={{ uri: item.url }} />
                    </TouchableOpacity>
                    </View>
                :''}
            </View>
        // </View>
    )
}

export default function WeatherImage() {
    const [weatherData, setWeatherData] = useState([]);
    const [updateTime, setUpdateTime] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    let intervalId = useRef(null).current;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        if(intervalId != null) { clearInterval(intervalId) }
        intervalId = setInterval(fetchData, 1 * 60 * 1000);
    }, []);

    const fetchData = () => {
        const weatherForecastModel = new WeatherForecastModel()
        const promise = weatherForecastModel.getPhotoPage();
        promise.then((data) => {
            const $ = cheerio.load(data);
            const newWeatherData = [];
            const timestamp =  new Date().getTime();
    
            $('img').each((index, element) => {
                const imgName = $(element).attr('alt');
                let imgUrl = $(element).attr('src');
                imgUrl = imgUrl.replace("../../../", 'https://www.hko.gov.hk/');
                imgUrl += "?b=" + timestamp;
                imgUrl = imgUrl.replace("_thumb", '');
    
                newWeatherData.push({ key: index, name: imgName, url: imgUrl })

            });
            setWeatherData(newWeatherData);
            setUpdateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
            setRefreshing(false);
        });

    };

    useEffect(() => {
        fetchData();
        intervalId = setInterval(fetchData, 1 * 60 * 1000);

        return () => {
            if(intervalId != null) {
                clearInterval(intervalId)
            }
        };
    }, []);

    const styles = StyleSheet.create({
        container: {
            // paddingTop: 140,
            backgroundColor: (isDarkMode())?'#CCC':'#CCC',
            flex: 1
        },
        scrollView: {
            paddingTop: 0,
            paddingHorizontal: 14,
            paddingBottom: 49,
        },
        time: {
            fontSize: 12,
            textAlign: 'right',
            paddingVertical: 4,
            paddingHorizontal: 14,
            color: (isDarkMode())?'#000':'#000'
        }
    })

    if (weatherData.length === 0) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                <Text style={styles.time}>Reflash Time : {updateTime}</Text>
                <View style={styles.scrollView}>
                    {weatherData.map((data, index) => {
                        if (!data.name) {
                            return null; 
                        }
                        
                        return (
                            <WeatherImageItem key={index} item={data} />
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

