import RNFS from "react-native-fs"
import { Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default async function createPDF(prefixName, html) {
    let options = {
      html: html,
      fileName: 'test',
    //   directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);

    let time = new Date().getTime();
    const destinationPath = RNFS.DownloadDirectoryPath;
    const FileName = prefixName+'_'+time+'.pdf';

    const destinationFile = destinationPath + "/" + FileName;
    
    RNFS.copyFile(file.filePath, destinationFile)
        .then(result => {
            Alert.alert('Saved to ', destinationFile)
            RNFS.unlink(file.filePath)
                .then(() => {
                    console.log('FILE DELETED');})
                .catch((err) => {
                        console.log(err.message);});
        })
        .catch(err => {
            Alert.alert('Error', err.message)
            console.log('err', err.message);
        });
}