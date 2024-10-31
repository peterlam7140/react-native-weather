
import React, { useCallback, useState } from "react";
import { Image, Text, View } from "react-native";
import { Button, StyleSheet } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Dimensions, Modal, Alert, Pressable } from 'react-native';

const styles = StyleSheet.create({
  close: {
    position:'absolute',left:0, top: 0,padding: 5,
    zIndex: 100
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#000",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: '100%'
  },
})

export default function ZoomImage({ navigation, route }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const onLayout = useCallback((event) => {
    const containerWidth = event.nativeEvent.layout.width;

      Image.getSize(route.params.source.uri, (w, h) => {
        if(w > containerWidth) {
          setWidth(containerWidth);
          setHeight(containerWidth * h / w);
        } else {
          setWidth(w);
          setHeight(h);
        }
      });

  }, [route.params.ratio, route.params.source]);

  return (
        <View onLayout={onLayout} style={styles.centeredView}>
          <View style={styles.modalView}>
            <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height}
                        imageWidth={width}
                        imageHeight={height}>
                <Image style={{width:width, height:height}}
                        source={{uri:route.params.source.uri}}/>
            </ImageZoom>
            <Pressable style={styles.close} onPress={() => navigation.goBack()}>
              <Image source={require('../assets/cross.png')} style={{ width: 30, height: 30 }} />
            </Pressable>
          </View>
        </View>
  );
}