import React, { useEffect, useRef} from 'react';
import { useRouter } from 'expo-router';
import { Animated, ImageBackground, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { playMainBackgroundMusic, stopMainBackgroundMusic,playSoundEffect } from './BackgroundMusic'; // BackgroundMusic 모듈 가져오기
import { styles } from "./style"



const mainMenu = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current; // 페이드 애니메이션을 위한 Animated.Value

  const scaleAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0)).current;

  

  useEffect(() => {
    playMainBackgroundMusic();
    Animated.sequence([
      Animated.timing(scaleAnim1, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim2, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim3, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const moveSelectStage = () => {
    playSoundEffect();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start(() => {
      router.replace('/selectStage');
    });
  };

  // scale 값에 따라 버튼의 크기를 조정하는 스타일
  const scaleStyle1 = {
    transform: [{ scale: scaleAnim1 }]
  };
  const scaleStyle2 = {
    transform: [{ scale: scaleAnim2 }]
  };
  const scaleStyle3 = {
    transform: [{ scale: scaleAnim3 }]
  };

  return (

    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require('../asset/background/BackGround2.png')}
        style={styles.container}
        resizeMode='stretch'
      >
        <View style={styles.mainLogoContainer}>
          <ImageBackground
            source={require('../asset/background/MainLogo.png')}
            style={styles.mainLogoStyle}
            resizeMode='stretch'
          />
        </View>

        <Animated.View style={[styles.button, scaleStyle1]}>
          <TouchableOpacity onPress={moveSelectStage}>
            <Text style={styles.mainbuttonText}>스테이지 선택</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.button, scaleStyle2]}>
          <TouchableOpacity onPress={()=>{playSoundEffect(); router.replace('howToPlay');}}>
            <Text style={styles.mainbuttonText}>게임 방법</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.button, scaleStyle3]}>
          <TouchableOpacity >
            <Text style={styles.mainbuttonText}>게임 종료</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
};



export default mainMenu;
