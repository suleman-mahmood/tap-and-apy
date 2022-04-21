import React, { useState, useEffect } from "react";

import { collection, addDoc } from "firebase/firestore";
import { db } from "firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "components/Loaders/circle";

import User from "layouts/User.js";
import { useRouter } from "next/router";

export default function Landing() {
	const [userUid, setUserUid] = useState(-1);
	const [depositAmount, setDepositAmount] = useState(0);
	const [accountTitle, setAccountTitle] = useState();
	const [comments, setComments] = useState();

	const [showLoader, setShowLoader] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in
				const uid = user.uid;
				setUserUid(uid);
			} else {
				// User is signed out
				router.push("/");
			}
		});
	}, []);

	const onSubmitDepositForm = () => {
		setShowLoader(true);

		// Add deposit data to firestore
		const docData = {
			uid: userUid,
			amount: depositAmount,
			accountTitle: accountTitle || "No Title",
			comments: comments || "No Comments",
			state: "in-progress", // approved, in-progress, declined
		};
		addDoc(collection(db, "deposit-requests"), docData)
			.then(() => {
				console.log("Added data entry successfully");
				setShowLoader(false);
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log("Error when setting up the document", errorMessage);
				setShowLoader(false);
			});
	};

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
									<h1 className="text-color-3 font-semibold text-5xl">Steps to Deposit Money</h1>
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

				<section className="pb-20 color-1 -mt-24">
					<div className="container mx-auto px-4">
						<div className="flex flex-wrap">
							<div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
								<div className="relative flex flex-col min-w-0 break-words color-1 w-full mb-8 shadow-lg rounded-lg">
									<div className="px-4 py-5 flex-auto">
										<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
											<i className="fas fa-award"></i>
										</div>
										<h6 className="text-xl text-color-2 font-semibold">First, bank transfer the deposit amount to the following details</h6>
										<p className="mt-2 mb-4 text-color-3">
											Account Title: <b>Suleman Mahmood</b>
											<br />
											Account Number: <b>01300105628521</b>
											<br />
											IBAN: <b>PK15MEZN0001300105628521</b>
											<br />
											Meezan Bank-Shamsi Society Branch - Malir <br />
										</p>
									</div>
								</div>
							</div>

							<div className="w-full md:w-4/12 px-4 text-center">
								<div className="relative flex flex-col min-w-0 break-words color-1 w-full mb-8 shadow-lg rounded-lg">
									<div className="px-4 py-5 flex-auto">
										<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
											<i className="fas fa-retweet"></i>
										</div>
										<h6 className="text-xl text-color-2 font-semibold">Complete the form below</h6>
										<p className="mt-2 mb-4 text-color-3">Lastly, complete the form below to process your request and get the deposit amount within 24 hours into your digital tap and pay wallet!</p>
									</div>
								</div>
							</div>

							<div className="pt-6 w-full md:w-4/12 px-4 text-center">
								<div className="relative flex flex-col min-w-0 break-words color-1 w-full mb-8 shadow-lg rounded-lg">
									<div className="px-4 py-5 flex-auto">
										<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
											<i className="fas fa-fingerprint"></i>
										</div>
										<h6 className="text-xl text-color-2 font-semibold">Note</h6>
										<p className="mt-2 mb-4 text-color-3">The Bank transfer deposit amount and the form amount must match exactly in order to process the request smoothly and effectively</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{showLoader ? <Loader /> : null}

				{/* Deposit Form */}
				<section className="relative block py-24 lg:pt-0 bg-blueGray-800">
					<div className="container mx-auto px-4">
						<div className="flex flex-wrap justify-center lg:mt-64 mt-48">
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
									<div className="flex-auto p-5 lg:p-10">
										<h4 className="text-2xl font-semibold text-center">Deposit Money into your wallet</h4>
										<p className="leading-relaxed mt-1 mb-4 text-blueGray-500">Complete this form and we will deposit the money within 24 hours</p>
										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												Deposit Amount
											</label>
											<input
												type="number"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Deposit Amount"
												value={depositAmount}
												onChange={(e) => setDepositAmount(e.target.value)}
											/>
										</div>

										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												Account Title (Enter the account title with which you are depositing the money)
											</label>
											<input
												type="text"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Account Title"
												value={accountTitle}
												onChange={(e) => setAccountTitle(e.target.value)}
											/>
										</div>

										<div className="relative w-full mb-3">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="message">
												Optional Comments
											</label>
											<textarea
												rows="4"
												cols="80"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
												placeholder="Leave any special comments if any..."
												value={comments}
												onChange={(e) => setComments(e.target.value)}
											/>
										</div>
										<div className="text-center mt-6">
											<button
												className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
												type="button"
												onClick={onSubmitDepositForm}
											>
												Submit Deposit Request
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

Landing.layout = User;
