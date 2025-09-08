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
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../FirebaseConfig';
import { Business } from '../../components/types';

// NEW: image picking & upload
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export default function CreateEventScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessId, setBusinessId] = useState<string>('');

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState(''); // YYYY-MM-DDTHH:mm
  const [endAt, setEndAt] = useState('');

  // Address (require street; others optional)
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateUS, setStateUS] = useState('');
  const [zip, setZip] = useState('');

  // Image
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  // Pick an image from camera roll
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'We need access to your photos to select an image.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload to Firebase Storage and return download URL
  const uploadImageAsync = async (uri: string) => {
    setUploading(true);
    try {
      const storage = getStorage();
      // Simple unique path; you could also use businessId or a generated doc id
      const filename = `event_${Date.now()}.jpg`;
      const storageRef = ref(storage, `events/${filename}`);

      const res = await fetch(uri);
      const blob = await res.blob();
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } finally {
      setUploading(false);
    }
  };

  const createEvent = async () => {
    if (!businessId) return Alert.alert('Please select a business');
    if (!title.trim()) return Alert.alert('Event title is required');
    if (!startAt) return Alert.alert('Start time is required');
    if (!street.trim()) return Alert.alert('Street address is required');
    if (!imageUri) return Alert.alert('Please choose an image for this event');

    try {
      // 1) upload image, get URL
      const imageUrl = await uploadImageAsync(imageUri);

      // 2) save event document
      await addDoc(eventsRef, {
        businessId,
        title: title.trim(),
        imageUrl, // ✅ new field
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        address: {
          street: street.trim(),
          city: city.trim() || null,
          state: stateUS.trim() || null,
          zip: zip.trim() || null,
        },
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3) reset form
      setTitle('');
      setStartAt('');
      setEndAt('');
      setStreet('');
      setCity('');
      setStateUS('');
      setZip('');
      setImageUri(null);

      Alert.alert('Saved', 'Event created');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to create event');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // adjust if you have a custom header
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={styles.title}>Create Event</Text>

          <View className="mb-2" style={styles.field}>
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

          {/* Address */}
          <View style={styles.field}>
            <Text style={styles.label}>Street *</Text>
            <TextInput
              placeholder="123 Main St"
              value={street}
              onChangeText={setStreet}
              style={styles.input}
            />
          </View>
          <View style={[styles.field, styles.row]}>
            <TextInput
              placeholder="City"
              value={city}
              onChangeText={setCity}
              style={[styles.input, { flex: 1 }]}
            />
            <View style={{ width: 8 }} />
            <TextInput
              placeholder="State"
              value={stateUS}
              onChangeText={setStateUS}
              style={[styles.input, { width: 80 }]}
            />
            <View style={{ width: 8 }} />
            <TextInput
              placeholder="Zip"
              value={zip}
              onChangeText={setZip}
              style={[styles.input, { width: 100 }]}
              keyboardType="numeric"
            />
          </View>

          {/* Image picker + preview */}
          <View style={styles.field}>
            <Text style={styles.label}>Event Image *</Text>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 10,
                  marginBottom: 8,
                }}
                resizeMode="cover"
              />
            ) : null}
            <TouchableOpacity
              disabled={uploading}
              style={[styles.outlineBtn, uploading && { opacity: 0.6 }]}
              onPress={pickImage}>
              <Text style={styles.outlineBtnText}>
                {imageUri ? 'Change Image' : 'Pick Image'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, uploading && { opacity: 0.6 }]}
            onPress={createEvent}
            disabled={uploading}>
            <Text style={styles.primaryBtnText}>
              {uploading ? 'Uploading…' : 'Save Event'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  outlineBtnText: { color: '#3B82F6', fontWeight: '700' },
  primaryBtn: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: 'white', fontWeight: '700' },
});
