import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Image, Text, Dimensions, ImageBackground, Animated, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { stopMainBackgroundMusic,playSoundEffect,playGameplayBackgroundMusic,playGameplaySEF } from './BackgroundMusic'; // BackgroundMusic 모듈 가져오기



const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);



const stages = [
    { id: '1', image: require('../asset/background/1stageImage.png'), description: '주차장에서 놀고 있던 한 소년은 멀리서 낯선 남자의 목소리를 듣게 된다.\n낯선 남자는 소년에게 "도망가!"라고 외쳤다.\n잠시 후, 소년과 낯선 남자는 그 자리에서 사망하게 되었다.\n주차장에서는 무슨 일이 일어났던 것일까?' },
    { id: '2', image: require('../asset/background/unlockStageImage.png'), description: '잠겨있음' },
    { id: '3', image: require('../asset/background/unlockStageImage.png'), description: '잠겨있음' },
];

const selectStage = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current; // 페이드 애니메이션을 위한 Animated.Value
    const router = useRouter();
    


    const moveGameStart = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start(() => {
            router.replace('/test');
        });

    };

    const moveGamePlay = () => {
        playSoundEffect();
        
        const stage = stages[currentStage];
        if (stage.id !== '1') {
            Alert.alert("잠겨있습니다!");
            return;
        }
        stopMainBackgroundMusic();
        playGameplayBackgroundMusic();
        playGameplaySEF();
        moveGameStart();
    };

    const renderItem = ({ item, index }) => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.1, 1, 0.1], // 변경된 scale 값
        });

        return (
            <View style={{ width, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <TouchableOpacity onPress={moveGamePlay}>
                        <Image source={item.image} style={{ width: width * 0.8, height: width * 0.8 }} resizeMode="contain" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    const handleMomentumScrollEnd = (e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentStage(newIndex);
    };

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../asset/background/BackGround2.png')}>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
                    <AnimatedFlatList
                        data={stages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="normal"
                        snapToAlignment="center"
                        snapToInterval={width}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
                        onMomentumScrollEnd={handleMomentumScrollEnd}
                        scrollEventThrottle={16}
                    />
                    <View style={{ width: width * 0.8, alignItems: 'center', marginBottom: 100 }}>
                        <ImageBackground source={require('../asset/background/dialouge1.png')} style={styles.dialogueBackgroundStyle}>
                            <Text style={styles.stageDescriptionStyle}>{stages[currentStage]?.description}</Text>
                        </ImageBackground>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        left: 20,
                        top: 40,
                        backgroundColor: 'black',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 20,
                    }}
                    onPress={() => {
                        playSoundEffect();
                        stopMainBackgroundMusic();
                        router.replace('mainMenu');
                    }}
                >
                    <Text style={{ color: 'white' }}>Back</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Animated.View>
    );
};

const styles = StyleSheet.create({

    dialogueBackgroundStyle: {
        width: width * 0.8, // 스테이지 사진 가로 사이즈에 맞춥니다
        height: 200, // 설명 배경의 높이를 지정하세요
        justifyContent: 'flex-start',
        alignItems: 'center',
        resizeMode: 'stretch', // 또는 'cover'를 사용하세요
    },
    stageDescriptionStyle: {
        // 스테이지 설명 스타일을 지정
        textAlign: 'center',
        color: 'white', // 설명 텍스트 색상
        marginTop: 10

    },
});

export default selectStage; 
