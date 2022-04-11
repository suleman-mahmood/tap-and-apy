import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, runTransaction } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "firebase-config";
import { QrReader } from "react-qr-reader";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

// layout for page
import User from "layouts/User.js";

export default function Dashboard() {
	const router = useRouter();
	const [userData, setUserData] = useState({});

	const [rollNumber, setRollNumber] = useState("");
	const [amount, setAmount] = useState(0);
	const [myUid, setMyUid] = useState("");

	const [qrResult, setQrResult] = useState(-1);

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				setMyUid(uid);

				const docRef = doc(db, "users", uid);
				getDoc(docRef).then((docSnap) => {
					if (docSnap.exists()) {
						console.log("Document data:", docSnap.data());
						setUserData(docSnap.data());
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				});
			} else {
				// User is signed out
				router.push("/");
			}
		});
	}, []);

	const handleTransfer = async () => {
		if (amount <= 0) {
			console.log("Don't enter a negative value");
			return;
		}

		const docRef = collection(db, "users");
		const emailQuery = rollNumber + "@lums.edu.pk";
		const q = query(docRef, where("email", "==", emailQuery));

		getDocs(q).then(async (querySnapshot) => {
			// Check if the roll number exists in the database
			if (querySnapshot.empty) {
				console.log("Couldn't find roll number");
			}

			querySnapshot.forEach(async (recipientDoc, index) => {
				// To prevent loop working for multiple documents
				if (index > 1) return;

				const docId = recipientDoc.id;

				const transactionData = await runTransaction(db, (transaction) => {
					const senderDocRef = doc(db, "users", myUid);
					const recipientDocRef = doc(db, "users", docId);

					return transaction.get(senderDocRef).then((senderDoc) => {
						// Update my doc (sender)
						transaction.update(senderDocRef, {
							balance: senderDoc.data().balance - parseInt(amount),
						});
						// Update recipient's doc
						transaction.update(recipientDocRef, {
							balance: recipientDoc.data().balance + parseInt(amount),
						});
						// Enter a new log in transaction
						const newUid = uuidv4();
						const transactionDocRef = doc(db, "transactions", newUid);
						const transactionData = {
							sender: myUid,
							recipient: docId,
							senderName: senderDoc.data().fullName,
							recipientName: recipientDoc.data().fullName,
							senderEmail: senderDoc.data().email,
							recipientEmail: recipientDoc.data().email,
							amount: amount,
							timestamp: Date.now(),
						};
						transaction.set(transactionDocRef, transactionData);

						return transaction;
					});
				});

				console.log("All done successfully!");

				setUserData({
					...userData,
					balance: userData.balance - amount,
				});
				setAmount(0);
				setRollNumber(0);

				Swal.fire({
					title: "Payment Successful",
					text: "You have successfully transferred Rs." + amount + " to " + rollNumber,
					icon: "success",
					confirmButtonText: "Cool",
				});
			});
		});
	};

	return (
		<>
			<div className="p-8 flex items-center flex-col justify-center">
				<h1 className="text-2xl font-bold">Transfer Money</h1>
				<div className="relative w-full mb-3">
					<p className="my-6">Available Balance: {userData.balance}</p>
					<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
						Amount
					</label>
					<input
						type="number"
						className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
						placeholder="Number"
						onChange={(e) => setAmount(e.target.value)}
						value={amount}
					/>
				</div>
				<h1 className="text-center">Now Either scan a QR code to add recipients address or add it manually</h1>
			</div>

			{qrResult != -1 ? (
				<></>
			) : (
				<div className="flex items-center flex-col justify-center">
					<h1 className="font-semibold">Scan QR code:</h1>

					<QrReader
						onResult={(result, error) => {
							if (!!result) {
								setQrResult(result?.text);
								setRollNumber(result?.text);
							}

							if (!!error) {
								console.info(error);
							}
						}}
						className="w-full"
						constraints={{
							facingMode: "environment",
						}}
					/>
				</div>
			)}

			<div className="flex items-center flex-col justify-center">
				<h1 className="my-6 font-semibold">Or enter details Manually:</h1>
				<form>
					<div className="relative w-full mb-3">
						<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
							Receivers Roll Number / Vendor's Address
						</label>
						<input
							type="text"
							className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
							placeholder="RollNumber"
							value={rollNumber}
							onChange={(e) => setRollNumber(e.target.value)}
						/>
					</div>

					<div className="text-center mt-6">
						<button
							className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
							type="button"
							onClick={handleTransfer}
						>
							Transfer
						</button>
					</div>
				</form>
			</div>
		</>
	);
}

Dashboard.layout = User;
