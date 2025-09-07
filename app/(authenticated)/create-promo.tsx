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

export default function CreatePromoScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(''); // YYYY-MM-DD
  const [end, setEnd] = useState('');

  const promosRef = useMemo(() => collection(db, 'promotions'), []);

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

  const createPromo = async () => {
    if (!businessId) return Alert.alert('Please select a business');
    if (!title.trim()) return Alert.alert('Promotion title is required');
    try {
      await addDoc(promosRef, {
        businessId,
        title: title.trim(),
        validFrom: start ? new Date(start) : null,
        validTo: end ? new Date(end) : null,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle('');
      setStart('');
      setEnd('');
      Alert.alert('Saved', 'Promotion created');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to create promotion');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Promotion</Text>

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
          <Text style={styles.label}>Promotion Title</Text>
          <TextInput
            placeholder="e.g., 10% off tasting"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>

        <View style={[styles.field, styles.row]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Start (YYYY-MM-DD)</Text>
            <TextInput
              placeholder="2025-09-01"
              value={start}
              onChangeText={setStart}
              style={styles.input}
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End (YYYY-MM-DD)</Text>
            <TextInput
              placeholder="2025-09-30"
              value={end}
              onChangeText={setEnd}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={createPromo}>
          <Text style={styles.primaryBtnText}>Save Promotion</Text>
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
  row: { flexDirection: 'row', alignItems: 'center' },
  primaryBtn: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: 'white', fontWeight: '700' },
});
