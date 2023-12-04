import React, { useRef, useState } from 'react';
import { View, Image, Button, Dimensions, Animated, StyleSheet, ImageBackground, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from 'expo-router';
import { stopMainBackgroundMusic, playSoundEffect, playGameplayBackgroundMusic, playGameplaySEF } from './BackgroundMusic';

const { width, height } = Dimensions.get('window');

const howToPlay = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const router = useRouter();
  const images = [
    require('../asset/howToPlayPng/howtoplay1.jpg'),
    require('../asset/howToPlayPng/howtoplay2.jpg'),
    require('../asset/howToPlayPng/QuestionPng1.jpg'),
    require('../asset/howToPlayPng/QuestionPng2.jpg'),
    require('../asset/howToPlayPng/howroplay3.jpg'),
    require('../asset/howToPlayPng/ClueHelp1.jpg')
    // ... 나머지 이미지들
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageDescriptions = ['1) 버튼을 누르면 메인메뉴로 이동할 수 있습니다.\n2) 수수께끼 게임 챗봇과 대화한 내역이 표시 됩니다.\n3) 추리시작을 누르면 게임 진행을 위한 메뉴 버튼 4개를 표시할 수 있습니다.',
    '1) 문제 해결 버튼을 통해 게임을 마무리할 수 있습니다. 하지만 단서 4개가 모두 모여야 가능합니다.\n2) 질문? 버튼을 통해 원하는 질문을 챗봇에게 보낼수 있는 질문 입력창을 표시합니다.\n3) 문제 설명 버튼을 통해 문제를 다시 한번 확인할 수 있습니다.\n4) 단서확인 버튼을 통해 문제 해결을 위한 단서와 힌트를 확인할 수 있습니다.',
    '질문? 버튼을 누르면 표시 되는 화면\n\n1) 입력창을 누르면 키패드가 열리면서 원하는 질문을 입력할 수 있습니다.\n2) 원하는 질문을 입력했다면 질문하기 버튼을 통해 질문을 챗봇에게 보냅니다',
    '1) 플레이어가 한 질문은 빨색으로 표시됩니다.\n2) 챗봇의 답장은 하얀색으로 표시됩니다.',
    '문제 설명 버튼을 누르면 표시 되는 화면\n1) 수수께끼 문제가 무엇이였는지 확인할 수 있습니다.\n2) 수수께끼에서 등장하는 인물들 입니다. 반드시 질문을 할때는 관련인물들의 이름을 바꿔 질문하지 마세요. 챗봇이 질문 이해를 못할수 있습니다. ex: 남자-> 남성X, 소년-> 꼬마X\n3) 확인 버튼을 통해 게임 화면으로 돌아갑니다.',
    '단서 확인 버튼을 누르면 표시 되는 화면\n4개의 단서가 모두 모이면 문제 해결 버튼을 통해 게임을 클리어할 수 있습니다.\n1) 2)의 단서 버튼을 누르면 단서의 힌트와 해결 여부를 알수 있습니다.\n2) 버튼을 누르면 1)에 단서에대한 힌트와 해결 여부를 확인 할수 있습니다.']; // 이미지 설명 배열



  const moveSelectStage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start(() => {
      stopMainBackgroundMusic();
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
              style={{ width, height,flex:1 }}
              resizeMode="contain"
            />
            {index === images.length - 1 && (
              <View style={{ position: 'absolute', left:20,top:10 ,alignSelf: 'center' }}>
                <Button color='red' title="게임 메뉴 이동" onPress={moveSelectStage} />
              </View>
            )}
            
          </View>
        ))}
      </Swiper>
      <ImageBackground
        style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }} // 레이아웃 조정
        source={require('../asset/background/dialouge1.png')}
      >
        <Text style={{ color: 'white', fontSize: 15 }}>
          {imageDescriptions[currentIndex]}
        </Text>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: 'black', // 배경색을 검은색으로 설정
    paddingHorizontal: 20, // 가로 길이를 늘림
    paddingVertical: 10, // 세로 길이 설정
    borderRadius: 20, // 타원형 모양을 만들기 위한 둥근 테두리
    borderColor: 'white', // 테두리 색상을 하얀색으로 설정
    borderWidth: 1, // 테두리 두께
    justifyContent: 'center', // 내부 텍스트 중앙 정렬
    alignItems: 'center',
    marginHorizontal: 20,
  },

});

export default howToPlay;