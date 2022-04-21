import React from "react";
import Swal from "sweetalert2";

export default function Footer() {
	const showTermsAndConditions = () => {
		Swal.fire("Any fool can use a computer");
	};

	return (
		<>
			<footer className="relative color-1 pt-8 pb-6">
				<div className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20" style={{ transform: "translateZ(0)" }}>
					<svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
						<polygon className="text-color-5 fill-current" points="2560 0 2560 100 0 100"></polygon>
					</svg>
				</div>
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap text-center lg:text-left">
						<div className="w-full lg:w-6/12 px-4">
							<h4 className="text-3xl font-semibold text-color-4">Let's keep in touch!</h4>
							<h5 className="text-lg mt-0 mb-2 text-blueGray-600 text-color-4">Find us on any of these platforms, we respond 1-2 business days.</h5>
							<div className="mt-6 lg:mb-0 mb-6">
								<button className="color-3 text-color-1 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
									<i className="fab fa-instagram"></i>
								</button>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							<div className="flex flex-wrap items-top mb-6">
								<div className="w-full lg:w-4/12 px-4">
									<span className="block uppercase text-color-4 text-sm font-semibold mb-2">Other Resources</span>
									<ul className="list-unstyled">
										<li>
											<a className="text-color-4 hover:text-blueGray-800 hover:cursor-pointer font-semibold block pb-2 text-sm" onClick={showTermsAndConditions}>
												Terms & Conditions
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					{/* <hr className="my-6 border-blueGray-300" /> */}
					<div className="flex flex-wrap items-center md:justify-between justify-center">
						<div className="w-full md:w-4/12 px-4 mx-auto text-center">
							<div className="text-sm text-color-5 font-semibold py-1">Copyright © {new Date().getFullYear()} Tap and Pay.</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
