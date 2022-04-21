import React from "react";

// components

import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

export default function Admin({ children }) {
	return (
		<>
			<Sidebar />
			<div className="relative md:ml-64 color-1">
				<div className="px-4 md:px-10 mx-auto w-full">
					{children}
					<FooterAdmin />
				</div>
			</div>
		</>
	);
}
