import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { View, TouchableOpacity, Animated, StyleSheet, Text, ImageBackground, Image, Dimensions, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { playSoundEffect, stopGameplayBackgroundMusic, stopGameplaySEF } from './BackgroundMusic';


const { width, height } = Dimensions.get('window');
const mainButtonSize = 80; // '추리 시작!' 버튼의 크기
const buttonSize = 60; // 메뉴 버튼의 크기
const menuRadius = 100; // 메뉴 버튼이 펼쳐질 반경

// 메뉴 버튼에 대한 정보를 담고 있는 배열
const menuButtonInfos = [
    { title: '문제 해결!', color: 'black', id: 1 },
    { title: '질문?', color: 'black', id: 2 },
    { title: '문제 설명', color: 'black', id: 3 },
    { title: '단서 확인', color: 'black', id: 4 },
];

const GamePlayScreen = () => {
    const router = useRouter();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const animations = useRef(menuButtonInfos.map(() => new Animated.Value(0))).current;
    const fadeAnim = useRef(new Animated.Value(1)).current; // 페이드 애니메이션을 위한 Animated.Value

    const [isAlertVisible, setIsAlertVisible] = useState(false); // 질문 모달창 표시
    const [isHelpVisible, setIsHelpVisible] = useState(false); // 문제설명 모달창 표시
    const [isClueVisible, setIsClueVisible] = useState(false); // 단서확인 모달창 표시

    const [isClueExplain, setIsClueExplain] = useState('4개의 단서를 모아 정답을 맞추세요.');

    const [isClueButtonText1, setIsClueButtonText1] = useState('단서 1');
    const [isClueButtonText2, setIsClueButtonText2] = useState('단서 2');
    const [isClueButtonText3, setIsClueButtonText3] = useState('단서 3');
    const [isClueButtonText4, setIsClueButtonText4] = useState('단서 4');

    const [isClue1Open, setIsClue1Open] = useState(false);
    const [isClue2Open, setIsClue2Open] = useState(false);
    const [isClue3Open, setIsClue3Open] = useState(false);
    const [isClue4Open, setIsClue4Open] = useState(false);


    const [messages, setMessages] = useState([]);//chatgpt
    const [inputText, setInputText] = useState('');//chatgpt

    const predefinedMessages = [
        "저는 이번 사건을 맡은 형사입니다. 무엇을 도와드릴까요?",
        "남성 한명과 남자아이 한명이 사망하는 사건이 벌어졌습니다.",
        "아닙니다. 이번 사건은 교통사고와는 관련이 없습니다.",
        "소년은 그저 평범한 소년이였습니다.",
        "네 맞습니다",
        "남자 때문에 소년이 죽은건 맞지만 원해서 죽이진 않았습니다.",
        "네 맞습니다. 남성은 극심한 우울증을 갖고있습니다.",
        "남성은 극심한 우울증을 갖고있습니다.",
        "주차장에서 시신이 발견되었으며 주변에 높은 건물들이 많습니다.",
        "정답입니다. 게임을 종료합니다.",
        "아닙니다. 서로 만난적이 없습니다.",
        "남자는 자살을 선택했습니다.",
        "소년은 건물에서 떨어저 자살하던 남성을 피하지 못하고 충돌하여 사망했습니다.",
        "남자는 소년의 죽음을 원하지 않았습니다.",
        "소년보다 남자가 주차장에서 발견되었던 이유를 생각해봅시다.",
        "사건에 관련된 질문을 해주세요.",
        "물건이나 물체는 아니지만 무언가 떨어진것은 맞습니다.",
        "사건 현장에는 소년과 남자 단 둘 뿐이였습니다.",
        "남자는 극심한 우울증을 갖고있었습니다."
    ];

    const moveResultScreen = () => {
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
            if (isClue1Open, isClue2Open, isClue3Open, isClue4Open == true) {
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
        sendMessage();
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

    const sendMessage = async () => {
        const userMessage = { role: 'user', content: inputText };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputText('');

        try {
            const response = await axios.post('https://api.openai.com/v1/completions', {
                model: "ft:davinci-002:personal::8Rtt71s4", // 수정된 모델 ID
                prompt: inputText,
                temperature: 0,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: ["endpoint", "\n"],
            }, {
                headers: {
                    'Authorization': `Bearer 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`, // API 키
                    'Content-Type': 'application/json'
                }
            });

            const botMessage = {
                role: 'assistant',
                content: response.data.choices[0].text.trim(),
            };



            var k = 0;

            // 특정 단어를 포함하고 있는지 확인
            for (var i = 0; i < predefinedMessages.length; i++) {

                k++;


                if (botMessage.content.includes(predefinedMessages[i])) {

                    setMessages(prevMessages => [...prevMessages, botMessage]);
                    if (botMessage.content.includes('정답입니다. 게임을 종료합니다. 정답코드:101')) {
                        moveResultScreen();

                    }
                    if (botMessage.content.includes('주차장에서 시신이 발견되었으며 주변에 높은 건물들이 많습니다.')) {
                        setIsClue1Open(true);
                        Alert.alert('단서1이 열렸습니다!');

                    }
                    if (botMessage.content.includes('남성은 극심한 우울증을 갖고있습니다.') || botMessage.content.includes('남자는 극심한 우울증을 갖고있었습니다.')) {
                        setIsClue2Open(true);
                        Alert.alert('단서2가 열렸습니다!');

                    }
                    if (botMessage.content.includes('남자는 자살을 선택했습니다.')) {
                        setIsClue3Open(true);
                        Alert.alert('단서3가 열렸습니다!');

                    }
                    if (botMessage.content.includes('소년은 건물에서 떨어저 자살하던 남성을 피하지 못하고 충돌하여 사망했습니다.')) {
                        setIsClue4Open(true);
                        Alert.alert('단서4가 열렸습니다!');

                    }


                    break;
                } else {
                    if (k == predefinedMessages.length) {
                        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "관련이 없거나 이해할 수 없는 질문입니다." }]);
                        // 특정 단어가 없으면 다른 메시지를 설정
                    }



                }

            }


            console.log(botMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message: ' + error.message);
        }
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

    const renderMenuButtons = () => {
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

    const handleBackPress = () => {
        playSoundEffect();
        stopGameplayBackgroundMusic();
        stopGameplaySEF();
        router.replace('/mainMenu');
    };

    const handleButtonPress = (buttonid) => {
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
                <View style={styles.container}>
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
                                            <Text style={styles.confirmButtonText}>{isClueButtonText1}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(2)}>
                                            <Text style={styles.confirmButtonText}>{isClueButtonText2}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(3)}>
                                            <Text style={styles.confirmButtonText}>{isClueButtonText3}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleButtonPress(4)}>
                                            <Text style={styles.confirmButtonText}>{isClueButtonText4}</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // 하단 여백
    },
    menuButton: {
        position: 'absolute',
        width: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'

    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    mainButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 20, // '추리 시작!' 버튼과 메뉴 버튼 사이의 간격
    },
    mainButtonText: {
        color: 'white',
        fontSize: 18,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    personImage: {
        width: width * 0.7, // 화면 너비의 50% 크기
        height: height * 0.4,
        marginBottom: 100
    },
    speechBubbleImage: {

        width: width, // 화면 너비와 같게
        height: height * 0.2, // 화면 높이의 30% 크기
        alignSelf: 'center', // 가운데 정렬
        marginTop: height * 0.1, // 사람 이미지 위에 위치하도록 조정
    },
    alertContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
        width: width,
        height: 1
    },
    alertInput: {
        width: '90%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
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
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
    alertBox: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    messageText: {
        color: 'white', // 혹은 적절한 색상
        padding: 10, // 텍스트 주변 여백
        // ... 기타 스타일 속성 ...
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: 'black', // 배경색을 검은색으로 설정
        paddingHorizontal: 20, // 가로 길이를 늘림
        paddingVertical: 10, // 세로 길이 설정
        borderRadius: 20, // 타원형 모양을 만들기 위한 둥근 테두리
        borderColor: 'white', // 테두리 색상을 하얀색으로 설정
        borderWidth: 1, // 테두리 두께
        justifyContent: 'center', // 내부 텍스트 중앙 정렬
        alignItems: 'center'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // 버튼 행 간의 간격 증가
    },

    // ... 나머지 스타일 ...

});

export default GamePlayScreen;
