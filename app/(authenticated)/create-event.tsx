import { Picker } from '@react-native-picker/picker';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../FirebaseConfig';

type Business = {
  id: string;
  name: string;
  logoUrl?: string;
};

export default function CreateEventScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState(''); // YYYY-MM-DDTHH:mm
  const [endAt, setEndAt] = useState('');

  const eventsRef = useMemo(() => collection(db, 'events'), []);

  useEffect(() => {
    (async () => {
      const col = collection(db, 'businesses');
      const q = query(col, orderBy('name'));
      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setBusinesses(rows);
      if (rows.length && !businessId) setBusinessId(rows[0].id);
    })();
  }, []);

  const createEvent = async () => {
    if (!businessId) return Alert.alert('Please select a business');
    if (!title.trim()) return Alert.alert('Event title is required');
    if (!startAt) return Alert.alert('Start time is required');
    try {
      await addDoc(eventsRef, {
        businessId,
        title: title.trim(),
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle('');
      setStartAt('');
      setEndAt('');
      Alert.alert('Saved', 'Event created');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to create event');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Event</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Business</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={businessId} onValueChange={setBusinessId}>
              {businesses.map((b) => (
                <Picker.Item key={b.id} label={b.name} value={b.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            placeholder="e.g., Harvest Festival"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Start (YYYY-MM-DDTHH:mm)</Text>
          <TextInput
            placeholder="2025-09-06T18:30"
            value={startAt}
            onChangeText={setStartAt}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>End (optional, YYYY-MM-DDTHH:mm)</Text>
          <TextInput
            placeholder="2025-09-06T21:00"
            value={endAt}
            onChangeText={setEndAt}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={createEvent}>
          <Text style={styles.primaryBtnText}>Save Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  field: { gap: 6 },
  label: { fontWeight: '600' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  primaryBtn: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: 'white', fontWeight: '700' },
});
