import { PermissionsAndroid } from 'react-native';

export default class GenPermission {
    storage(): any {
        return new Promise(async (resolve, reject) => {
            try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  {
                    title: "Storage Permission",
                    message: "This app needs access to your storage to download PDFs.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                  }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  console.log("You can use the storage");
                  resolve(true)
                } else {
                  console.log("Storage permission denied");
                  resolve(false)
                }
              } catch (err) {
                console.warn(err);
                resolve(false)
              }
        })
    }

    location():any {
      return new Promise(async (resolve, reject) => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Weather Information App Location Permission',
            message: 'Weather Information App access to your Location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can get the location');
          resolve(true)
        } else {
          console.log('Location permission denied');
          resolve(false)
        }
      })
    };
}