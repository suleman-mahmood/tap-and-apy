import React from "react";

export default function FooterAdmin() {
	return (
		<>
			<footer className="block py-4">
				<div className="container mx-auto px-4">
					<hr className="mb-4 border-b-1 border-blueGray-200" />
					<div className="flex flex-wrap items-center md:justify-between justify-center">
						<div className="w-full md:w-4/12 px-4">
							<div className="text-sm text-color-4 font-semibold py-1 text-center md:text-left">
								Copyright © {new Date().getFullYear()}{" "}
								<a href="/" className="text-color-4 hover:text-blueGray-700 text-sm font-semibold py-1">
									Tap and Pay
								</a>
							</div>
						</div>
						<div className="w-full md:w-4/12 px-4">
							<div className="text-sm text-color-4 font-semibold py-1 text-center md:text-left">In case of any queries, contact us @</div>
							<div className="text-sm text-color-2 font-semibold py-1 text-center md:text-left">Suleman Mahmood | 0333-3462677 | sulemanmahmood99@gmail.com</div>
						</div>
						<div className="w-full md:w-8/12 px-4">
							<ul className="flex flex-wrap list-none md:justify-end  justify-center">
								<li>
									<a href="/" className="text-color-5 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3">
										About Us
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
