import { useEffect } from "react";
import { db } from "../Firebase";
import { collection, addDoc } from "firebase/firestore";

const Test = () => {
//   useEffect(() => {
//     const runTest = async () => {
//       try {
//         await addDoc(collection(db, "test"), {
//           message: "Firebase connected!",
//           createdAt: new Date(),
//         });
//         console.log("✓ Firebase test data added successfully!");
//       } catch (error) {
//         console.error("✗ Firebase connection failed:", error);
//       }
//     };

//     runTest();
//   }, []);

  return <p>Testing Firebase connection...</p>;
};

export default Test;
