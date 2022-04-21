import React, { useState, useEffect } from "react";

import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import User from "layouts/User.js";
import { useRouter } from "next/router";

import Loader from "components/Loaders/circle";

export default function Landing() {
	const router = useRouter();

	const [userUid, setUserUid] = useState(-1);
	const [transactionsDebitList, setTransactionsDebitList] = useState([]);
	const [transactionsCreditList, setTransactionsCreditList] = useState([]);
	const [transactionId, setTransactionId] = useState([]);
	const [showDebit, setShowDebit] = useState(true);

	const [showLoader, setShowLoader] = useState(false);

	useEffect(() => {
		setShowLoader(true);
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in
				const uid = user.uid;
				setUserUid(uid);

				const docRef = collection(db, "transactions");
				const q1 = query(docRef, where("sender", "==", uid));

				// TODO: add q2 implementation
				const q2 = query(docRef, where("recipient", "==", uid));

				onSnapshot(q1, (querySnapshot) => {
					if (querySnapshot.empty) {
						console.log("No transactions found!");
						setShowLoader(false);
					}

					const oldList = [];

					querySnapshot.forEach((eachQueryDoc) => {
						let data = eachQueryDoc.data();
						let someDate = data.timestamp;

						let date = new Date(someDate);
						date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " on " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

						data = {
							...data,
							timestamp: date,
							unixTimestamp: someDate,
							docId: eachQueryDoc.id.substr(0, 8),
						};
						oldList.push(data);
					});

					oldList.sort((a, b) => b.unixTimestamp - a.unixTimestamp);

					setTransactionsDebitList(oldList);
					setShowLoader(false);
				});

				onSnapshot(q2, (querySnapshot) => {
					if (querySnapshot.empty) {
						console.log("No transactions found!");
						setShowLoader(false);
					}

					const oldList = [];

					querySnapshot.forEach((eachQueryDoc) => {
						let data = eachQueryDoc.data();
						let someDate = data.timestamp;

						let date = new Date(someDate);
						date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " on " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

						data = {
							...data,
							timestamp: date,
							unixTimestamp: someDate,
							docId: eachQueryDoc.id.substr(0, 8),
						};
						oldList.push(data);
					});

					oldList.sort((a, b) => b.unixTimestamp - a.unixTimestamp);

					setTransactionsCreditList(oldList);
					setShowLoader(false);
				});
			} else {
				// User is signed out
				setShowLoader(false);
				router.push("/");
			}
		});
	}, []);

	return (
		<>
			<main>
				{/* Steps to deposit */}
				<div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-25">
					<div
						className="absolute top-0 w-full h-full bg-center bg-cover"
						style={{
							backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80')",
						}}
					>
						<span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-black"></span>
					</div>
					<div className="container relative mx-auto">
						<div className="items-center flex flex-wrap">
							<div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
								<div className="pr-12">
									<h1 className="text-color-3 font-semibold text-5xl">Transactions</h1>
								</div>
							</div>
						</div>
					</div>
					<div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16" style={{ transform: "translateZ(0)" }}>
						<svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
							<polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
						</svg>
					</div>
				</div>
				{showLoader ? <Loader /> : null}
				<div className="flex w-full text-center">
					<div className="w-1/2">
						<button
							className={
								"w-full active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" +
								(showDebit ? " text-color-1 color-2" : " text-color-4")
							}
							type="button"
							onClick={() => setShowDebit(true)}
						>
							Debit
						</button>
					</div>
					<div className="w-1/2">
						<button
							className={
								"w-full active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" +
								(!showDebit ? " text-color-1 color-2" : " text-color-4")
							}
							type="button"
							onClick={() => setShowDebit(false)}
						>
							Credit
						</button>
					</div>
				</div>

				<hr className="border-b-2 mb-24 border-blueGray-600" />

				{showDebit
					? transactionsDebitList.map((trans, i) => {
							return (
								<section key={i} className="pb-20 color-1 -mt-24">
									<div className="container mx-auto px-4">
										<div className="flex flex-wrap">
											<div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
												<div className="relative flex flex-col min-w-0 break-words color-1 w-full mb-8 shadow-lg rounded-lg">
													<div className="px-4 py-5 flex-auto">
														<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full color-5">
															<i className="fas fa-arrow-up"></i>
														</div>
														<h6 className="text-xl font-semibold text-color-2">
															Transaction ID: <b>{trans.docId}</b>
														</h6>
														<p className="mt-2 mb-4 text-color-3">
															Transaction Amount: <b>{trans.amount}</b>
															<br />
															Recipient Email: <b>{trans.recipientEmail}</b>
															<br />
															Recipient Name: <b>{trans.recipientName}</b>
															<br />
															Timestamp: <b>{trans.timestamp}</b>
															<br />
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>
							);
					  })
					: transactionsCreditList.map((trans, i) => {
							return (
								<section key={i} className="pb-20 color-1 -mt-24">
									<div className="container mx-auto px-4">
										<div className="flex flex-wrap">
											<div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
												<div className="relative flex flex-col min-w-0 break-words color-1 w-full mb-8 shadow-lg rounded-lg">
													<div className="px-4 py-5 flex-auto">
														<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full color-5">
															<i className="fas fa-arrow-up"></i>
														</div>
														<h6 className="text-xl font-semibold text-color-2">
															Transaction ID: <b>{trans.docId}</b>
														</h6>
														<p className="mt-2 mb-4 text-color-3">
															Transaction Amount: <b>{trans.amount}</b>
															<br />
															Sender Email: <b>{trans.senderEmail}</b>
															<br />
															Sender Name: <b>{trans.senderName}</b>
															<br />
															Timestamp: <b>{trans.timestamp}</b>
															<br />
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>
							);
					  })}
			</main>
		</>
	);
}

Landing.layout = User;
