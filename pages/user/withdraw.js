import React, { useState, useEffect } from "react";

import { collection, addDoc } from "firebase/firestore";
import { db } from "firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "components/Loaders/circle";

import User from "layouts/User.js";
import { useRouter } from "next/router";

export default function Landing() {
	const [userUid, setUserUid] = useState(-1);

	const [withdrawAmount, setWithdrawAmount] = useState(0);
	const [accountTitle, setAccountTitle] = useState();
	const [accountNumber, setAccountNumber] = useState();
	const [branchCode, setBranchCode] = useState();
	const [iban, setIban] = useState();
	const [comments, setComments] = useState();

	const [showLoader, setShowLoader] = useState(false);
	const router = useRouter();

	// Some comment

	useEffect(() => {
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in
				const uid = user.uid;
				setUserUid(uid);
			} else {
				// User is signed out
				router.push("/");
			}
		});

		return () => unsubscribe();
	}, []);

	const onSubmitWithdrawForm = () => {
		setShowLoader(true);

		// Add deposit data to firestore
		const docData = {
			uid: userUid,
			amount: withdrawAmount,
			accountTitle: accountTitle || "No Title",
			accountNumber: accountNumber,
			branchCode: branchCode,
			iban: iban,
			comments: comments || "No Comments",
			state: "in-progress", // approved, in-progress, declined
		};
		addDoc(collection(db, "withdraw-requests"), docData)
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
									<h1 className="text-color-3 font-semibold text-5xl">Steps to Withdraw Money</h1>
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
										<h6 className="text-xl text-color-2 font-semibold">Provide the details in the form accurately to process your withdrawal request</h6>
										<p className="mt-2 mb-4 text-color-3">
											Enter the details correctly and accurately in the form below to complete your withdraw request and we will process it within 24 hours. Make sure that the withdraw amount is less than or equal to
											your current balance in the tap and pay wallet
										</p>
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
										<h4 className="text-2xl font-semibold text-center">Withdraw Money from your wallet</h4>
										<p className="leading-relaxed mt-1 mb-4 text-blueGray-500">Complete this form and we will withdraw the money within 24 hours</p>
										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												Withdraw Amount
											</label>
											<input
												type="number"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Deposit Amount"
												value={withdrawAmount}
												onChange={(e) => setWithdrawAmount(e.target.value)}
											/>
										</div>
										<p>Enter the bank account details of the account where you want to withdraw the money. Double check the information for any errors and in order to process the request more smoothly.</p>

										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												Account Title
											</label>
											<input
												type="text"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Account Title"
												value={accountTitle}
												onChange={(e) => setAccountTitle(e.target.value)}
											/>
										</div>

										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												Account Number
											</label>
											<input
												type="number"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Account Title"
												value={accountNumber}
												onChange={(e) => setAccountNumber(e.target.value)}
											/>
										</div>

										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												Branch Code (if any)
											</label>
											<input
												type="number"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Account Title"
												value={branchCode}
												onChange={(e) => setBranchCode(e.target.value)}
											/>
										</div>

										<div className="relative w-full mb-3 mt-8">
											<label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="full-name">
												IBAN
											</label>
											<input
												type="text"
												className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
												placeholder="Account Title"
												value={iban}
												onChange={(e) => setIban(e.target.value)}
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
												onClick={onSubmitWithdrawForm}
											>
												Submit Withdraw Request
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
