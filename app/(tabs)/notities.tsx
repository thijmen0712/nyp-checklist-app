import React, { useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function NotitiesScreen() {
  const [notities, setNotities] = useState<string[]>([]);
  const [nieuweNotitie, setNieuweNotitie] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const voegNotitieToe = () => {
    const text = nieuweNotitie.trim();
    if (text !== '') {
      setNotities([...notities, text]);
      setNieuweNotitie('');
      setModalVisible(false);
    }
  };

  const verwijderNotitie = (index: number) => {
    Alert.alert('Verwijderen?', 'Weet je zeker dat je deze notitie wilt verwijderen?', [
      { text: 'Nee', style: 'cancel' },
      {
        text: 'Ja',
        style: 'destructive',
        onPress: () => {
          const kopie = [...notities];
          kopie.splice(index, 1);
          setNotities(kopie);
        },
      },
    ]);
  };

  const renderRightActions = (index: number) => (
    <TouchableOpacity
      onPress={() => verwijderNotitie(index)}
      style={styles.verwijderKnop}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Verwijder</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.plusButton}
      >
        <Text style={{ fontSize: 24, color: '#cccccc' }}>＋</Text>
      </TouchableOpacity>

      <FlatList
        data={notities}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Swipeable renderRightActions={() => renderRightActions(index)}>
            <View style={styles.notitieBlok}>
              <Text style={styles.text}>{item}</Text>
            </View>
          </Swipeable>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalAchtergrond}>
          <View style={styles.modalBinnen}>
            <Text style={[styles.text, { marginBottom: 8 }]}>Notitie toevoegen</Text>
            <TextInput
              placeholder="Typ iets belangrijks..."
              placeholderTextColor="#777"
              value={nieuweNotitie}
              onChangeText={setNieuweNotitie}
              style={styles.input}
            />
            <Button title="Toevoegen" color="#7db089" onPress={voegNotitieToe} />
            <Button title="Annuleren" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#393939',
  },
  plusButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#111d16',
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  notitieBlok: {
    padding: 12,
    marginTop: 8,
    backgroundColor: '#111d16',
    borderRadius: 6,
  },
  modalAchtergrond: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBinnen: {
    width: '80%',
    backgroundColor: '#111d16',
    padding: 20,
    borderRadius: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    color: '#cccccc',
    marginBottom: 12,
    paddingVertical: 4,
  },
  text: {
    color: '#cccccc',
    fontSize: 16,
  },
  verwijderKnop: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginTop: 8,
    borderRadius: 6,
  },
});
