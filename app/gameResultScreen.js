import React, { useRef, useState } from 'react';
import { View, Image, Button, Dimensions, Animated, StyleSheet, ImageBackground, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const gameResultScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // 페이드 애니메이션을 위한 Animated.Value
  const router = useRouter();
  const images = [
    require('../asset/results/reult1.png'), // 오타 수정: 'reult1.png' -> 'result1.png'
    require('../asset/results/result2.png'),
    require('../asset/results/result3.png'),
    require('../asset/results/result4.png')
    // ... 나머지 이미지들
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageDescriptions = ['소년은 자동차 트렁크 짐을 정리하는 부모님을 기다리고 있었습니다.', '부모님은 시간이 늦었으니 소년에게 먼저 집에 들어가라고 말했습니다.', '소년은 홀로 집으로 돌아가던중 하늘에서 한 남성의 목소리를 듣게 되었습니다.', '극심한 우울증으로 주차장 건물 위에서 투신 자살하던 남성은 주차장 아래 소년을 보게되었고 도망치라고 외쳤지만 결국 충돌하여 죄 없는 아이까지 사망하게된 안타까운 사건입니다.']; // 이미지 설명 배열



  const moveSelectStage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start(() => {
      router.replace('/mainMenu');
    });
  };



  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Swiper
        style={{ height, backgroundColor: 'black' }}
        showsButtons={false}
        loop={false}
        showsPagination={true}
        onIndexChanged={(index) => setCurrentIndex(index)}
      >
        {images.map((item, index) => (
          <View key={index} style={{ flex: 1 }}>
            <Image
              source={item}
              style={{ width, height }}
              resizeMode="contain"
            />
            {index === images.length - 1 && (
              <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
                <Button color='black' title="게임 메뉴 이동" onPress={moveSelectStage} />
              </View>
            )}
          </View>
        ))}
      </Swiper>
      <ImageBackground
        style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }} // 레이아웃 조정
        source={require('../asset/background/dialouge1.png')}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>
          {imageDescriptions[currentIndex]}
        </Text>
      </ImageBackground>
    </Animated.View>
  );
};



export default gameResultScreen;