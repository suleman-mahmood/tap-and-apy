import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebase-config";
import Loader from "components/Loaders/circle";

// layout for page
import User from "layouts/User.js";
import Link from "next/link";

export default function Dashboard(props) {
	const router = useRouter();
	const [userData, setUserData] = useState();

	const [showLoader, setShowLoader] = useState(false);

	useEffect(() => {
		setShowLoader(true);

		router.prefetch("/user/transfer");
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;

				const docRef = doc(db, "users", uid);
				getDoc(docRef)
					.then((docSnap) => {
						if (docSnap.exists()) {
							// console.log("Document data:", docSnap.data());
							setUserData(docSnap.data());
							setShowLoader(false);
						} else {
							// doc.data() will be undefined in this case
							console.log("No such document!");
							setShowLoader(false);
						}
					})
					.catch((err) => {
						console.log(err.message);
						setShowLoader(false);
					});
			} else {
				// User is signed out
				setShowLoader(false);
				router.push("/");
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<>
			<div className="p-8 flex flex-col items-center justify-center">
				<h1>
					<b>Profile Data</b>
				</h1>
				<h2>Name: {userData ? userData.fullName : null}</h2>
				<h2>Balance: {userData ? userData.balance : null}</h2>
				<h2>Email: {userData ? userData.email : null}</h2>
			</div>
			{showLoader ? <Loader /> : null}
			<div className="w-full flex items-center justify-center">
				<Link href="/user/transfer">
					<button
						className="w-2/3 bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
						type="button"
					>
						Transfer Now!
					</button>
				</Link>
			</div>
			{/* <div className="p-8 flex flex-col items-center justify-center">
				<h1>Advertisement Banners</h1>
				<img src="/img/banner.jpg" className="w-full h-24 bg-white border my-6" alt="..."></img>
				<img src="/img/banner.jpg" className="w-full h-24 bg-white border my-6" alt="..."></img>
				<img src="/img/banner.jpg" className="w-full h-24 bg-white border my-6" alt="..."></img>
			</div> */}
		</>
	);
}

Dashboard.layout = User;
