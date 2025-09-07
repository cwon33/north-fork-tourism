// app/(authenticated)/BusinessAdminScreen.tsx (or wherever you want)
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
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../FirebaseConfig'; // keep your existing import

type LatLng = { lat: number; lng: number };
type Business = {
  id?: string;
  name: string;
  briefDesc?: string;
  logoUrl?: string;
  photos?: string[];
  fullDesc?: string;
  promotions?: string[];
  website?: string;
  location?: LatLng;
  contact?: {
    phone?: string;
    email?: string;
    social?: { instagram?: string; facebook?: string; tiktok?: string };
  };
  categories?: string[];
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
};

const parseCsv = (raw: string) =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
const num = (s?: string) => (s && isFinite(+s) ? +s : undefined);

export default function BusinessAdminScreen() {
  const businessesRef = useMemo(() => collection(db, 'businesses'), []);
  const [items, setItems] = useState<Business[]>([]);
  const [name, setName] = useState('');
  const [briefDesc, setBriefDesc] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [categories, setCategories] = useState(''); // CSV in UI
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');

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
    await addDoc(businessesRef, {
      name: name.trim(),
      briefDesc: briefDesc.trim() || '',
      logoUrl: logoUrl.trim() || '',
      website: website.trim() || '',
      categories: parseCsv(categories),
      location:
        num(lat) !== undefined && num(lng) !== undefined
          ? { lat: num(lat), lng: num(lng) }
          : null,
      contact: {
        phone: phone.trim() || undefined,
        social: { instagram: instagram.trim() || undefined },
      },
      isActive: true,
      photos: [],
      promotions: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as Business);
    // reset inputs
    setName('');
    setBriefDesc('');
    setLogoUrl('');
    setWebsite('');
    setCategories('');
    setLat('');
    setLng('');
    setPhone('');
    setInstagram('');
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
    });
    fetchBusinesses();
  };

  const removeBusiness = async (id: string) => {
    await deleteDoc(doc(db, 'businesses', id));
    fetchBusinesses();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Businesses (Admin)</Text>

        {/* Create form – keep simple for now */}
        <View style={styles.form}>
          <TextInput
            placeholder="Name *"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Brief description"
            value={briefDesc}
            onChangeText={setBriefDesc}
            style={styles.input}
          />
          <TextInput
            placeholder="Logo URL"
            value={logoUrl}
            onChangeText={setLogoUrl}
            style={styles.input}
          />
          <TextInput
            placeholder="Website"
            value={website}
            onChangeText={setWebsite}
            style={styles.input}
          />
          <TextInput
            placeholder="Categories (csv)"
            value={categories}
            onChangeText={setCategories}
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
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <TextInput
            placeholder="Instagram"
            value={instagram}
            onChangeText={setInstagram}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addBusiness}>
            <Text style={styles.buttonText}>Add Business</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(b) => b.id!}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                {!!item.briefDesc && (
                  <Text style={styles.rowSubtitle}>{item.briefDesc}</Text>
                )}
                <Text style={styles.meta}>
                  {item.isActive ? 'Active' : 'Inactive'} •{' '}
                  {item.website || 'no site'}
                </Text>

                {/* Quick inline edit for briefDesc */}
                <TextInput
                  placeholder="Edit brief description"
                  defaultValue={item.briefDesc}
                  onEndEditing={(e) =>
                    updateField(item.id!, { briefDesc: e.nativeEvent.text })
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
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  mainTitle: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  form: { gap: 10, marginBottom: 12 },
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
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowSubtitle: { color: '#555' },
  meta: { color: '#777', marginTop: 4 },
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
