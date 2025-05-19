import React, { useEffect, useState } from 'react';
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

const checklistOpen = [
  'Schermen aanzetten',
  'Stoelen van de tafels',
  'Spullen draaitafel',
  'Spullen scheptafel',
  'Vaatwasser aanzetten',
  'Warmhoudbrug aanzetten',
  'Tassenwarmer aanzetten',
  'Lijstje maken op whiteboard',
  'Deuren openzetten',
  'Open bordje aanzetten',
  'Oven aanzetten om 15:45',
];

const checklistClose = [
  'Vegen (achter make-line, kooeling en winkel)',
  'Dozen aanvullen',
  'Ovenplaat + randjes schoonmaken',
  'Scheptafel schoonmaken',
  'Draaitafel schoonmaken',
  'Make-line schoonmaken',
  'Wasbakje schoonmaken',
  'Vaat opruimen (stickers van de bakken + goed droog)',
  'Koeling handvaten schoonmaken',
  'Maxima schoonmaken',
  'Scrobben + putje schoonmaken',
  'Counter schoonmaken',
  'Glasex over schermen en ramen',
  'Bezorgtassen netjes',
  'Prullenbakken legen',
  'Accus opladen + in de kluis',
  'Stoelen op tafels',
  'Voordeur sluiten',
  'Open bordje uitzetten',
  'Lampen voor uitzetten',
  'Koeling + vriezerdeuren sluiten',
  'Keuken schoon',
  'Schuur opslot',
  'zijdeur opslot',
  'alarm aanzetten',
];

const checklistKassa = [
  'Pinapparaten aan de lader',
  'Alle orders afronden',
  'Iedereen uitklokken',
  'Pinbetalingen controleren',
  'Raport afdrukken',
  'Dashboard invullen',
  'Fotos sturen naar de management groep',
  'Kassa uitzetten',
];

function Checklist({ data }: { data: string[] }) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter(i => i !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => toggleItem(item)}
      style={{
        padding: 12,
        marginVertical: 4,
        backgroundColor: checkedItems.includes(item) ? '#7db089' : '#111d16',
        borderRadius: 6,
      }}
    >
<Text style={{ color: checkedItems.includes(item) ? '#111d16' : '#cccccc' }}>{item}</Text>
    </TouchableOpacity>
  );

  const progress = Math.round((checkedItems.length / data.length) * 100);

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#393939' }}>
      <Text style={{ marginBottom: 8, color: '#cccccc' }}>Voortgang: {progress}%</Text>
      <FlatList data={data} renderItem={renderItem} keyExtractor={item => item} />
    </View>
  );
}

export function IndexScreen() {
  return <Checklist data={checklistOpen} />;
}

export function SluitenScreen() {
  return <Checklist data={checklistClose} />;
}

export function KassaScreen() {
  return <Checklist data={checklistKassa} />;
}

export function PauzeScreen() {
  const [namen, setNamen] = useState<string[]>([]);
  const [pauzes, setPauzes] = useState<{ [key: string]: { begin: number; eind: number } | null }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [nieuweNaam, setNieuweNaam] = useState('');
  const [nu, setNu] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNu(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const voegToe = () => {
    const naam = nieuweNaam.trim();
    if (naam === '') {
      Alert.alert('Vul een naam in');
      return;
    }
    if (namen.includes(naam)) {
      Alert.alert('Naam bestaat al');
      return;
    }
    setNamen([...namen, naam]);
    setPauzes(prev => ({ ...prev, [naam]: null }));
    setNieuweNaam('');
    setModalVisible(false);
  };

  const beginPauze = (naam: string) => {
    const begin = Date.now();
    const eind = begin + 30 * 60 * 1000;
    setPauzes(prev => ({ ...prev, [naam]: { begin, eind } }));
  };

  const verwijderNaam = (naam: string) => {
    Alert.alert('Verwijderen?', `Weet je zeker dat je ${naam} wilt verwijderen?`, [
      { text: 'Nee', style: 'cancel' },
      {
        text: 'Ja',
        style: 'destructive',
        onPress: () => {
          setNamen(prev => prev.filter(n => n !== naam));
          setPauzes(prev => {
            const kopie = { ...prev };
            delete kopie[naam];
            return kopie;
          });
        },
      },
    ]);
  };

  const renderRightActions = (naam: string) => (
    <TouchableOpacity
      onPress={() => verwijderNaam(naam)}
      style={styles.verwijderKnop}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Verwijder</Text>
    </TouchableOpacity>
  );

  const formatHHMM = (ms: number) => {
    const date = new Date(ms);
    const uur = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${uur}:${min}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.plusButton}
      >
        <Text style={{ fontSize: 24, color: '#cccccc' }}>＋</Text>
      </TouchableOpacity>

      <FlatList
        data={namen}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const pauze = pauzes[item];
          return (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <View style={styles.naamBlok}>
                <Text style={{ fontSize: 18, color: '#cccccc' }}>{item}</Text>
                {pauze ? (
                  <Text style={{ marginTop: 4, color: '#cccccc' }}>
                    ⏳ {formatHHMM(pauze.begin)} - {formatHHMM(pauze.eind)}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => beginPauze(item)}>
                    <Text style={{ fontSize: 18, color: '#cccccc', textAlign: 'center' }}>Begin</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Swipeable>
          );
        }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalAchtergrond}>
          <View style={styles.modalBinnen}>
            <Text style={{ marginBottom: 8, color: '#cccccc' }}>Naam toevoegen</Text>
            <TextInput
              placeholder="Typ naam"
              value={nieuweNaam}
              onChangeText={text => setNieuweNaam(text)}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            <Button
              title="Toevoegen"
              color="#7db089"
              onPress={voegToe}
            />
            <Button
              title="Annuleren"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#393939',
  },
  naamBlok: {
    padding: 12,
    marginTop: 8,
    backgroundColor: '#111d16',
    borderRadius: 6,
  },
  modalAchtergrond: {
    flex: 1,
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
  verwijderKnop: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginTop: 8,
    borderRadius: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'white',
    backgroundColor: '#111d16',
    padding: 12,
    alignItems: 'center',
  },
});
