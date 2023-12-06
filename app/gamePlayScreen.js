import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, Animated,Text, ImageBackground, Image, Dimensions, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { playSoundEffect, stopGameplayBackgroundMusic, stopGameplaySEF } from './BackgroundMusic';
import { sendMessage } from './chatgptSendMassage'; // 임포트 추가
import { styles } from "./style"


const { width, height } = Dimensions.get('window');
const mainButtonSize = 80; // '추리 시작!' 버튼의 크기
const menuRadius = 100; // 메뉴 버튼이 펼쳐질 반경

// 메뉴 버튼에 대한 정보를 담고 있는 배열
const menuButtonInfos = [
    { title: '문제 해결!', color: 'black', id: 1 },
    { title: '질문?', color: 'black', id: 2 },
    { title: '문제 설명', color: 'black', id: 3 },
    { title: '단서 확인', color: 'black', id: 4 },
];

const gamePlayScreen = () => {
    const router = useRouter();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const animations = useRef(menuButtonInfos.map(() => new Animated.Value(0))).current;
    const fadeAnim = useRef(new Animated.Value(1)).current; // 페이드 애니메이션을 위한 Animated.Value

    const [isAlertVisible, setIsAlertVisible] = useState(false); // 질문 모달창 표시
    const [isHelpVisible, setIsHelpVisible] = useState(false); // 문제설명 모달창 표시
    const [isClueVisible, setIsClueVisible] = useState(false); // 단서확인 모달창 표시

    const [isClueExplain, setIsClueExplain] = useState('4개의 단서를 모아 정답을 맞추세요.');

    const [isClue1Open, setIsClue1Open] = useState(false);
    const [isClue2Open, setIsClue2Open] = useState(false);
    const [isClue3Open, setIsClue3Open] = useState(false);
    const [isClue4Open, setIsClue4Open] = useState(false);



    const [messages, setMessages] = useState([]);//chatgpt
    const [inputText, setInputText] = useState('');//chatgpt



    const moveResultScreen = () => {//게임 마무리, 결과창으로 이동
        stopGameplayBackgroundMusic();
        stopGameplaySEF();
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true
        }).start(() => {
            router.replace('/gameResultScreen');
        });
    };


    const handleMenuButtonPress = (id) => {
        playSoundEffect();
        if (id == 1) {
            if (isClue1Open==true&&isClue2Open==true&& isClue3Open==true&& isClue4Open == true) {
                Alert.alert(
                    "축하합니다.",
                    "사건을 해결했습니다.",
                    [

                        {
                            text: "사건이 진실 확인하기.",
                            onPress: () => {
                                stopGameplayBackgroundMusic();
                                stopGameplaySEF();
                                moveResultScreen();

                            }
                        }
                    ],
                    { cancelable: false }
                );

            } else {
                Alert.alert('단서가 부족합니다..');
            }
        }
        else if (id == 2) {
            setIsAlertVisible(true); // 질문 모달창 표시
        } else if (id == 3) {
            //Alert.alert('테스트');
            setIsHelpVisible(true);

        } else {
            setIsClueVisible(true);

        }
        console.log("Button Id:" + id)
        // 필요한 경우 buttonTitle에 따라 추가 로직 구현


    };

    // 질문 모달창 에서 보내기 버튼을 눌렀을때 함수
    const handleConfirmPress = () => {
        sendMessage(inputText, setMessages,{setIsClue1Open,setIsClue2Open,setIsClue3Open,setIsClue4Open});//chatgpt에게 질문 보내기
        setInputText('');
        setIsAlertVisible(false); // 알림창 숨기기
        console.log(inputText); // 입력된 텍스트 전송
    };
    // 문제설명 모달창 에서 보내기 버튼을 눌렀을때 함수
    const closeHelpAlert = () => {

        setIsHelpVisible(false); // 알림창 숨기기
        // 입력된 텍스트 전송
    };
    // 단서확인모달창 에서 보내기 버튼을 눌렀을때 함수
    const closClueAlert = () => {

        setIsClueExplain('4개의 단서를 모아 정답을 맞추세요.');
        setIsClueVisible(false); // 알림창 숨기기
        // 입력된 텍스트 전송
    };


    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
        playSoundEffect();
        animations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: isMenuVisible ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const renderMenuButtons = () => {//추리시작! 버튼 애니메이션 
        const buttonsCount = menuButtonInfos.length;
        return menuButtonInfos.map((button, index) => {
            // 각도를 조정하여 버튼들이 균등하게 분포하도록 합니다.
            const angle = (index - (buttonsCount - 1) / 2) * (Math.PI / (buttonsCount - 1));
            const x = menuRadius * Math.sin(angle);
            const y = -menuRadius * Math.cos(angle) - 20;

            const animatedStyle = {
                transform: [
                    {
                        translateX: animations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, x],
                        }),
                    },
                    {
                        translateY: animations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, y],
                        }),
                    },
                ],
                opacity: animations[index],
            };

            return (
                <Animated.View
                    style={[styles.menuButton, animatedStyle, { backgroundColor: button.color }]} key={button.id}>
                    <TouchableOpacity onPress={() => handleMenuButtonPress(button.id)} >
                        <Text style={styles.buttonText}>{button.title}</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        });
    };

    const handleBackPress = () => {// 메인메뉴로 돌아가기
        playSoundEffect();
        stopGameplayBackgroundMusic();
        stopGameplaySEF();
        router.replace('/mainMenu');
    };

    const handleButtonPress = (buttonid) => {//단서 확인 버튼
        playSoundEffect();
        if (buttonid == 1) {
            if (isClue1Open == false) {
                setIsClueExplain('미해결 단서입니다.\n사건이 일어난 장소도 중요하지만 때론 그 주변을 살펴보아야 할때도 있습니다.\n');


            } else {
                setIsClueExplain('단서가 모였습니다!\n사건이 일어난 장소는 주차장이지만 이번 사건은 주변에 높은 건물과 연관이 깊습니다.\n');
            }

        } else if (buttonid == 2) {
            if (isClue2Open == false) {
                setIsClueExplain('미해결 단서입니다.\n사망자중 한명은 정상적인 생활이 가능한 사람이였을까요?\n');

            } else {
                setIsClueExplain('단서가 모였습니다!.\n남자는 심한 우울증을 갖고있었습니다.\n');
            }

        } else if (buttonid == 3) {
            if (isClue3Open == false) {
                setIsClueExplain('미해결 단서입니다.\n한명은 계획된 죽음일지도 모릅니다.\n');

            } else {
                setIsClueExplain('단서가 모였습니다!\n남자는 투신 자살을 선택했습니다.\n');
            }

        } else {
            if (isClue4Open == false) {
                setIsClueExplain('미해결 단서입니다.\n억울한 죽음을 당한 사람은 누군지 생각해봅시다.\n');

            } else {
                setIsClueExplain('단서가 모였습니다!\n소년은 건물에서 떨어지는 남성을 피하지 못하고 충돌하여 사망했습니다.\n');
            }

        }

    };

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <ImageBackground source={require('../asset/background/stage1GamePlayBackground.png')} style={styles.backgroundImage} >
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Text style={{ color: 'white' }}>Back</Text>
                </TouchableOpacity>
                <View style={styles.container2}>
                    <ImageBackground source={require('../asset/background/dialouge1.png')} style={styles.speechBubbleImage} resizeMode='stretch'>
                        <ScrollView style={styles.messageContainer}>
                            {messages.map((message, index) => (
                                <Text key={index} style={{ color: message.role === 'user' ? 'red' : 'white' }}>
                                    {message.content}
                                </Text>
                            ))}
                        </ScrollView>
                    </ImageBackground>
                    <Image source={require('../asset/background/policeman.png')} style={styles.personImage} resizeMode='stretch'></Image>
                    {renderMenuButtons()}
                    <TouchableOpacity onPress={toggleMenu} style={[styles.mainButton, { width: mainButtonSize, height: mainButtonSize, borderRadius: mainButtonSize / 2 }]}>
                        <Text style={styles.mainButtonText}>{isMenuVisible ? 'X' : '추리 시작!'}</Text>
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isAlertVisible}
                        onRequestClose={() => {
                            setIsAlertVisible(!isAlertVisible);
                        }}
                    >
                        <View style={styles.alertContainer}>
                            <TextInput
                                style={[styles.alertInput, { color: 'white' }]}
                                onChangeText={setInputText}
                                value={inputText}
                                placeholder="Type your message..."
                            />
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
                                <Text style={styles.confirmButtonText}>질문하기</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isHelpVisible}
                        onRequestClose={() => {
                            setIsHelpVisible(!isHelpVisible);
                        }}
                    >
                        <View style={styles.alertContainer}>
                            <Image source={require('../asset/background/1stageImage.png')} style={{ flex: 1, resizeMode: 'stretch', width: width, height: height }}></Image>
                            <ImageBackground source={require('../asset/background/dialouge1.png')} style={{ flex: 0.5, resizeMode: 'stretch', width: width, height: height }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white', // 설명 텍스트 색상
                                    fontSize: 20,
                                    marginTop: 10
                                }}>주차장에서 놀고 있던 한 소년은 멀리서 낯선 남자의 목소리를 듣게 된다. 낯선 남자는 소년에게 "도망가!"라고 외쳤다. 잠시 후, 소년과 낯선 남자는 그 자리에서 사망하게 되었다.주차장에서는 무슨 일이 일어났던 것일까?</Text>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white', // 설명 텍스트 색상
                                    fontSize: 20,
                                    marginTop: 10
                                }}>관련 인물: 남자, 소년</Text>
                            </ImageBackground>

                            <TouchableOpacity style={styles.confirmButton} onPress={closeHelpAlert}>
                                <Text style={styles.confirmButtonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isClueVisible}
                        style={{ flex: 1 }}
                        onRequestClose={() => {
                            setIsHelpVisible(!isClueVisible);
                        }}
                    >
                        <View style={styles.alertContainer}>
                            <ImageBackground source={require('../asset/background/dialouge1.png')} style={{ flex: 1, resizeMode: 'stretch', width: width, height: height, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, marginBottom: 30 }}>{isClueExplain}</Text>
                                {/* 버튼 컨테이너 */}
                                <View style={styles.buttonContainer}>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(1)}>
                                            <Text style={styles.confirmButtonText}>단서1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(2)}>
                                            <Text style={styles.confirmButtonText}>단서2</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(3)}>
                                            <Text style={styles.confirmButtonText}>단서3</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(4)}>
                                            <Text style={styles.confirmButtonText}>단서4</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ImageBackground>



                            <TouchableOpacity style={styles.confirmButton} onPress={closClueAlert}>
                                <Text style={styles.confirmButtonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ImageBackground>

        </Animated.View>

    );
};


export default gamePlayScreen;
