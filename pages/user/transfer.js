import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, runTransaction } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "firebase-config";
import { QrReader } from "react-qr-reader";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

import Loader from "components/Loaders/circle";

// layout for page
import User from "layouts/User.js";

export default function Dashboard() {
	const router = useRouter();
	const [userData, setUserData] = useState({});

	const [amount, setAmount] = useState();
	const [myUid, setMyUid] = useState("");

	const [qrResult, setQrResult] = useState(0);
	const [showLoader, setShowLoader] = useState(false);

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

	useEffect(() => {
		if (qrResult == 0 || qrResult == -1) return;

		confirmDialogBox(qrResult, "student");
	}, [qrResult]);

	const handleVendorTransfer = () => {
		if (amount == 0 || !amount) {
			Swal.fire("Please enter the amount first!");
			return;
		}

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
		else recipientName = `${recipient}@lums.edu.pk`;

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
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Don't enter a zero or negative value!",
			});
			return;
		}

		setShowLoader(true);

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
			emailQuery = recipient + "@lums.edu.pk";
			q = query(docRef, where("email", "==", emailQuery));
		}

		getDocs(q).then(async (querySnapshot) => {
			// Check if the roll number exists in the database
			if (querySnapshot.empty) {
				Swal.fire("Couldn't find roll number");
				setShowLoader(false);
			}

			querySnapshot.forEach(async (recipientDoc, index) => {
				// To prevent loop working for multiple documents
				if (index > 1) return;

				const docId = recipientDoc.id;
				let isErr = false;

				const transactionData = await runTransaction(db, (transaction) => {
					const senderDocRef = doc(db, "users", myUid);
					const recipientDocRef = doc(db, "users", docId);

					return transaction
						.get(senderDocRef)
						.then((senderDoc) => {
							// Checks for balance
							if (senderDoc.data().balance < parseInt(amount)) {
								Swal.fire({
									icon: "error",
									title: "Oops...",
									text: "You have insufficient balance! Top up your balance in the deposit page now!",
								});
								isErr = true;
								return transaction;
							}

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
						})
						.catch((error) => {
							console.log(error.message);
							setShowLoader(false);
						});
				});

				console.log("All done successfully!");

				setUserData({
					...userData,
					balance: isErr ? userData.balance : userData.balance - amount,
				});
				setAmount(0);
				setShowLoader(false);

				if (!isErr) {
					Swal.fire({
						title: "Payment Successful",
						text: "You have successfully transferred Rs." + amount + " to " + emailQuery,
						icon: "success",
						confirmButtonText: "Cool!",
					});
				}
			});
		});
	};

	const handleManualEntry = () => {
		Swal.fire({
			title: "Manual Entry",
			text: "Enter the roll number of the student to whom you want to transfer the money",
			input: "number",
			inputLabel: "Recipient's roll number",
			inputPlaceholder: "Enter recipient's roll number",
		}).then((response) => {
			// Handle transfer
			if (response.value + "@lums.edu.pk" === userData.email) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "You can't transfer money back to your own account!",
				});
				return;
			}
			confirmDialogBox(response.value, "student");
		});
	};

	return (
		<>
			<div className="p-8 flex text-color-4 items-center flex-col justify-center">
				<h1 className="text-2xl font-bold">Transfer Money</h1>
				<div className="relative w-full mb-3">
					<p className="my-6">Available Balance: {userData.balance}</p>
					<label className="block uppercase text-color-4 text-xs font-bold mb-2" htmlFor="grid-password">
						Amount
					</label>
					<input
						type="number"
						className="border-0 px-3 py-3 placeholder-blueGray-300 text-color-2 color-5 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
						placeholder="Number"
						onChange={(e) => setAmount(e.target.value)}
						value={amount}
					/>
				</div>
				<h1 className="text-center">Now Either scan a QR code to add recipients address or add it manually</h1>
			</div>

			<div className="w-full flex flex-wrap justify-center">
				<button
					className="w-full my-2 color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
					type="button"
					onClick={handleVendorTransfer}
				>
					Pay at Restaurant (JJ)
				</button>
				<p className="text-color-3">OR</p>
				<button
					className="w-full my-2 color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
					type="button"
					onClick={() => setQrResult(-1)}
				>
					Scan QR Code
				</button>
				<p className="text-color-3">OR</p>
				<button
					className="w-full my-2 color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
					type="button"
					onClick={() => handleManualEntry()}
				>
					Enter Transfer details manually (only for student transfers)
				</button>
			</div>

			{showLoader ? <Loader /> : null}

			{qrResult != -1 ? null : (
				<div className="fixed w-full h-screen top-0 left-0 z-10 color-1">
					<div className="fixed w-full left-0">
						<div className="flex items-center flex-col justify-center">
							<h1 className="font-semibold text-color-3 my-4">Scan QR code:</h1>

							<button
								className="w-2/3 color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => setQrResult(0)}
							>
								Stop scanning
							</button>

							<QrReader
								onResult={(result, error) => {
									if (!!result) {
										setQrResult(result?.text);
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
		</>
	);
}

Dashboard.layout = User;
