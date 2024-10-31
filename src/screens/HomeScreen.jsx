/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ViewBase, ScrollView, useColorScheme } from 'react-native';
import CurrentTime from '../components/get_current_time';
import UserLocation from '../components/get_geo_location';
import axios from 'axios'
import isDarkMode from '../utils/getColorSchame';
import moment from 'moment/min/moment-with-locales'

const api_key = "AIzaSyD7h9XihSYhJQrEVMGrVwVe7ps0y81nQjk"

const HomeScreen = () => {
  const [rainFall, setRainFall] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [district, setDistrict] = useState(null);
  const [clockDate, setClockDate] = useState(null);
  const [clockTime, setClockTime] = useState(null);

  const district_map_temperature = {
    "Islands District": "Chek Lap Kok",
    "Kwai Tsing District": "Tsing Yi",
    "North District": "Ta Ku Ling",
    "Sai Kung District": "Tseung Kwan O",
    "Sha Tin District": "Sha Tin",
    "Tai Po District": "Tai Po",
    "Tsuen Wan District": "Tsuen Wan Shing Mun Valley",
    "Tuen Mun District": "Tuen Mun",
    "Yuen Long District": "Yuen Long Park",
    "Kowloon City District": "Kowloon City",
    "Kwun Tong District": "Kwun Tong",
    "Sham Shui Po District": "Sham Shui Po",
    "Wong Tai Sin District": "Wong Tai Sin",
    "Yau Tsim Mong District": "King's Park",
    "Central and Western District": "Hong Kong Park",
    "Eastern District": "Shau Kei Wan",
    "Southern District": "Stanley",
    "Wan Chai District": "Happy Valley",
  };

  const get_weather_report =  async () => {
    const response = await axios.get(
      `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`
    );
    const temperature_data = response.data.temperature.data;
    const rainFall_data = response.data.rainfall.data;
    setTemperature(temperature_data);
    setRainFall(rainFall_data);
  } 

  const location_temp = () => {
    if(district != null) {
      if(district in district_map_temperature){
        const location = district_map_temperature[district]
        const temp = temperature.find(item => item.place === location)
        return temp.value + ' \u00B0C'
      }
      return 'N/A'
    } else {
      return null
    }
  }

  const location_temperature = location_temp();

  const getClock = () => {
    setClockDate(moment().format('DD MMMM YYYY (dddd)'))
    setClockTime(moment().format('HH:mm:ss'))
  }

  useEffect(() => {

    let promise = UserLocation()
    promise.then((value) => {
      setDistrict(value)
    })
    get_weather_report();

    getClock();
    const intervalClock = setInterval(getClock, 1 * 1 * 1000);

    return () => {
        clearInterval(intervalClock);
    };
    
  }, [])

  const styles = StyleSheet.create({
    container: {
      zIndex: 10
    },
    defaultColor: {
      color: (isDarkMode())?'#FFF':'#000',
    },
    upperStyle: {
      width: "100%",
      // height: 140,
      alignItems: 'center',
      backgroundColor: (isDarkMode())?'#16181d':'#149eca',
      padding: 8,
      paddingBottom: 14,
      color: (isDarkMode())?'#FFF':'#000',
      // position: "absolute",
      // top: 0,
  
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    temperatureStyle: {
      fontSize: 18,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.upperStyle}>
        <View>
          <Text style={[styles.defaultColor, { fontSize: 18 }]}>{clockDate}</Text>
        </View>
        <View>
          <Text style={[styles.defaultColor, { fontSize: 32 }]}>{clockTime}</Text>
        </View>
        <View>
          <Text style={[styles.defaultColor, {fontSize: 18}]}>{district || "Loading..."}</Text>
          <Text style={[styles.defaultColor, styles.temperatureStyle]}>{location_temperature ? `${location_temperature}` : "Loading..."}</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;