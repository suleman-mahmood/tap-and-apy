/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Index() {
	const router = useRouter();

	useEffect(() => {
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user && !window.location.href.includes("user")) {
				router.push("user/dashboard");
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<>
			<IndexNavbar fixed />
			<section
				className="header relative pt-16 items-center flex h-screen max-h-860-px color-1 bg-no-repeat bg-full"
				style={{
					backgroundImage: "url('/img/register_bg_2.png')",
				}}
			>
				<div className="container mx-auto items-center flex flex-wrap">
					<div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
						<div className="pt-32 sm:pt-0">
							<h2 className="font-semibold text-4xl text-blueGray-600 text-color-3">Tap and Pay</h2>
							<h3 className="font-semibold text-xl mt-4 text-blueGray-600 text-color-5">Application wallet that make payments easier and efficient</h3>
							<p className="mt-4 text-lg leading-relaxed text-blueGray-500 text-color-5">Serve as mobile wallet for students at LUMS</p>
							<div className="mt-12">
								<Link href="/auth/register">
									<a className="get-started text-color-1 font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 color-2 active:bg-blueGray-500 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
										Get started
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
}
