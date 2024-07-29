import { db } from './firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { dtcCodes } from './dtc-codes';

export const fetchAndStoreDTCs = async () => {
  try {
    const dtcCollection = collection(db, 'dtcCodes');
    const snapshot = await getDocs(dtcCollection);

    if (snapshot.empty) {
      console.log('No DTC codes found in Firestore. Adding initial data...');
      for (const dtc of dtcCodes) {
        await addDoc(dtcCollection, dtc);
      }
      console.log('Initial DTC codes added to Firestore.');
    } else {
      console.log('DTC codes already exist in Firestore.');
    }
  } catch (error) {
    console.error('Error fetching or storing DTC codes:', error);
  }
};

export const searchDTCCodes = async (searchTerm) => {
  try {
    const dtcCollection = collection(db, 'dtcCodes');
    const q = query(
      dtcCollection,
      where('code', '>=', searchTerm.toUpperCase()),
      where('code', '<=', searchTerm.toUpperCase() + '\uf8ff')
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No matching DTC codes found');
      return null;
    }

    const results = snapshot.docs.map(doc => doc.data());
    return results[0]; // Return the first matching result
  } catch (error) {
    console.error('Error searching DTC codes:', error);
    return null;
  }
};