import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../FirebaseConfig';
import { Business } from '../../components/types';

const parseCsv = (raw: string) =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
const num = (s?: string) => (s && isFinite(+s) ? +s : undefined);

export default function BusinessAdminScreen() {
  const businessesRef = useMemo(() => collection(db, 'businesses'), []);
  const [items, setItems] = useState<Business[]>([]);

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [photosCsv, setPhotosCsv] = useState('');
  const [promosCsv, setPromosCsv] = useState('');
  const [eventsCsv, setEventsCsv] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateUS, setStateUS] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);
  const fetchBusinesses = async () => {
    const q = query(businessesRef, orderBy('name'));
    const snap = await getDocs(q);
    setItems(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Business, 'id'>),
      })),
    );
  };

  const addBusiness = async () => {
    if (!name.trim()) {
      Alert.alert('Name is required');
      return;
    }
    const latNum = num(lat);
    const lngNum = num(lng);
    const payload: Business = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      iconUrl: iconUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      photos: parseCsv(photosCsv),
      promotions: parseCsv(promosCsv),
      events: parseCsv(eventsCsv),
      location:
        latNum !== undefined && lngNum !== undefined
          ? { lat: latNum, lng: lngNum }
          : undefined,
      address:
        street || city || stateUS || zip
          ? {
              street: street || undefined,
              city: city || undefined,
              state: stateUS || undefined,
              zip: zip || undefined,
            }
          : undefined,
      contact: {
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        mapsUrl: mapsUrl.trim() || undefined,
      },
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(businessesRef, payload as any);

    // reset
    setName('');
    setDescription('');
    setCategory('');
    setIconUrl('');
    setBannerUrl('');
    setPhotosCsv('');
    setPromosCsv('');
    setEventsCsv('');
    setLat('');
    setLng('');
    setStreet('');
    setCity('');
    setStateUS('');
    setZip('');
    setPhone('');
    setWebsite('');
    setMapsUrl('');
    fetchBusinesses();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'businesses', id), {
      isActive: !current,
      updatedAt: serverTimestamp(),
    });
    fetchBusinesses();
  };
  const updateField = async (id: string, patch: Partial<Business>) => {
    await updateDoc(doc(db, 'businesses', id), {
      ...patch,
      updatedAt: serverTimestamp(),
    } as any);
    fetchBusinesses();
  };
  const removeBusiness = async (id: string) => {
    await deleteDoc(doc(db, 'businesses', id));
    fetchBusinesses();
  };

  // Stable header element (no ScrollView here, no inline function)
  const header = (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={styles.mainTitle}>Businesses (Admin)</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Name *"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Category (e.g., winery)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
        <TextInput
          placeholder="Icon URL"
          value={iconUrl}
          onChangeText={setIconUrl}
          style={styles.input}
        />
        <TextInput
          placeholder="Banner URL"
          value={bannerUrl}
          onChangeText={setBannerUrl}
          style={styles.input}
        />
        <TextInput
          placeholder="Photos (CSV of URLs)"
          value={photosCsv}
          onChangeText={setPhotosCsv}
          style={styles.input}
        />
        <TextInput
          placeholder="Promotions (CSV of ids/titles)"
          value={promosCsv}
          onChangeText={setPromosCsv}
          style={styles.input}
        />
        <TextInput
          placeholder="Events (CSV of ids/titles)"
          value={eventsCsv}
          onChangeText={setEventsCsv}
          style={styles.input}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            placeholder="Lat"
            value={lat}
            onChangeText={setLat}
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Lng"
            value={lng}
            onChangeText={setLng}
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
          />
        </View>

        <TextInput
          placeholder="Street"
          value={street}
          onChangeText={setStreet}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="State"
            value={stateUS}
            onChangeText={setStateUS}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="Zip"
            value={zip}
            onChangeText={setZip}
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
        <TextInput
          placeholder="Website"
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
        />
        <TextInput
          placeholder="Maps URL"
          value={mapsUrl}
          onChangeText={setMapsUrl}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addButton} onPress={addBusiness}>
          <Text style={styles.buttonText}>Add Business</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          style={{ flex: 1 }}
          data={items}
          keyExtractor={(b) => b.id!}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                {!!item.category && (
                  <Text style={styles.badge}>{item.category}</Text>
                )}
                {!!item.description && (
                  <Text style={styles.rowSubtitle}>{item.description}</Text>
                )}
                <Text style={styles.meta}>
                  {item.isActive ? 'Active' : 'Inactive'} •{' '}
                  {item.contact?.website || 'no site'}
                </Text>
                <TextInput
                  placeholder="Edit description"
                  defaultValue={item.description}
                  onEndEditing={(e) =>
                    updateField(item.id!, { description: e.nativeEvent.text })
                  }
                  style={[styles.input, { marginTop: 8 }]}
                />
              </View>
              <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <TouchableOpacity
                  style={styles.smallBtn}
                  onPress={() => toggleActive(item.id!, item.isActive)}>
                  <Text style={styles.smallBtnText}>
                    {item.isActive ? 'Disable' : 'Enable'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallBtnDanger}
                  onPress={() => removeBusiness(item.id!)}>
                  <Text style={styles.smallBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListHeaderComponent={header} // ✅ single scroll container
          ListEmptyComponent={
            <Text
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                color: '#666',
              }}>
              No businesses yet.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardDismissMode="none" // ✅ don't auto-dismiss on tiny scrolls
          keyboardShouldPersistTaps="handled" // ✅ taps on inputs don't dismiss
          removeClippedSubviews={false} // ✅ keep inputs from being detached
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mainTitle: { fontSize: 24, fontWeight: '700' },
  form: { gap: 10 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowSubtitle: { color: '#555', marginTop: 2 },
  meta: { color: '#777', marginTop: 4 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
  smallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#64748B',
    borderRadius: 8,
  },
  smallBtnDanger: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  smallBtnText: { color: '#fff', fontWeight: '600' },
});
