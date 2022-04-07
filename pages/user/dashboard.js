import React, {useEffect, useState} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import {db} from "firebase-config";

// layout for page
import User from "layouts/User.js";

export default function Dashboard() {

  const router = useRouter()
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        const docRef = doc(db, "users", uid);
        getDoc(docRef)
        .then(docSnap => {
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUserData(docSnap.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })

      } else {
        // User is signed out
        router.push("/")
      }
    });
  }, [])
  

  return (
    <>
      <div className="p-8 flex flex-col items-center justify-center">
        <h1>Profile Data</h1>
        <h2>Name: {userData.fullName}</h2>
        <h2>Balance: {userData.balance}</h2>
        <h2>Email: {userData.email}</h2>
      </div>
      <div className="p-8 flex flex-col items-center justify-center">
        <h1>Advertisement Banners</h1>
        <img
          src="/img/banner.jpg"
          className="w-full h-24 bg-white border my-6"
          alt="..."
        ></img>
        <img
          src="/img/banner.jpg"
          className="w-full h-24 bg-white border my-6"
          alt="..."
        ></img>
        <img
          src="/img/banner.jpg"
          className="w-full h-24 bg-white border my-6"
          alt="..."
        ></img>
      </div>
    </>
  );
}

Dashboard.layout = User;
