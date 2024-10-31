import React, { Component, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, ScrollView, TouchableOpacity, Button, Image } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from 'moment/min/moment-with-locales'
import { useNavigation } from '@react-navigation/native';

import WeatherForecastModel from '../model/WeatherForecastModel';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import genPDF from '../utils/genPDF';

import { useTranslation } from "react-i18next";
import isDarkMode from '../utils/getColorSchame';

// import { NineDaysForecast, LocalForecast } from '../model/tempData';

const Tab = createMaterialTopTabNavigator();
let weatherForecastModel = new WeatherForecastModel();

const WeatherItemComponent = (props: any) => {
  const forecastIcon = 'https://www.hko.gov.hk/images/HKOWxIconOutline/pic'+props.items.ForecastIcon+'.png';
  moment.locale('en');
  let formatDate = moment(props.items.forecastDate, "YYYYMMDD").format("Do MMM");
  const styles = StyleSheet.create({
    icon: {
      aspectRatio: '1/1',
      height: 'auto',
      width: "100%",
    },
    defaultText: {
      color: (isDarkMode())?'#FFF':'#000'
    },
    weatherItem: {
      borderRadius: 3,
      margin: 4,
      paddingHorizontal: 8,
      paddingVertical: 8,
      flexDirection: "row",
      backgroundColor: ((isDarkMode())?'#CCC':'#FFF'),
  
  
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    }
  })
  return(
  <View style={ styles.weatherItem }>
    <View style={{flex: 1, paddingRight: 8}}>
      <Text style={[styles.defaultText, {width: "100%", textAlign: "center"}]}>{ formatDate }{"\n"}({ props.items.week })</Text>
      <View style={{backgroundColor: ((isDarkMode())?'#FFF':'#1b5397'), borderRadius: 15, padding: 5, marginTop: 10}}>
        <Image style={styles.icon} source={{ uri: forecastIcon }} />
      </View>
    </View>
    <View style={{flex: 2, borderLeftWidth: 1, paddingLeft: 8}}>
      <View style={{flexDirection: "row", justifyContent: "space-around" }}>
        <Text style={ styles.defaultText }>{props.items.forecastMintemp.value} | {props.items.forecastMaxtemp.value} °{props.items.forecastMaxtemp.unit}</Text>
        <Text style={ styles.defaultText }>{props.items.forecastMinrh.value}-{props.items.forecastMaxrh.value}%</Text>
      </View>
      <Text style={ styles.defaultText }>{ props.items.forecastWind }{"\n"}{"\n"}{ props.items.forecastWeather }</Text>
    </View>
  </View>
)};

const WeatherItemHtml = (items: any) => {
  const forecastIcon = 'https://www.hko.gov.hk/images/HKOWxIconOutline/pic'+items.ForecastIcon+'.png';
  moment.locale('en');
  let formatDate = moment(items.forecastDate, "YYYYMMDD").format("Do MMM");


  let html = ""
  html += `<div style="border: 1px solid #000;"><table>`
    html += `<tr>`
      html += `<td width="100px" style="text-align: center">`
        html += `<div>${ formatDate }<br/></>(${ items.week })</div>`
        html += `<div style="width:80px;background-color: #1b5397;padding: 5px;margin: 5px 0 0 5px;border-radius: 5px;"><image src="${forecastIcon}" width="100%" height="auto" /></div>`
      html += `</td>`
      html += `<td>`
        html += `<div style="display: flex; justify-content: left;">`
          html += `<div style="margin: 0 20px 0 0;">${items.forecastMintemp.value} | ${items.forecastMaxtemp.value} °${items.forecastMaxtemp.unit}</div>`
          html += `<div>${items.forecastMinrh.value}-${items.forecastMaxrh.value}%</div>`
        html += `</div>`
        html += `<p>${ items.forecastWind }<br/><br/>${ items.forecastWeather }</p>`
      html += `</td>`
    html += `</tr>`
  html += `</table></div>`

  // html += "</body></html>"

  return html
};

function LocalScreen() {
  const { t, i18n } = useTranslation();
  const [flwData, setflwData] = useState({});

  useEffect(() => {
    loadData()
    i18n.on('languageChanged', function(lng) {
      loadData()
    })
  }, [])

  const loadData = () => {
    const promise = weatherForecastModel.getFlw(i18n.language);
    promise.then((value:Object) => {
      setflwData(value)
      console.log('LocalScreen - getFlw')
    });
  }

  const generalSituation = (flwData.generalSituation != "") ? flwData.generalSituation + "\n" + "\n" : "";
  const tcInfo = (flwData.tcInfo != "") ? flwData.tcInfo + "\n" + "\n" : "";
  const fireDangerWarning = (flwData.fireDangerWarning != "") ? flwData.fireDangerWarning + "\n" + "\n" : "";
  const forecastPeriod = (flwData.forecastPeriod != "") ? flwData.forecastPeriod + "\n" + "\n" : "";
  const forecastDesc = (flwData.forecastDesc != "") ? flwData.forecastDesc + "\n" + "\n" : "";
  const outlook = (flwData.outlook != "") ? flwData.outlook + "\n" + "\n" : "";

  const html = `<p>${generalSituation}</p><p>${tcInfo}</p><p>${fireDangerWarning}</p><p>${forecastPeriod}</p><p>${forecastDesc}</p><p>${outlook}</p>`

  const styles = StyleSheet.create({
    container: {
      flex: 1, backgroundColor: ((isDarkMode())?'#16181d':'#FFF')
    },
    defaultText: {
      color: (isDarkMode())?'#FFF':'#000'
    }
  })

  if(Object.keys(flwData).length == 0){
    return ( <ActivityIndicator size="large"style={{ flex: 1 }} /> )
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ padding: 14 }}>
            <Button title="PDF" onPress={() => genPDF('localForecast', html) } />
            <Text style={ [styles.defaultText, {marginTop: 14}] }>
              { generalSituation }
              { tcInfo }
              { fireDangerWarning }
              { forecastPeriod }
              { forecastDesc }
              { outlook }
              {/* {"\n"}{"\n"}
              (以上預測有效期至明日(2024年03月19日)23時59分;
              定期更新時間：約每小時45分，16時15分及23時15分) */}
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

function NineDayScreen() {
  const { t, i18n } = useTranslation();
  const [fndData, setFndData] = useState([]);

  useEffect(() => {
    loadData()
    i18n.on('languageChanged', function(lng) {
      loadData()
    })
  }, [])

  const loadData = () => {
    const promise = weatherForecastModel.getFnd(i18n.language);
    promise.then((value:Array<Object>) => {
      setFndData(value)
      console.log('NineDayScreen - getFnd')
    });
  }

  let generalSituation = null
  if(typeof fndData["generalSituation"] != 'undefined'){
    generalSituation = fndData["generalSituation"]
  }

  let compStr = null
  if(typeof fndData["weatherForecast"] != 'undefined' && fndData["weatherForecast"].length > 0){
    compStr = fndData["weatherForecast"].map((item)=> <WeatherItemComponent key={ item.forecastDate } items={ item } /> )
  }

  let html = ""
  html += "<html><head><style>"
  html += "body {font-family: 'Helvetica';font-size: 16px;}"
  html += "table {width: 100%;border-collapse: collapse;}"
  html += "th, td {border: 1px solid #000;padding: 5px;vertical-align: top;}"
  html += "th {background-color: #ccc;}"
  html += "</style></head><body>"

  html += `<p>${generalSituation}</p>`
  if(typeof fndData["weatherForecast"] != 'undefined' && fndData["weatherForecast"].length > 0){
    html += fndData["weatherForecast"].map((item)=> WeatherItemHtml(item) )
  }
  html += '</body></html>'

  const styles = StyleSheet.create({
    container: {
      flex: 1, backgroundColor: ((isDarkMode())?'#16181d':'#FFF')
    },
    defaultText: {
      color: (isDarkMode())?'#FFF':'#000'
    }
  })

  if(Object.keys(fndData).length == 0){
    return ( <ActivityIndicator size="large"style={{ flex: 1 }} /> )
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ padding: 14 }}>
            <Button title="PDF" onPress={() => genPDF('9dayForecast', html) } />
            <Text style={ [styles.defaultText, { marginVertical: 14 }] }>{ generalSituation }</Text>
            { compStr }
          </View>
        </ScrollView>
      </View>
    )
  }
}

function ExtendedScreen(props: any) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const img1 = 'https://www.hko.gov.hk/probfcst/ttmax_HKO_plume.png?time='+props.time
  const img2 = 'https://www.hko.gov.hk/probfcst/ttmin_HKO_plume.png?time='+props.time
  const img3 = 'https://www.hko.gov.hk/probfcst/mslp_HKO_plume.png?time='+props.time

  const html = `<h1>${t("最高溫度概率預報")}</h1><img src="${img1}"><h1>${t("最低溫度概率預報")}</h1><img src="${img2}"><h1>${t("平均海平面氣壓概率預報")}</h1><img src="${img3}">`

  const styles = StyleSheet.create({
    image: {
      aspectRatio: '984/523',
      height: 'auto',
      width: "100%",
    },
    defaultText: {
      color: (isDarkMode())?'#FFF':'#000'
    }
  })

  return (
    <View style={{ flex: 1, backgroundColor:((isDarkMode())?'#16181d':'#FFF') }}>
      <ScrollView>
        <View style={{ padding: 14, paddingBottom: 34 }}>
          <Button title="PDF" onPress={() => genPDF('extendedForecast', html) } />
          <Text style={[styles.defaultText, { width: '100%', marginTop: 20, marginBottom: 10 }]}>{t("最高溫度概率預報")}</Text>
          <TouchableOpacity onPress={() => { navigation.navigate('ZoomImage', { source: {uri: img1} }) }}>
            <Image style={styles.image} source={{ uri: img1 }} />
          </TouchableOpacity>
          <Text style={[styles.defaultText, { width: '100%', marginTop: 20, marginBottom: 10 }]}>{t("最低溫度概率預報")}</Text>
          <TouchableOpacity onPress={() => { navigation.navigate('ZoomImage', { source: {uri: img2} }) }}>
            <Image style={styles.image} source={{ uri: img2 }} />
          </TouchableOpacity>
          <Text style={[styles.defaultText, { width: '100%', marginTop: 20, marginBottom: 10 }]}>{t("平均海平面氣壓概率預報")}</Text>
          <TouchableOpacity onPress={() => { navigation.navigate('ZoomImage', { source: {uri: img3} }) }}>
            <Image style={styles.image} source={{ uri: img3 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default function WeatherForecast() {
  const { t, i18n } = useTranslation();
  let time = new Date().getTime();

  useEffect(() => {

  }, [])

  const styles = StyleSheet.create({
    defaultText: {
      color: (isDarkMode())?'#FFF':'#000'
    },
    navigator: {
      paddingBottom: getStatusBarHeight()
    },
  })

  return (
    <Tab.Navigator
      style={styles.navigator}
      initialRouteName="Local"
      screenOptions={{
        tabBarActiveTintColor: ((isDarkMode())?'#CCC':'#e91e63'),
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: ((isDarkMode())?'#16181d':'powderblue') },
      }}
    >
      <Tab.Screen
        name="Local"
        component={LocalScreen}
        options={{ tabBarLabel: t('本港預報') }}
      />
      <Tab.Screen
        name="NineDay"
        component={NineDayScreen}
        options={{ tabBarLabel: t('九天預報') }}
      />
      <Tab.Screen
        name="Extended"
        options={{ tabBarLabel: t('延伸預報') }}
        children={ () => <ExtendedScreen time={time}/> }
      />
    </Tab.Navigator>
  );
}
