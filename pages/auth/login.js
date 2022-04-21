import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "components/Loaders/circle";

// Firebase Authentication
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// layout for page
import Auth from "layouts/Auth.js";

export default function Login() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [showLoader, setShowLoader] = useState(false);

	useEffect(() => {
		router.prefetch("/user/dashboard");
	}, []);

	const login = () => {
		setShowLoader(true);

		let newEmail = email;

		// Append @email.edu.pk if it doesn't exist
		if (!email.includes("@lums.edu.pk")) {
			newEmail = newEmail.split("@")[0];
			newEmail += "@lums.edu.pk";
			setEmail(newEmail);
		}
		const auth = getAuth();

		signInWithEmailAndPassword(auth, newEmail, password)
			.then((userCredential) => {
				// Signed in
				// Redirect user to dashboard
				setShowLoader(false);
				router.push("/user/dashboard");
			})
			.catch((error) => {
				const errorMessage = error.message;
				setErrorMessage(errorMessage);
				setShowLoader(false);
			});
	};

	return (
		<>
			<div className="container mx-auto px-4 h-full">
				<div className="flex content-center items-center justify-center h-full">
					<div className="w-full lg:w-4/12 px-4">
						<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg color-1 border-0">
							<div className="rounded-t mb-0 px-6 py-6">
								<div className="text-center mb-3">
									<h6 className="text-color-4 text-xl font-bold">
										Sign in with LUMS email id or <br /> Roll Number
									</h6>
								</div>
								<hr className="mt-6 border-b-1 border-blueGray-300" />
							</div>
							<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
								<form>
									<div className="relative w-full mb-3">
										<label className="block uppercase text-color-4 text-xs font-bold mb-2" htmlFor="grid-password">
											Roll Number / Email
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
											<span className="ml-2 text-sm font-semibold text-color-4">Remember me</span>
										</label>
									</div>

									<p className="text-center text-red-500">
										<b>{errorMessage}</b>
									</p>

									<div className="text-center mt-6">
										<button
											className="color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
											type="button"
											onClick={login}
										>
											Sign In
										</button>
									</div>
								</form>
							</div>
							{showLoader ? <Loader /> : null}
							<hr className="border-b-1 border-blueGray-300" />
							<div className="rounded-t mb-0 px-6 py-6">
								<div className="text-center mb-3">
									<h6 className="text-color-4 text-sm font-bold">Don't have an account or New to the application?</h6>
								</div>
								<div className="text-center mt-6">
									<Link href="/auth/register">
										<div className="text-center mt-6">
											<button
												className="color-2 text-color-1 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 w-full ease-linear transition-all duration-150"
												type="button"
											>
												Sign up
											</button>
										</div>
									</Link>
								</div>
							</div>
						</div>
						<div className="flex flex-wrap mt-6 relative">
							<div className="w-1/2">
								<a href="#pablo" onClick={(e) => e.preventDefault()} className="text-color-4">
									<small>Forgot password?</small>
								</a>
							</div>
							<div className="w-1/2 text-right">
								<Link href="/auth/register">
									<a href="#pablo" className="text-color-4">
										<small>Create new account</small>
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

Login.layout = Auth;
