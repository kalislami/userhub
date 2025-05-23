import { db } from "../config/firebaseConfig";
import { User } from "../entities/user";
import axios from "axios";

const USERS_COLLECTION = "USERS";
const apiKey = process.env.FIREBASE_API_KEY;
const baseUrl = process.env.FIREBASE_AUTH_URL;

export const getUserById = async (uid: string): Promise<User | null> => {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return { uid: doc.id, ...doc.data() } as User;
};

export const updateUserById = async (uid: string, data: Partial<User>): Promise<void> => {
  await db.collection(USERS_COLLECTION).doc(uid).set(data, { merge: true });
};

export const createUser = async (data: Partial<User>): Promise<void> => {
  await db.collection(USERS_COLLECTION).add(data);
};

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await db.collection(USERS_COLLECTION).get();
  const users: User[] = [];

  snapshot.forEach(doc => {
    users.push({ uid: doc.id, ...doc.data() } as User);
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