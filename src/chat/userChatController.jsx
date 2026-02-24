import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";

const ADMIN_ID = "admin_1";

/* ------------------------------------ */
/* GET CHAT ID */
/* ------------------------------------ */
const getChatRef = (userId) => {
  const chatId = `${userId}_${ADMIN_ID}`;
  return doc(firestore, "chats", chatId);
};

/* ------------------------------------ */
/* SEND USER MESSAGE */
/* ------------------------------------ */
export const sendUserMessage = async (userId, text) => {
  if (!userId || !text) return;

  try {
    const chatRef = getChatRef(userId);
    const chatSnap = await getDoc(chatRef);

    // Create chat document if not exists
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: {
          adminId: ADMIN_ID,
          userId,
        },
        createdAt: serverTimestamp(),
      });
    }

    // Update last message + typing reset
    await setDoc(
      chatRef,
      {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        "typing.user": false,
      },
      { merge: true }
    );

    // Add message
    const messageRef = collection(firestore, "chats", chatRef.id, "messages");

    await addDoc(messageRef, {
      senderId: userId,
      senderRole: "user",
      text,
      seen: false,
      deleted: false,
      createdAt: serverTimestamp(),
    });

  } catch (error) {
    console.error("Send User Message Error:", error);
  }
};

/* ------------------------------------ */
/* MARK ADMIN MESSAGES AS SEEN */
/* ------------------------------------ */
export const markSeenByUser = async (userId) => {
  try {
    const chatRef = getChatRef(userId);
    const messagesRef = collection(firestore, "chats", chatRef.id, "messages");

    const q = query(messagesRef, where("senderRole", "==", "admin"));
    const snapshot = await getDocs(q);

    snapshot.forEach(async (docSnap) => {
      if (!docSnap.data().seen) {
        await updateDoc(docSnap.ref, { seen: true });
      }
    });

  } catch (error) {
    console.error("Mark Seen Error:", error);
  }
};

/* ------------------------------------ */
/* USER TYPING STATUS */
/* ------------------------------------ */
export const setUserTyping = async (userId, status) => {
  try {
    const chatRef = getChatRef(userId);

    await setDoc(
      chatRef,
      {
        "typing.user": status,
      },
      { merge: true }
    );

  } catch (error) {
    console.error("Typing Error:", error);
  }
};

/* ------------------------------------ */
/* USER ACTIVE TIMESTAMP */
/* ------------------------------------ */
export const setUserActive = async (userId) => {
  try {
    if (!userId) return;
    const chatRef = getChatRef(userId);
    await setDoc(
      chatRef,
      {
        lastActive: {
          user: serverTimestamp(),
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error("setUserActive Error:", error);
  }
};