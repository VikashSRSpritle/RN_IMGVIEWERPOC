import * as React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import FastImage from 'react-native-fast-image';
import { imageApiData } from '../data/imageApi';
import { SectionGrid } from 'react-native-super-grid';

const { height } = Dimensions.get('window');
let selected;

const getRandomSize = function () {
  const min = 1000;
  const max = 2000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// const images = new Array(20)
//   .fill(0)
//   .map(() => `https://picsum.photos/${getRandomSize()}/${getRandomSize()}`);

export const Home = () => {
  const { navigate } = useNavigation();
  const [imageData, setImageData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [longPress, setLongPress] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const deSelectItems = () => setSelectedItems([]);

  React.useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setImageData(imageApiData)
    }, 3000);
  }, [])

  const handleLongPress = (item) => {
    setLongPress(!longPress)
    selectItems(item);
    selected = getSelected(item)
  }

  const getSelected = img => selectedItems.includes(img.id);

  const selectItems = item => {
    if (selectedItems.includes(item.id)) {
      const newListItems = selectedItems.filter(
        listItem => listItem !== item.id,
      );
      return setSelectedItems([...newListItems]);
    }
    setSelectedItems([...selectedItems, item.id]);
  };

  const handleImgPress = item => {
    if (selectedItems.length) {
      return selectItems(item);
    }
    if (selectedItems.includes(item.id)) {
      const newListItems = selectedItems.filter(
        listItem => listItem !== item.id,
      );
      return setSelectedItems([...newListItems]);
    }
    setSelectedItems([...selectedItems, item.id]);
  };

  return (

    <SafeAreaView style={styles.container}>
      {
        loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={100} color="red" />
          </View>
          :
          <FlatList
            data={imageData}
            renderItem={({ item, index }) => {
              selected = getSelected(item)
              return (
                <View style={{ flex: 1, flexDirection: 'column', margin: 2 }}>

                  <TouchableWithoutFeedback
                    key={item.uri}
                    onLongPress={() => handleLongPress(item)}
                    onPress={() => longPress ? handleImgPress(item) : navigate('Photos', {
                      index, images: imageApiData.map((item) => {
                        return item.uri
                      })
                    })}
                  >
                    {/* <Image style={styles.imageThumbnail} source={{ uri: item.uri }} /> */}
                    
                    <FastImage source={{ uri: item.uri }} style={styles.imageThumbnail} />
                  </TouchableWithoutFeedback>
                  {
                    longPress ?
                      <View style={{
                        height: 15,
                        width: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        backgroundColor: 'white',
                        left: 100,
                        top: 80,
                        borderRadius: 50
                      }}>
                        {selected && <View style={{
                          height: 10,
                          width: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'black',
                          borderRadius: 50
                        }}>
                        </View>}
                      </View>
                      : null
                  }
                </View>
              )
            }
            }
            //Setting the number of column
            numColumns={4}
            keyExtractor={(item, index) => index}
          />
      }
    </SafeAreaView >

    // <View style={styles.container}>
    //   {
    //     loading ?
    //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         <ActivityIndicator size={100} color="red" />
    //       </View>
    //       :
    //       <>
    //         {/* {
    //           images.map((uri, index) => (
    //             <TouchableWithoutFeedback
    //               key={uri}
    //               onPress={() => navigate('Photos', { index, images })}
    //             >
    //               <SharedElement id={`${index}`} style={styles.imageContainer}>
    //                 <FastImage source={{ uri }} style={StyleSheet.absoluteFillObject} />
    //               </SharedElement>
    //             </TouchableWithoutFeedback>
    //           ))
    //         } */}
    //         {/* <FlatList
    //           data={imageApiData}
    //           renderItem={({ item }) => {
    //             return (
    //               <TouchableWithoutFeedback
    //                 key={item.uri}
    //                 onPress={() => navigate('Photos', { index: item.id, images: item.uri })}
    //               >
    //                 <SharedElement id={`${item.id}`} style={styles.imageContainer}>
    //                   <FastImage source={{ uri: item.uri }} style={StyleSheet.absoluteFillObject} />
    //                 </SharedElement>
    //               </TouchableWithoutFeedback>
    //             )
    //           }}
    //           numColumns
    //           keyExtractor={item => item.id}
    //         /> */}
    //         <FlatList
    //           data={imageApiData}
    //           renderItem={({ item }) => (
    //             <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
    //               <Image style={styles.imageThumbnail} source={{ uri: item.uri }} />
    //             </View>
    //           )}
    //           //Setting the number of column
    //           numColumns={3}
    //           keyExtractor={(item, index) => index}
    //         />
    //       </>
    //   }
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});