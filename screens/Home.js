import * as React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  SectionList,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { imageApiData } from '../data/imageApi';

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

const data = [
  {
    "title": "Name(s)",
    "type": "Text",
    "data": [{
      id: 1,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2020/04/17/12/28/cloud-5055011_1280.jpg`
    },
    {
      id: 2,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2016/06/20/16/37/rope-1469244_1280.jpg`
    },
    {
      id: 3,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2022/09/11/14/52/bee-7446944_1280.jpg`
    },
    {
      id: 4,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2022/09/28/21/07/woman-7486045_1280.jpg`
    },
    {
      id: 5,
      createdAt: "",
      uri: `https://cdn.pixabay.com/photo/2017/03/23/20/57/girl-2169467_1280.jpg`
    },
    {
      id: 6,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2022/09/07/21/23/ferris-wheel-7439636_1280.jpg`
    },
    {
      id: 7,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2017/07/24/12/43/schrecksee-2534484_1280.jpg`
    },
    {
      id: 8,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2018/08/19/10/16/nature-3616194_1280.jpg`
    },
    {
      id: 9,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2012/03/04/01/01/father-22194_1280.jpg`
    },
    {
      id: 10,
      createdAt: "21 Sep, 2022",
      uri: `https://cdn.pixabay.com/photo/2017/08/16/00/59/panorama-2646143_1280.jpg`
    },]
  },
  // {
  //   "title": "Category(s)",
  //   "type": "Text",
  //   "data": [
  //     {
  //       "name": "Vegetables",
  //       "count": 1942
  //     },
  //     {
  //       "name": "Saloon",
  //       "count": 355
  //     },
  //   ]
  // }
]

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
            numColumns={3}
            keyExtractor={(item, index) => index}
          />
        // <SectionList
        //   contentContainerStyle={{ flexDirection: 'column', }}
        //   renderItem={({ item, index }) => {
        //     selected = getSelected(item)
        //     console.log(item.uri)
        //     return (
        //       <>
        //         <TouchableWithoutFeedback
        //           key={item.uri}
        //           onLongPress={() => handleLongPress(item)}
        //           onPress={() => longPress ? handleImgPress(item) : navigate('Photos', {
        //             index, images: imageApiData.map((item) => {
        //               return item.uri
        //             })
        //           })}
        //         >
        //           {/* <Image style={styles.imageThumbnail} source={{ uri: item.uri }} /> */}

        //           <FastImage source={{ uri: item.uri }} style={styles.imageThumbnail} />
        //         </TouchableWithoutFeedback>
        //         {
        //           longPress ?
        //             <View style={{
        //               height: 15,
        //               width: 15,
        //               justifyContent: 'center',
        //               alignItems: 'center',
        //               position: 'absolute',
        //               backgroundColor: 'white',
        //               left: 100,
        //               top: 80,
        //               borderRadius: 50
        //             }}>
        //               {selected && <View style={{
        //                 height: 10,
        //                 width: 10,
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //                 backgroundColor: 'black',
        //                 borderRadius: 50
        //               }}>
        //               </View>}
        //             </View>
        //             : null
        //         }
        //       </>
        //     )
        //   }
        //   }
        //   renderSectionHeader={({ section: { title } }) => (
        //     <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        //   )}
        //   sections={data}
        //   keyExtractor={(item, index) => item + index}
        // />
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