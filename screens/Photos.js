import {
    RouteProp,
    useNavigation,
    useRoute,
    useIsFocused,
} from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AwesomeGallery, {
    GalleryRef,
    RenderItemInfo,
} from 'react-native-awesome-gallery';
import * as React from 'react';
import { SharedElement } from 'react-navigation-shared-element';
import FastImage from 'react-native-fast-image';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeOutDown,
    FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, EvilIcons, FontAwesome, Feather, Entypo } from '@expo/vector-icons';
import ImagePicker from 'react-native-image-crop-picker';



export const Photos = () => {
    const { top, bottom } = useSafeAreaInsets();
    const { setParams, goBack } = useNavigation();
    const isFocused = useIsFocused();
    const { params } = useRoute();
    const gallery = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [liked, setLiked] = useState(false);
    const [menu, setMenu] = useState(false);
    const [image, setImage] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderItem = ({
        index,
        item,
        setImageDimensions,
    }) => {
        setImage(item.uri)

        return (
            <SharedElement id={`${index}`} style={StyleSheet.absoluteFillObject}>
                <FastImage
                    source={{ uri: item.uri }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode={FastImage.resizeMode.contain}
                    onLoad={(e) => {
                        const { width, height } = e.nativeEvent;
                        setImageDimensions({ width, height });
                    }}
                />
            </SharedElement>
        );
    };

    const [infoVisible, setInfoVisible] = useState(true);

    useEffect(() => {
        StatusBar.setBarStyle(isFocused ? 'light-content' : 'dark-content', true);
        if (!isFocused) {
            StatusBar.setHidden(false, 'fade');
        }
    }, [isFocused]);

    const onIndexChange = useCallback(
        (index) => {
            isFocused && setParams({ index });
        },
        [isFocused, setParams]
    );

    const onTap = () => {
        StatusBar.setHidden(infoVisible, 'slide');
        setInfoVisible(!infoVisible);
    };

    const cropImage = () => {
        ImagePicker.openCropper({
            path: image,
            width: Dimensions.get("screen").width - 30,
            height: Dimensions.get("screen").height / 3.5,
            maxFiles: 1,
            showCropFrame: true,
        }).then(image => {
            console.log(image,"IMG");
        });
    }

    return (
        <View style={styles.container}>
            {infoVisible && (
                <Animated.View
                    entering={mounted ? FadeInUp.duration(250) : undefined}
                    exiting={FadeOutUp.duration(250)}
                    style={[
                        styles.toolbar,
                        {
                            height: top + 60,
                            paddingTop: top,
                        },
                    ]}
                >
                    <View style={styles.textContainer}>
                        <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
                            {params.index + 1} of {params.images.length}
                        </Text>
                    </View>
                </Animated.View>
            )}

            {infoVisible && (
                <Animated.View
                    entering={mounted ? FadeInUp.duration(250) : undefined}
                    exiting={FadeOutUp.duration(250)}
                    style={[
                        styles.iconView,
                        {
                            height: top + 150,
                            paddingTop: top,
                        },
                    ]}
                >
                    <View style={[
                        styles.textContainer,
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        },
                    ]}>
                        <FontAwesome name="comment" size={24} color="white" />
                        <TouchableOpacity onPress={() => setLiked(!liked)}>
                            <AntDesign name="heart" size={24} color={liked ? "red" : "white"} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {infoVisible && (
                <Animated.View
                    entering={mounted ? FadeInUp.duration(250) : undefined}
                    exiting={FadeOutUp.duration(250)}
                    style={[
                        styles.menu,
                        {
                            height: top + 150,
                            paddingTop: top,
                        },
                    ]}
                >
                    <View style={[
                        styles.textContainer,
                        {
                            flexDirection: 'row',
                        },
                    ]}>
                        <TouchableOpacity onPress={() => setMenu(!menu)}>
                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    {
                        menu ?
                            <View style={{
                                position: 'absolute',
                                height: '100%',
                                width: '200%',
                                top: 90,
                                left: 30,
                                backgroundColor: 'white'
                            }}>
                                <TouchableOpacity style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }} onPress={() => cropImage()} >
                                    <Text>Crop</Text>
                                </TouchableOpacity>
                            </View> : null
                    }

                </Animated.View>
            )}

            <AwesomeGallery
                ref={gallery}
                data={params.images.map((uri) => ({ uri }))}
                keyExtractor={(item) => item.uri}
                renderItem={renderItem}
                initialIndex={params.index}
                numToRender={3}
                doubleTapInterval={150}
                onIndexChange={onIndexChange}
                onSwipeToClose={goBack}
                onTap={onTap}
                loop
                onScaleEnd={(scale) => {
                    if (scale < 0.8) {
                        goBack();
                    }
                }}
            />
            {infoVisible && (
                <Animated.View
                    entering={mounted ? FadeInDown.duration(250) : undefined}
                    exiting={FadeOutDown.duration(250)}
                    style={[
                        styles.toolbar,
                        {
                            bottom: 0,
                            height: bottom + 100,
                            paddingBottom: bottom,
                        },
                    ]}
                >
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.textContainer}
                            onPress={() =>
                                gallery.current?.setIndex(
                                    params.index === 0
                                        ? params.images.length - 1
                                        : params.index - 1
                                )
                            }
                        >
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.textContainer}
                            onPress={() =>
                                gallery.current?.setIndex(
                                    params.index === params.images.length - 1
                                        ? 0
                                        : params.index + 1
                                )
                            }
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    toolbar: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    iconView: {
        position: 'absolute',
        width: '20%',
        zIndex: 1,
        alignSelf: 'flex-end'
    },
    menu: {
        position: 'absolute',
        width: '20%',
        zIndex: 1,
        alignSelf: 'flex-start'
    },
});