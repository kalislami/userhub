import { updateUser } from '@/apis/userApi';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, onDisconnect, onValue, ref, serverTimestamp, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
};

const app = initializeApp(firebaseConfig);

const mathRandom = (min: number, max: number): number => {
    const isInteger = Number.isInteger(min) && Number.isInteger(max);
    const result = Math.random() * (max - min) + min;
    return isInteger ? Math.floor(result) : parseFloat(result.toFixed(1));
}


export const auth = getAuth(app);
export const db = getDatabase(app);

export const userLogin = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    await updateUser(token, uid, {
        status: "online",
        recentlyActive: Math.floor(Date.now() / 1000)
    });
    return { token, uid };
};

export const userRegister = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    await updateUser(token, uid, {
        uid,
        email,
        name,
        status: "online",
        totalAverageWeightRatings: mathRandom(1.01, 4.9),
        numberOfRents: mathRandom(1, 50),
        recentlyActive: Math.floor(Date.now() / 1000)
    });
    return { token, uid };
};

export const userLogout = async (uid: string) => {
    if (uid === '') return;

    await signOut(auth);

    const statusRef = ref(db, `status/${uid}`);
    set(statusRef, {
        state: "offline",
        last_changed: serverTimestamp(),
    });
}

export const setUserPresence = ({ uid }: { token: string; uid: string }) => {
    const userStatusRef = ref(db, `status/${uid}`);
    const connectedRef = ref(db, ".info/connected");

    onValue(connectedRef, (snap) => {
        const isConnected = snap.val();

        if (!isConnected) return;

        onDisconnect(userStatusRef).set({
            state: "offline",
            last_changed: serverTimestamp(),
        })

        set(userStatusRef, {
            state: "online",
            last_changed: serverTimestamp(),
        });
    });

    // Opsional: Sync semua status ke server
    // const statusRef = ref(db, "status");
    // onValue(statusRef, (snapshot) => {
    //     const allStatus = snapshot.val();
    //     if (!allStatus) return;

    // const recentlyActive = Math.floor(Date.now() / 1000);

    //     Object.entries(allStatus).forEach(([userId, statusData]) => {
    //         const { state } = statusData as { state: string };
    //         axios.post(`${API_BASE_URL}/update-user-status`, {
    //             token,
    //             uid: userId,
    //             status: state,
    //             recentlyActive,
    //         }).catch(console.error);
    //     });
    // });
};