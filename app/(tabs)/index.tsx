import { useEffect, useState } from 'react';
import { Button, FlatList, Modal, ScrollView, StatusBar, StyleSheet, TextInput } from 'react-native';
import _ from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import questionsJSON from '@/data/questions.json';
import { IQuestion, IScoreBoard } from '@/interfaces/questionnaires';
import storage from '@/libs/StorageManager';

const randomQuestions: IQuestion[] = _.shuffle(questionsJSON);

export default function TabOneScreen() {
  const [questions, setQuestions] = useState<IQuestion[]>(randomQuestions);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [scoreBoard, setScoreBoard] = useState<IScoreBoard[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(randomQuestions.length).fill(-1));

  const loadRandomQuestion = () => {
    const shuffleQuestions: IQuestion[] = _.shuffle(questionsJSON);
    setQuestions(shuffleQuestions);
  };

  const handleSaveName = () => {
    if (userName) {
      storage.save({
        key: 'userName',
        data: { userName },
      });
      setModalVisible(false);
    }
    setModalVisible(false);
  };

  const checkAnswer = (questionIndex: number, answerIndex: number) => {
    const question = questions[questionIndex];
    question.selectedAnswerIndex = answerIndex;
    const isCorrect = answerIndex === question.correctAnswerIndex;
    const found = scoreBoard.find((item) => item.id == question.id);

    let newScoreBoard: IScoreBoard[];
    if (found) {
      newScoreBoard = scoreBoard.map((item) => {
        if (item.id == found.id) {
          item.correct = isCorrect;
        }
        return item;
      });
    } else {
      newScoreBoard = [...scoreBoard, { ...question, correct: isCorrect }];
    }
    setScoreBoard(newScoreBoard);

    // Update selected answer
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const renderItem = ({ item, index }: { item: any; index: number; }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      {item.answers.map((answer: string, answerIndex: number) => (
        <Button
          key={answerIndex}
          title={answer}
          onPress={() => checkAnswer(index, answerIndex)}
          color={selectedAnswers[index] === answerIndex ? 'green' : ''}
        />
      ))}
    </View>
  );

  const handleSubmit = () => {
    const currentScore = scoreBoard.filter((scoreItem) => scoreItem.correct).length;
    setScore(currentScore);
    storage.save({
      key: 'userName',
      data: { userName, scoreBoard, score: currentScore },
    });
    console.log('Score: ', currentScore);
  };

  useEffect(() => {
    loadRandomQuestion();
    storage
      .load({
        key: 'userName',
      })
      .then((data) => {
        setUserName(data.userName);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
              <View style={{ backgroundColor: '#fff', padding: 20 }}>
                <Text>Please enter your name:</Text>
                <TextInput
                  placeholder="Name"
                  value={userName}
                  onChangeText={setUserName}
                  onSubmitEditing={handleSaveName}
                />
                <Button title="Save" onPress={handleSaveName} />
              </View>
            </View>
          </Modal>
          {userName && (
            <>
              <View style={styles.container}>
                <FlatList
                  data={questions}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button title={'Submit'} onPress={() => handleSubmit()} />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  leaderboardItem: {
    fontSize: 16,
    marginTop: 5,
  },
});

