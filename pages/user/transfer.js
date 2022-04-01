import React, {useEffect} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";


// layout for page
import User from "layouts/User.js";

export default function Dashboard() {

  const router = useRouter()

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in");
      } else {
        // User is signed out
        router.push("/")
      }
    });
  }, [])
  

  return (
    <>
      <div className="p-8 flex items-center justify-center">
        <h1>Transfer Money</h1>
      </div>
    </>
  );
}

Dashboard.layout = User;
