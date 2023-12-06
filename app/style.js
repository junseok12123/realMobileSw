import { StyleSheet } from "react-native";
import { Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
const buttonSize = 60;
export const styles = StyleSheet.create({
    
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
      header: {
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
        color: '#FFFFFF',
      },
      button: {
        backgroundColor: '#000000',
        padding: 15,
        borderRadius: 25,
        width: '60%',
        marginBottom: 10,
      },
      mainbuttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
      },
      mainLogoStyle: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      mainLogoContainer: {
        height: '40%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      },dialogueBackgroundStyle: {
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

},confirmButton: {
        backgroundColor: 'black', // 배경색을 검은색으로 설정
        paddingHorizontal: 20, // 가로 길이를 늘림
        paddingVertical: 10, // 세로 길이 설정
        borderRadius: 20, // 타원형 모양을 만들기 위한 둥근 테두리
        borderColor: 'white', // 테두리 색상을 하얀색으로 설정
        borderWidth: 1, // 테두리 두께
        justifyContent: 'center', // 내부 텍스트 중앙 정렬
        alignItems: 'center',
        marginHorizontal: 20,
      },container2: {
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



});