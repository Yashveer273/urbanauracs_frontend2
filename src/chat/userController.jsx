import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebaseCon";

export const createUser = async (_id, mobileNumber, username, location) => {
  await setDoc(doc(firestore, "testusers", _id), {
    mobileNumber,
    username,
    location,
    created: serverTimestamp(),
  });
};