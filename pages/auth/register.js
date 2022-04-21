import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Firebase Authentication
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "firebase-config";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import Loader from "components/Loaders/circle";

// layout for page
import Auth from "layouts/Auth.js";

export default function Register() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [showLoader, setShowLoader] = useState(false);

	const EMAIL_LENGTH = 20;

	const authenticateEmail = () => {
		if (email.includes("@lums.edu.pk")) return true;
		return false;
	};

	const checkRollNumberLength = () => {
		if (email.length !== EMAIL_LENGTH) return false;
		return true;
	};

	const register = () => {
		setShowLoader(true);

		if (!authenticateEmail()) {
			setErrorMessage("Please enter a LUMS email");
			setShowLoader(false);
			return;
		}

		if (!checkRollNumberLength()) {
			setErrorMessage("Please enter the correct roll number");
			setShowLoader(false);
			return;
		}

		const auth = getAuth();

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in successful
				const user = userCredential.user;

				// Add data to firestore
				const userDataRef = doc(db, "users", user.uid);
				const docData = {
					email: user.email,
					fullName: fullName,
					type: "customer",
					balance: 0,
				};
				setDoc(userDataRef, docData)
					.then(() => {
						setShowLoader(false);
						console.log("Added data entry successfully");

						// Redirect user to dashboard
						router.push("/user/dashboard");
					})
					.catch((error) => {
						setShowLoader(false);
						const errorMessage = error.message;
						console.log("Error when setting up the document", errorMessage);
						setErrorMessage(errorMessage);
					});
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log("Error when creating user with email and password", errorMessage);
				setErrorMessage(errorMessage);
				setShowLoader(false);
			});
	};

	const showTermsAndConditions = () => {
		Swal.fire("You accept these terms!");
	};

	return (
		<>
			<div className="container mx-auto px-4 h-full">
				<div className="flex content-center items-center justify-center h-full">
					<div className="w-full lg:w-6/12 px-4">
						<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg color-1 border-0">
							<div className="rounded-t mb-0 px-6 py-6">
								<div className="text-center mb-3">
									<h6 className="text-color-4 text-xl font-bold">Sign up with LUMS Email ID</h6>
								</div>
								<hr className="mt-6 border-b-1 border-blueGray-300" />
							</div>
							<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
								<form>
									<div className="relative w-full mb-3">
										<label className="block uppercase text-color-4 text-xs font-bold mb-2" htmlFor="grid-password">
											Name
										</label>
										<input
											type="email"
											className="border-0 px-3 py-3 placeholder-blueGray-300 text-color-2 color-5 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											placeholder="Name"
											onChange={(e) => setFullName(e.target.value)}
										/>
									</div>

									<div className="relative w-full mb-3">
										<label className="block uppercase text-color-4 text-xs font-bold mb-2" htmlFor="grid-password">
											Email
										</label>
										<input
											type="email"
											className="border-0 px-3 py-3 placeholder-blueGray-300 text-color-2 color-5 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											placeholder="Email"
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>

									<div className="relative w-full mb-3">
										<label className="block uppercase text-color-4 text-xs font-bold mb-2" htmlFor="grid-password">
											Password
										</label>
										<input
											type="password"
											className="border-0 px-3 py-3 placeholder-blueGray-300 text-color-2 color-5 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
										/>
									</div>

									<div>
										<label className="inline-flex items-center cursor-pointer">
											<input id="customCheckLogin" type="checkbox" className="form-checkbox border-0 rounded color-5 ml-1 w-5 h-5 ease-linear transition-all duration-150" />
											<span className="ml-2 text-sm font-semibold text-color-4">
												I agree with the{" "}
												<a className="text-lightBlue-500" onClick={showTermsAndConditions}>
													Terms and Conditions
												</a>
											</span>
										</label>
									</div>
									<p className="text-center text-red-500">
										<b>{errorMessage}</b>
									</p>
									<div className="text-center mt-6">
										<button
											className="color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 w-full ease-linear transition-all duration-150"
											type="button"
											onClick={register}
										>
											Create Account
										</button>
									</div>
								</form>
							</div>
							{showLoader ? <Loader /> : null}
							<hr className="border-b-1 border-blueGray-300" />
							<div className="rounded-t mb-0 px-6 py-6">
								<div className="text-center mb-3">
									<h6 className="text-color-4 text-sm font-bold">Already have an account?</h6>
								</div>
								<div className="text-center mt-6">
									<Link href="/auth/login">
										<div className="text-center mt-6">
											<button
												className="color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 w-full ease-linear transition-all duration-150"
												type="button"
											>
												Sign In
											</button>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

Register.layout = Auth;
