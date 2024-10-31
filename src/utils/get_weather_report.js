import axios from 'axios';

class WeatherReport{
    constructor(){
        this.district_map = {
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
        this.temperature = [];
        this.rainfall = null;
        this.report = null;
        this.init();
    }

    async init() {
        const response = await axios.get(
            `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`
          );
        const temperature_data = response.data.temperature.data;
        temperature_data.forEach(element => {
            this.temperature.push({"place":element.place,"value":element.value})
        });
    }

    

    getTemperature() {
        console.log(this.temperature)
    }
}

export default WeatherReport;