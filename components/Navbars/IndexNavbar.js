import React from "react";
import Link from "next/link";
// components

export default function Navbar(props) {
	const [navbarOpen, setNavbarOpen] = React.useState(false);
	return (
		<>
			<nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg color-1 text-color-3 shadow">
				<div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
					<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
						<Link href="/">
							<a className="text-color-3 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase" href="#pablo">
								Tap and Pay
							</a>
						</Link>
						<button
							className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
							type="button"
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<i className="fas fa-bars"></i>
						</button>
					</div>
					<div className={"lg:flex flex-grow items-center color-1 lg:bg-opacity-0 lg:shadow-none" + (navbarOpen ? " block" : " hidden")} id="example-navbar-warning">
						<ul className="flex flex-col lg:flex-row list-none lg:ml-auto text-color-3" onClick={() => setNavbarOpen(false)}>
							<Link href="/" className="flex items-center mr-4">
								<a className="hover:text-blueGray-500 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
									<span className="ml-2">About Us</span>
								</a>
							</Link>
							<Link href="/auth/login" className="flex items-center">
								<a className="hover:text-blueGray-500 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
									<span className="ml-2">Sign In</span>
								</a>
							</Link>
							<Link href="/auth/register" className="flex items-center">
								<a className="hover:text-blueGray-500 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
									<span className="ml-2">Sign Up</span>
								</a>
							</Link>

							<li className="flex items-center">
								<a className="hover:text-blueGray-500 text-color-3 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold" href="#">
									<i className="fab fa-instagram text-lg leading-lg " />
									<span className="lg:hidden inline-block ml-2">Instagram</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}
