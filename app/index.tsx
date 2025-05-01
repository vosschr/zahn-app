import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Sample images - replace with your own image sources
const IMAGES = [
  require('@/assets/images/teeth/K1.png'),
  require('@/assets/images/teeth/K2.png'),
  require('@/assets/images/teeth/K3.png'),
  require('@/assets/images/teeth/K4.png'),
  require('@/assets/images/teeth/A1.png'),
  require('@/assets/images/teeth/A2.png'),
  require('@/assets/images/teeth/A3.png'),
  require('@/assets/images/teeth/A4.png'),
  require('@/assets/images/teeth/I1.png'),
  require('@/assets/images/teeth/I2.png'),
  require('@/assets/images/teeth/I3.png'),
  require('@/assets/images/teeth/I4.png'),
];

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.3;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TIMER_DURATION = 15;

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: number;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setProgress(((TIMER_DURATION - (timeLeft - 1)) / TIMER_DURATION) * CIRCUMFERENCE);
      }, 1000);
    } else if (timeLeft === 0) {
      if (currentImageIndex < IMAGES.length - 1) {
        // Move to next image
        setCurrentImageIndex(prev => prev + 1);
        setTimeLeft(TIMER_DURATION);
        setProgress(0);
      } else {
        // All images shown, reset to start
        setIsRunning(false);
        setCurrentImageIndex(0);
        setTimeLeft(TIMER_DURATION);
        setProgress(0);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentImageIndex]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentImageIndex(0);
    setTimeLeft(TIMER_DURATION);
    setProgress(0);
  };

  return (
    <View style={styles.container}>
      {!isRunning ? (
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.content}>
          <Image source={IMAGES[currentImageIndex]} style={styles.image} />
          
          <View style={styles.timerContainer}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#e0e0e0"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#4CAF50"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE - progress}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: '70%',
    height: '70%',
    marginBottom: 30,
    borderRadius: 10,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerText: {
    position: 'absolute',
    fontSize: 36,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
  },
});