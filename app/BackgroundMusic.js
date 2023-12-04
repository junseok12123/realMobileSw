import { Audio } from 'expo-av';

// 배경음악 객체
let backgroundMusic = null;
let gameplayBackgroundMusic = null;
let gameplaySEF =null;

// 배경음악 재생 함수
export const playMainBackgroundMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../bgm/testBackgroundMusic.mp3'),
        {
          shouldPlay: true,
          isLooping: true
        }
      );
      backgroundMusic = sound;
    } catch (error) {
      console.error("배경음악 재생 중 오류 발생:", error);
    }
  };

// 배경음악 정지 및 해제 함수
export const stopMainBackgroundMusic = async () => {
  if (backgroundMusic) {
    await backgroundMusic.stopAsync();
    await backgroundMusic.unloadAsync();
    backgroundMusic = null;
  }
};

export const playGameplayBackgroundMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../bgm/gameplayBackgroundMusic.mp3'),
        {
          shouldPlay: true,
          isLooping: true
        }
      );
      gameplayBackgroundMusic = sound;
    } catch (error) {
      console.error("배경음악 재생 중 오류 발생:", error);
    }
  };

// 배경음악 정지 및 해제 함수
export const stopGameplayBackgroundMusic = async () => {
  if (gameplayBackgroundMusic) {
    await gameplayBackgroundMusic.stopAsync();
    await gameplayBackgroundMusic.unloadAsync();
    gameplayBackgroundMusic = null;
  }
};

export const playGameplaySEF = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../bgm/gameplaySoundEffect.mp3'),
        {
          shouldPlay: true,
          isLooping: true
        }
      );
      gameplaySEF = sound;
    } catch (error) {
      console.error("배경음악 재생 중 오류 발생:", error);
    }
  };

// 배경음악 정지 및 해제 함수
export const stopGameplaySEF = async () => {
  if (gameplaySEF) {
    await gameplaySEF.stopAsync();
    await gameplaySEF.unloadAsync();
    gameplaySEF = null;
  }
};

export const playSoundEffect = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../bgm/menuSelectButton.mp3') // 효과음 파일 경로
      );
      await sound.playAsync();
      // 효과음 재생 후 해제
      sound.setOnPlaybackStatusUpdate(async status => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("효과음 재생 중 오류 발생:", error);
    }
  };