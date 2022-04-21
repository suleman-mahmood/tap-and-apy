import React from "react";

// components

import IndexNavbar from "components/Navbars/IndexNavbar.js";

import FooterSmall from "components/Footers/FooterSmall.js";

export default function Auth({ children }) {
	return (
		<>
			<IndexNavbar />
			<main>
				<section className="relative w-full h-full color-1 py-40">
					<div
						className="absolute top-0 w-full h-full color-1 bg-no-repeat bg-full"
						style={{
							backgroundImage: "url('/img/register_bg_2.png')",
						}}
					></div>
					{children}
					<FooterSmall absolute />
				</section>
			</main>
		</>
	);
}
