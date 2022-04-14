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

	const [qrResult, setQrResult] = useState(0);

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

	// const handleTransfer = async () => {
	// 	if (amount <= 0) {
	// 		console.log("Don't enter a negative value");
	// 		return;
	// 	}

	// 	const docRef = collection(db, "users");
	// 	const emailQuery = rollNumber + "@lums.edu.pk";
	// 	const q = query(docRef, where("email", "==", emailQuery));

	// 	getDocs(q).then(async (querySnapshot) => {
	// 		// Check if the roll number exists in the database
	// 		if (querySnapshot.empty) {
	// 			console.log("Couldn't find roll number");
	// 		}

	// 		querySnapshot.forEach(async (recipientDoc, index) => {
	// 			// To prevent loop working for multiple documents
	// 			if (index > 1) return;

	// 			const docId = recipientDoc.id;

	// 			const transactionData = await runTransaction(db, (transaction) => {
	// 				const senderDocRef = doc(db, "users", myUid);
	// 				const recipientDocRef = doc(db, "users", docId);

	// 				return transaction.get(senderDocRef).then((senderDoc) => {
	// 					// Update my doc (sender)
	// 					transaction.update(senderDocRef, {
	// 						balance: senderDoc.data().balance - parseInt(amount),
	// 					});
	// 					// Update recipient's doc
	// 					transaction.update(recipientDocRef, {
	// 						balance: recipientDoc.data().balance + parseInt(amount),
	// 					});
	// 					// Enter a new log in transaction
	// 					const newUid = uuidv4();
	// 					const transactionDocRef = doc(db, "transactions", newUid);
	// 					const transactionData = {
	// 						sender: myUid,
	// 						recipient: docId,
	// 						senderName: senderDoc.data().fullName,
	// 						recipientName: recipientDoc.data().fullName,
	// 						senderEmail: senderDoc.data().email,
	// 						recipientEmail: recipientDoc.data().email,
	// 						amount: amount,
	// 						timestamp: Date.now(),
	// 					};
	// 					transaction.set(transactionDocRef, transactionData);

	// 					return transaction;
	// 				});
	// 			});

	// 			console.log("All done successfully!");

	// 			setUserData({
	// 				...userData,
	// 				balance: userData.balance - amount,
	// 			});
	// 			setAmount(0);
	// 			setRollNumber(0);

	// 			Swal.fire({
	// 				title: "Payment Successful",
	// 				text: "You have successfully transferred Rs." + amount + " to " + rollNumber,
	// 				icon: "success",
	// 				confirmButtonText: "Cool",
	// 			});
	// 		});
	// 	});
	// };

	// const handleJamminTransfer = async () => {
	// 	if (amount <= 0) {
	// 		console.log("Don't enter a negative value");
	// 		return;
	// 	}

	// 	const docRef = collection(db, "users");
	// 	const emailQuery = "admin@jjkitchen.com";
	// 	const q = query(docRef, where("email", "==", emailQuery));

	// 	getDocs(q).then(async (querySnapshot) => {
	// 		// Check if the roll number exists in the database
	// 		if (querySnapshot.empty) {
	// 			console.log("Couldn't find roll number");
	// 		}

	// 		querySnapshot.forEach(async (recipientDoc, index) => {
	// 			// To prevent loop working for multiple documents
	// 			if (index > 1) return;

	// 			const docId = recipientDoc.id;

	// 			const transactionData = await runTransaction(db, (transaction) => {
	// 				const senderDocRef = doc(db, "users", myUid);
	// 				const recipientDocRef = doc(db, "users", docId);

	// 				return transaction.get(senderDocRef).then((senderDoc) => {
	// 					// Update my doc (sender)
	// 					transaction.update(senderDocRef, {
	// 						balance: senderDoc.data().balance - parseInt(amount),
	// 					});
	// 					// Update recipient's doc
	// 					transaction.update(recipientDocRef, {
	// 						balance: recipientDoc.data().balance + parseInt(amount),
	// 					});
	// 					// Enter a new log in transaction
	// 					const newUid = uuidv4();
	// 					const transactionDocRef = doc(db, "transactions", newUid);
	// 					const transactionData = {
	// 						sender: myUid,
	// 						recipient: docId,
	// 						senderName: senderDoc.data().fullName,
	// 						recipientName: recipientDoc.data().fullName,
	// 						senderEmail: senderDoc.data().email,
	// 						recipientEmail: recipientDoc.data().email,
	// 						amount: amount,
	// 						timestamp: Date.now(),
	// 					};
	// 					transaction.set(transactionDocRef, transactionData);

	// 					return transaction;
	// 				});
	// 			});

	// 			console.log("All done successfully!");

	// 			setUserData({
	// 				...userData,
	// 				balance: userData.balance - amount,
	// 			});
	// 			setAmount(0);
	// 			setRollNumber(0);

	// 			Swal.fire({
	// 				title: "Payment Successful",
	// 				text: "You have successfully transferred Rs." + amount + " to " + rollNumber,
	// 				icon: "success",
	// 				confirmButtonText: "Cool",
	// 			});
	// 		});
	// 	});
	// };

	const handleVendorTransfer = () => {
		Swal.fire({
			title: "Select the vendor",
			input: "select",
			inputOptions: {
				jj: "JJ Kitchen",
				bunkers: "Bunkers",
				pdc: "PDC",
				baradari: "Baradari",
			},
			inputPlaceholder: "Vendor",
			showCancelButton: true,
			inputValidator: (value) => {
				return new Promise((resolve) => {
					if (value !== "") {
						resolve();
					} else {
						resolve("You need to select a vendor!");
					}
				});
			},
		}).then((response) => {
			console.log(response);

			if (response.isDismissed) {
				Swal.fire(`You cancelled the transaction`);
			}

			if (response.isConfirmed) {
				// Show confirm dialogue box with the amount and vendor details
				confirmDialogBox(response.value, "vendor");
			}
		});
	};

	const confirmDialogBox = (recipient, type) => {
		let recipientName = "";

		if (recipient === "jj") recipientName = "JJ Kitchen";
		else if (recipient === "bunkers") recipientName = "Bunkers";
		else if (recipient === "pdc") recipientName = "PDC";
		else if (recipient === "baradari") recipientName = "Baradari";

		Swal.fire({
			title: "Confirm the following transaction?",
			text: `You want to transfer Rs.${amount} to ${recipientName}`,
			showCancelButton: true,
			confirmButtonText: "Yes, Transfer!",
			denyButtonText: `Cancel :(`,
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				// Handle confirm transaction
				handleTransferConfirm(recipient, type);
			} else {
				Swal.fire(`You cancelled the transaction`);
			}
		});
	};

	const handleTransferConfirm = async (recipient, type) => {
		if (amount <= 0) {
			console.log("Don't enter a zero or negative value");
			return;
		}

		const docRef = collection(db, "users");
		let q = "";

		// The type is either vendor or customer
		let emailQuery = "";

		if (type === "vendor") {
			if (recipient === "jj") emailQuery = "admin@jjkitchen.com";
			else if (recipient === "bunkers") emailQuery = "admin@bunkers.com";
			else if (recipient === "pdc") emailQuery = "admin@pdc.com";
			else if (recipient === "baradari") emailQuery = "admin@baradari.com";

			q = query(docRef, where("email", "==", emailQuery));
		} else {
			emailQuery = rollNumber + "@lums.edu.pk";
			q = query(docRef, where("email", "==", emailQuery));
		}

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
				// setRollNumber(0);

				Swal.fire({
					title: "Payment Successful",
					text: "You have successfully transferred Rs." + amount + " to " + emailQuery,
					icon: "success",
					confirmButtonText: "Cool!",
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

			<div className="w-full flex flex-wrap justify-center">
				<button
					className="w-1/3 bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
					type="button"
					onClick={handleVendorTransfer}
				>
					Pay at Vendor
				</button>
				<button
					className="w-1/3 bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
					type="button"
					onClick={() => setQrResult(-1)}
				>
					Scan QR Code
				</button>
				<button
					className="w-1/3 bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
					type="button"
				>
					Enter Transfer details manually (only for student transfers)
				</button>
			</div>

			{qrResult != -1 ? null : (
				<div className="fixed w-full h-screen top-0 left-0 z-10 bg-blueGray-600">
					<div className="fixed w-full left-0">
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
					</div>
				</div>
			)}

			{/* <div className="flex items-center flex-col justify-center">
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
							// onClick={handleTransfer}
						>
							Transfer
						</button>
					</div>
				</form>
			</div> */}
		</>
	);
}

Dashboard.layout = User;
