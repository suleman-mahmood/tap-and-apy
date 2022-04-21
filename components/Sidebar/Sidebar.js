import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
	const [collapseShow, setCollapseShow] = React.useState("hidden");
	const router = useRouter();

	const signUserOut = () => {
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				router.push("/");
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	return (
		<>
			<nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl color-1 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
				<div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
					{/* Toggler */}
					<button
						className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
						type="button"
						onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
					>
						<i className="fas fa-bars text-color-2"></i>
					</button>
					{/* Brand */}
					<Link href="/">
						<a href="#pablo" className="md:block text-left md:pb-2 text-color-3 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
							Tap and Pay
						</a>
					</Link>
					{/* User */}
					<ul className="md:hidden items-center flex flex-wrap list-none">
						<li className="inline-block relative"></li>
					</ul>
					{/* Collapse */}
					<div
						className={
							"color-1 md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
							collapseShow
						}
					>
						{/* Collapse header */}
						<div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
							<div className="flex flex-wrap">
								<div className="w-6/12">
									<Link href="/">
										<a href="#pablo" className="md:block text-left md:pb-2 text-color-3 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
											Tap and Pay
										</a>
									</Link>
								</div>
								<div className="w-6/12 flex justify-end">
									<button
										type="button"
										className="cursor-pointer text-color-3 opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
										onClick={() => setCollapseShow("hidden")}
									>
										<i className="fas fa-times"></i>
									</button>
								</div>
							</div>
						</div>

						<ul className="md:flex-col md:min-w-full flex flex-col list-none" onClick={() => setCollapseShow("hidden")}>
							<li className="items-center">
								<Link href="/user/dashboard">
									<a
										href="#pablo"
										className={"text-xs uppercase py-3 font-bold block " + (router.pathname.indexOf("/user/dashboard") !== -1 ? "text-color-2 hover:text-lightBlue-600" : "text-color-4 hover:text-blueGray-500")}
									>
										<i className={"fas fa-tv mr-2 text-sm " + (router.pathname.indexOf("/user/dashboard") !== -1 ? "opacity-75" : "text-blueGray-300")}></i> Dashboard
									</a>
								</Link>
							</li>
							<li className="items-center">
								<Link href="/user/transfer">
									<a
										href="#pablo"
										className={"text-xs uppercase py-3 font-bold block " + (router.pathname.indexOf("/user/transfer") !== -1 ? "text-color-2 hover:text-lightBlue-600" : "text-color-4 hover:text-blueGray-500")}
									>
										<i className={"fas fa-tv mr-2 text-sm " + (router.pathname.indexOf("/user/transfer") !== -1 ? "opacity-75" : "text-blueGray-300")}></i> Pay
									</a>
								</Link>
							</li>
							<li className="items-center">
								<Link href="/user/transactions">
									<a
										href="#pablo"
										className={"text-xs uppercase py-3 font-bold block " + (router.pathname.indexOf("/user/transactions") !== -1 ? "text-color-2 hover:text-lightBlue-600" : "text-color-4 hover:text-blueGray-500")}
									>
										<i className={"fas fa-tv mr-2 text-sm " + (router.pathname.indexOf("/user/transactions") !== -1 ? "opacity-75" : "text-blueGray-300")}></i> Transactions
									</a>
								</Link>
							</li>
							<li className="items-center">
								<Link href="/user/deposit">
									<a
										href="#pablo"
										className={"text-xs uppercase py-3 font-bold block " + (router.pathname.indexOf("/user/deposit") !== -1 ? "text-color-2 hover:text-lightBlue-600" : "text-color-4 hover:text-blueGray-500")}
									>
										<i className={"fas fa-tv mr-2 text-sm " + (router.pathname.indexOf("/user/deposit") !== -1 ? "opacity-75" : "text-blueGray-300")}></i> Deposit
									</a>
								</Link>
							</li>
							<li className="items-center">
								<Link href="/user/withdraw">
									<a
										href="#pablo"
										className={"text-xs uppercase py-3 font-bold block " + (router.pathname.indexOf("/user/withdraw") !== -1 ? "text-color-2 hover:text-lightBlue-600" : "text-color-4 hover:text-blueGray-500")}
									>
										<i className={"fas fa-tv mr-2 text-sm " + (router.pathname.indexOf("/user/withdraw") !== -1 ? "opacity-75" : "text-blueGray-300")}></i> Withdraw
									</a>
								</Link>
							</li>
							<li className="items-center">
								<a onClick={signUserOut} href="#pablo" className={"text-xs uppercase py-3 font-bold block text-color-4 hover:text-blueGray-500"}>
									<i className={"fas fa-tv mr-2 text-sm " + "text-blueGray-300"}></i> Sign Out
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}
