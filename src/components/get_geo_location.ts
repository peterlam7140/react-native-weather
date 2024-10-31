import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid } from 'react-native';
import GenPermission from '../model/GenPermission';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import WeatherForecastModel from '../model/WeatherForecastModel';

function requestLocationPermission() {
  const a = new GenPermission();
  return a.location();
  // return new Promise(async (resolve, reject) => {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     {
  //       title: 'Weather Information App Location Permission',
  //       message: 'Weather Information App access to your Location',
  //       buttonNeutral: 'Ask Me Later',
  //       buttonNegative: 'Cancel',
  //       buttonPositive: 'OK',
  //     },
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     console.log('You can get the location');
  //     resolve(true)
  //   } else {
  //     console.log('Location permission denied');
  //     resolve(false)
  //   }
  // })
};

const getCurrentLocation = () => {
  return new Promise(async (resolve, reject) => {
    console.log('Getting current location...');
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        resolve([latitude, longitude])
      },
      error => {console.error('Error:', error.message); resolve([0, 0])},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  })
};

const getDistrict = async (latitude, longitude) => {
  return new Promise((resolve, reject) => {
      try {
        const weatherForecastModel = new WeatherForecastModel()
        let promise = weatherForecastModel.getDistrict(latitude, longitude)
        promise.then((data) => {
          if (data.results.length > 0) {
            data.results.forEach(element => {
              let formattedAddress = element.formatted_address;
              if (formattedAddress.includes("District")) {
                let subStringIndex = formattedAddress.indexOf("District") + "District".length;
                let district = formattedAddress.substring(0, subStringIndex);
                console.log('district:', district);
                resolve(district);
              }
            });
            // console.log(data.results[0])
            resolve(data.results[0]['address_components'][1]["short_name"])
          } else {
            resolve(null)
          }
        })

      } catch (error) {
        console.error('Error:', error);
        resolve(null)
      }
  })
  
};

export default GetUserCoords = () => {

  return new Promise((resolve, reject) => {
    let promise = requestLocationPermission()
    promise.then((location_permission) => {
        console.log('location_permission', location_permission)
        if (location_permission) {
          const promiseLocation = getCurrentLocation()
          promiseLocation.then(([latitude, longitude]) => {
            console.log('getCurrentLocation', latitude, longitude)
            let promiseDistrict = getDistrict(latitude, longitude)
            promiseDistrict.then((results) => {
              console.log('getDistrict', results)
              resolve(results)
            })
          })

        } else {
          resolve(null)
        }
    })
  })

};

