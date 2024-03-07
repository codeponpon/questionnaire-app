import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import storage from '@/libs/StorageManager';
import { IScoreBoard } from '@/interfaces/questionnaires';

export default function Leaderboard() {
  const [userName, setUserName] = useState<string | null>(null);
  const [scoreBoard, setScoreBoard] = useState<IScoreBoard[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    storage
      .load({
        key: 'userName',
      })
      .then((data) => {
        const { userName, scoreBoard, score } = data;
        setUserName(userName);
        setScoreBoard(scoreBoard);
        setScore(score);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.leaderboardTitle}>Leaderboard: {userName} (Score: {score})</Text>
      <FlatList
        data={scoreBoard}
        renderItem={({ item }) => (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.leaderboardItem}>
              {item.question}
            </Text>
            <Text style={styles.leaderboardItem}>
              User Selected: {item.answers[item.selectedAnswerIndex]}
            </Text>
            <Text style={styles.leaderboardItem}>
              Correct answer: {item.answers[item.correctAnswerIndex]}
            </Text>
            <Text style={styles.leaderboardItem}>
              Result: {item.correct ? 'Correct' : 'Incorrect'}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
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
