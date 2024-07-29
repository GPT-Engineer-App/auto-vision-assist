import { storage, db } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const fetchAndStoreDTCs = async () => {
  try {
    const storageRef = ref(storage, 'dtc_codes.csv');
    const url = await getDownloadURL(storageRef);

    const response = await fetch(url);
    const csvText = await response.text();

    const lines = csvText.split('\n');
    const dtcCollection = collection(db, 'dtcCodes');

    for (let i = 1; i < lines.length; i++) {
      const [code, description] = lines[i].split(',');
      if (code && description) {
        await addDoc(dtcCollection, {
          code: code.trim(),
          description: description.trim()
        });
      }
    }

    console.log('DTC codes stored successfully');
  } catch (error) {
    console.error('Error fetching and storing DTC codes:', error);
  }
};

export const getDTCCodes = async () => {
  try {
    const dtcCollection = collection(db, 'dtcCodes');
    const snapshot = await getDocs(dtcCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching DTC codes:', error);
    return [];
  }
};

export const searchDTCCodes = async (searchTerm) => {
  try {
    const dtcCollection = collection(db, 'dtcCodes');
    const q = query(
      dtcCollection,
      where('code', '>=', searchTerm),
      where('code', '<=', searchTerm + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error searching DTC codes:', error);
    return [];
  }
};