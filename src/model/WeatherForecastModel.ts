// https://www.hko.gov.hk/tc/abouthko/opendata_intro.htm

import axios, {isCancel, AxiosError} from 'axios';

export default class WeatherForecastModel {
    getFlw(lang = "tc"): any {
        return new Promise((resolve, reject) => {
            axios.get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php', {
                params: {
                dataType: "flw",
                lang: lang
                }
            })
            .then(function (response) {
                // console.log(response["data"]);
                resolve(response["data"])
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            })
            .finally(function () {
            // always executed
            });
        })
    }

    getFnd(lang = "tc"): any {
        return new Promise((resolve, reject) => {
            axios.get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php', {
                params: {
                dataType: "fnd",
                lang: lang
                }
            })
            .then(function (response) {
                // console.log(response["data"]);
                resolve(response["data"])
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            })
            .finally(function () {
            // always executed
            });
        })
    }

    getDistrict(latitude: any, longitude: any): any {
        return new Promise((resolve, reject) => {
            const api_key = 'AIzaSyBxfjFAgtngaVV22GM33zZK7omHw31hw3Q';
            axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${api_key}`
                // `https://maps.googleapis.com/maps/api/geocode/json?latlng=22.325892349291355,114.16192142787912&key=${api_key}`
            )
            .then(function (response) {
                // console.log(response["data"]);
                resolve(response["data"])
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            })
            .finally(function () {
            // always executed
            });
        })
    }

    getPhotoPage(): any {
        return new Promise((resolve, reject) => {
            axios.get(
                'https://www.hko.gov.hk/en/wxinfo/ts/index_webcam.htm'
            )
            .then(function (response) {
                // console.log(response["data"]);
                resolve(response["data"])
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            })
            .finally(function () {
            // always executed
            });
        })
    }
}