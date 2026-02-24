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
} from "firebase/firestore";
import { firestore } from "../firebaseCon";

const ADMIN_ID = "admin_1";

/* SEND ADMIN MESSAGE */
export const sendAdminMessage = async (chatId, text) => {
  if (!chatId) {
    console.warn("sendAdminMessage called without chatId");
    return;
  }
  const chatRef = doc(firestore, "chats", chatId);

  await setDoc(
    chatRef,
    {
      participants: {
        adminId: ADMIN_ID,
        userId: chatId.split("_")[0],
      },
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      typing: { admin: false, user: false },
    },
    { merge: true }
  );

  const messageRef = collection(firestore, "chats", chatId, "messages");

  await addDoc(messageRef, {
    senderId: ADMIN_ID,
    senderRole: "admin",
    text,
    seen: false,
    deleted: false,
    createdAt: serverTimestamp(),
  });
};

/* MARK USER MESSAGES AS SEEN (ADMIN SIDE) */
export const markSeenByAdmin = async (chatId) => {
  const messagesRef = collection(firestore, "chats", chatId, "messages");

  const q = query(messagesRef, where("senderRole", "==", "user"));

  const snapshot = await getDocs(q);

  snapshot.forEach(async (docSnap) => {
    await updateDoc(docSnap.ref, { seen: true });
  });
};

/* ADMIN DELETE MESSAGE */
export const deleteMessageByAdmin = async (chatId, messageId) => {
  const messageRef = doc(
    firestore,
    "chats",
    chatId,
    "messages",
    messageId
  );

  await updateDoc(messageRef, {
    deleted: true,
    text: "Message deleted by company",
  });
};

/* ADMIN TYPING */
export const setAdminTyping = async (chatId, status) => {
  if (!chatId) return;
  await updateDoc(doc(firestore, "chats", chatId), {
    "typing.admin": status,
  });
};

/* USER TYPING - for admin to detect */
export const setUserTyping = async (chatId, status) => {
  if (!chatId) return;
  await updateDoc(doc(firestore, "chats", chatId), {
    "typing.user": status,
  });
};

/* ------------------------------------ */
/* ADMIN ACTIVE TIMESTAMP */
/* ------------------------------------ */
export const setAdminActive = async (chatId) => {
  try {
    if (!chatId) return;
    await setDoc(
      doc(firestore, "chats", chatId),
      {
        lastActive: {
          admin: serverTimestamp(),
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error("setAdminActive Error:", error);
  }
};