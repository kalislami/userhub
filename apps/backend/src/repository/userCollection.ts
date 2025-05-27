import axios from "axios";
import { db, rtdb } from "../config/firebaseConfig";
import { User } from "../types/user";

const USERS_COLLECTION = "USERS";
const apiKey = process.env.FIREBASE_API_KEY;
const baseUrl = process.env.FIREBASE_AUTH_URL;

const getUserStatusFromRTDB = async () => {
  const snapshot = await rtdb.ref(`status`).once('value');
  const data = snapshot.val();
  return data;
};

function normalizeRecencyScore(recentlyActiveEpochMs: number): number {
  const maxRecencyThreshold = 30; //max: 30 days
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;

  const daysSinceLastActive = (now - recentlyActiveEpochMs) / msPerDay;
  const normalizedRecency = 1 - (daysSinceLastActive / maxRecencyThreshold);

  return normalizedRecency < 0 ? 0 : normalizedRecency;
}

const updateCompositeScore = async (uid: string) => {
  const userData = await getUserById(uid);

  if (!userData) console.log(`failed update score for uid: ${uid}`);

  console.log(`updating score for user: ${userData?.name}`);

  const rating = userData?.totalAverageWeightRatings ?? 0;
  const rent = userData?.numberOfRents ?? 0;
  const active = userData?.recentlyActive ?? 0;

  const normalizedRating = rating > 0 ? (rating - 1) / (5 - 1) : 0; //min: 1, max: 5
  const normalizedRents = rent / 50; // max: 5
  const normalizedRecency = active > 0 ? normalizeRecencyScore(active) : 0;

  // set weight
  const scoreRating = normalizedRating * 0.6
  const scoreRents = normalizedRents * 0.3
  const scoreRecency = normalizedRecency * 0.1

  const compositeScore = scoreRating + scoreRents + scoreRecency;

  await db.collection(USERS_COLLECTION).doc(uid).set({ compositeScore }, { merge: true });
  console.log(`done update score for user: ${userData?.name}`);
}

export const getUserById = async (uid: string): Promise<User | null> => {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as User;
};

export const updateUserById = async (uid: string, data: Partial<User>): Promise<void> => {
  await db.collection(USERS_COLLECTION).doc(uid).set(data, { merge: true });
  await updateCompositeScore(uid);
};

export const createUser = async (data: Partial<User>): Promise<void> => {
  await db.collection(USERS_COLLECTION).add(data);
};

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await db.collection(USERS_COLLECTION).orderBy('compositeScore', 'desc').get();
  const users: User[] = [];

  const rtdbData = await getUserStatusFromRTDB();

  snapshot.forEach(doc => {
    const status = rtdbData[doc.data().uid]?.state ?? doc.data().status;
    users.push({ ...doc.data(), status } as User);
  });

  return users;
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${baseUrl}/accounts:signInWithPassword?key=${apiKey}`, {
      email: data.email,
      password: data.password,
      returnSecureToken: true,
    });

    const {
      idToken,
      refreshToken,
      expiresIn,
    } = response.data;

    return { token: idToken, refreshToken, expiresIn };
  } catch (error: any) {
    if ([400, 404].includes(error.status))
      return await register(data);

    console.log('error login: ', error.message ?? error);
    throw Error('invalid email or password')
  }
};

const register = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${baseUrl}/accounts:signUp?key=${apiKey}`, {
    email: data.email,
    password: data.password,
    returnSecureToken: true,
  });

  const {
    idToken,
    refreshToken,
    expiresIn,
  } = response.data;

  if (!idToken) throw Error('register failed')

  return { token: idToken, refreshToken, expiresIn };
};