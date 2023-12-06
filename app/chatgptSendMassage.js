import axios from 'axios';
import { Alert } from 'react-native';

// 필요한 추가 변수들을 정의하세요. 예를 들면:
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
    "남자는 극심한 우울증을 갖고있었습니다.",
    "남자는 평범한 회사원이였습니다."
];



export const sendMessage = async (inputText, setMessages, clueStates) => {
    

    const userMessage = { role: 'user', content: inputText };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const { setIsClue1Open, setIsClue2Open, setIsClue3Open, setIsClue4Open } = clueStates;


    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "ft:davinci-002:personal::8SHaIY4J", // 수정된 모델 ID
            prompt: inputText,
            temperature: 0,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["endpoint", "\n"],
        }, {
            headers: {
                'Authorization': `Bearer api 키 입력`, // API 키
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