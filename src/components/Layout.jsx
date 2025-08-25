import { HeartOutlined, SendOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Drawer, Tooltip } from 'antd'
import { BookTextIcon, Facebook, Instagram,PanelLeft, Linkedin, LogOut, Menu, MessageCircleWarning, Search, TwitterIcon, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { _fav_reset, _set_massanges, _set_unreaded_message, account_reset, Get_Cart, Get_profile } from '../redux/Api'
import ThemeToggleButton from './DarkMode'

export default function Layout() {
	const [open, setOpen] = React.useState(false)
	const [onPage, setPage] = React.useState("")
	const { account: acc, data_cart, favourite: fav, messages, unreaded_message, data_profile } = useSelector(state => state.Market)
	const dispatch = useDispatch()
	const navigator = useNavigate()
	const [read, setRead] = React.useState(false)
	const location = useLocation()


	useEffect(() => {
		setPage(location.pathname)
		if (acc) {
			dispatch(Get_Cart())
			dispatch(Get_profile(localStorage.getItem("user")))
			if (data_profile) {
				console.log(data_profile)
			}
		}
	}, [onPage, location])

	const handleChat = () => {
		const local = JSON.parse(localStorage.getItem("messages"))
		const newlocal = local.map(item => item.read === false ? { ...item, read: true } : item)
		localStorage.setItem("messages", JSON.stringify(newlocal))
		dispatch(_set_unreaded_message(0))
		dispatch(_set_massanges(newlocal))
		setRead(true)
	}

	return (
		<div className='pt-[80px] bg-white dark:bg-black min-h-screen transition-all duration-300'>
			<header className='px-[10%] md:px-5 bg-white dark:bg-black flex items-center justify-between w-full fixed top-0 border-b dark:border-gray-800 py-4 z-50'>
				<div className='hidden md:flex items-center gap-3'>
					<Menu onClick={() => setOpen(true)} className='cursor-pointer text-black dark:text-white' />
					<p className='font-bold text-[25px] text-black dark:text-white'>Exclusive</p>
				</div>
				<img src="/images/Header/Logo.png" alt="" className='md:hidden dark:invert' />

				<nav className='flex gap-5 md:hidden items-center'>
					<Link
						to="/"
						className={onPage === "/" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/"), setOpen(false) }}
					>
						Home
					</Link>
					<Link
						to="/contact"
						className={onPage === "/contact" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/contact"), setOpen(false) }}
					>
						Contact
					</Link>
					<Link
						to="/about"
						className={onPage === "/about" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/about"), setOpen(false) }}
					>
						About
					</Link>
					<Link
						to="/register"
						className={onPage === "/register" || onPage === "/login" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/register"), setOpen(false) }}
					>
						Sing Up
					</Link>
				</nav>

				<div className='flex items-center gap-3'>
					<div className="relative w-full max-w-sm md:hidden">
						<input
							type="text"
							placeholder="What are you looking for?"
							className="w-full py-2.5 pl-4 pr-4 rounded-md bg-gray-100 dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-[13px] focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 border border-gray-300 dark:border-gray-700"
						/>
						<Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
					</div>

					<Link to={"/favourite"} className='relative md:hidden'>
						<HeartOutlined className='text-[30px] text-black dark:text-white hover:text-red-500 dark:hover:text-red-500' />
						{fav?.length > 0 && acc && <div className='absolute size-[20px] rounded-full bg-red-500 text-white top-[-6px] right-[-6px] flex items-center justify-center text-[12px]'>{fav.length}</div>}
					</Link>

					<Link to={"/cart"} className='relative'>
						<ShoppingCartOutlined className='text-[30px] text-black dark:text-white hover:text-red-500 dark:hover:text-red-500' />
						{data_cart && data_cart[0]?.productsInCart?.length > 0 && acc && <div className='absolute size-[20px] rounded-full bg-red-500 text-white top-[-6px] right-[-6px] flex items-center justify-center text-[12px]'>{data_cart && data_cart[0].productsInCart?.length}</div>}
					</Link>

					{acc &&
						<Tooltip
							placement="bottomRight"
							title={
								<div className='flex flex-col p-3 gap-3 dark:bg-black border border-transparent dark:border-gray-800 rounded-lg'>
									<Link to={"/account"} className='flex gap-3 text-[17px] items-center text-white hover:text-red-500 dark:hover:text-red-500'>
										<User /> Account
									</Link>
									<button className='flex gap-3 text-[17px] items-center text-white hover:text-red-500 dark:hover:text-red-500'>
										<BookTextIcon /> My Order
									</button>
									{data_profile && !data_profile?.userRoles?.some(item => item.name === "User") && <button className='flex gap-3 text-[17px] items-center text-white hover:text-red-500 dark:hover:text-red-500' onClick={() => { navigator("/admin"), setOpen(false) }}><PanelLeft /> Admin</button>}
									<Link to={"/favourite"} className='gap-3 text-[17px] items-center text-white hover:text-red-500 dark:hover:text-red-500 hidden md:flex'>
										<button className='relative'>
											<HeartOutlined className='text-[20px]' />
											{fav.length > 0 && acc && <div className='absolute size-[15px] rounded-full bg-red-500 text-white top-[-5px] right-[-5px] flex items-center justify-center text-[10px]'>{fav.length}</div>}
										</button>
										WishList
									</Link>
									<button
										className='flex gap-3 text-[17px] items-center text-white hover:text-red-500 dark:hover:text-red-500'
										onClick={() => { localStorage.clear(), dispatch(account_reset()), dispatch(_fav_reset()), navigator("/") }}
									>
										<LogOut className='rotate-[180deg]' /> Log Out
									</button>
								</div>
							}
						>
							<div className='cursor-pointer flex items-center justify-center rounded-full w-[50px] p-2 hover:bg-red-500 hover:text-white transition-all transform-gpu duration-300'>
								<User className='size-[25px] text-black dark:text-white' />
							</div>
						</Tooltip>
					}

					<ThemeToggleButton style={"md:hidden inline text-sm text-nowrap"} />

				</div>
			</header>

			<div className={`fixed ${read ? "bottom-0" : "bottom-[-500px]"} transition-all duration-1000 pb-5 right-0 dark:bg-gray-900 dark:border-white border-t border-l z-50 w-[300px] h-[500px] rounded-tl-lg bg-white`}>
				<div className='w-full h-[50px] flex justify-between bg-red-500 text-white rounded-tl-lg p-3 px-6'>
					<p>
						Notification
					</p>
					<button onClick={() => setRead(false)}>X</button>
				</div>
				<div className='h-[calc(100%-40px)] pt-5 flex flex-col gap-7 w-full overflow-y-auto ' style={{ scrollbarColor: "transparent transparent" }}>
					{Array.from(messages).reverse().map(item =>
						<div className='text-[14px] dark:bg-gray-800 bg-red-500 text-white rounded-xl w-[90%] mx-auto p-5' key={item.text}>
							<p>{item.text}</p>
						</div>
					)}
				</div>
			</div>

			<button onClick={handleChat} className={`fixed right-10 z-50 ${unreaded_message > 0 && !read ? "bottom-10" : "-bottom-10"} text-[30px] text-white dark:text-black bg-black dark:bg-white rounded-full p-2 hover:scale-125 transform-gpu transition-all duration-300`}>
				<div className='absolute text-[12px] size-[20px] flex items-center justify-center bg-red-500 text-white top-0 right-0 rounded-full'>{unreaded_message}</div>
				<MessageCircleWarning />
			</button>


			<Drawer
				placement="left"
				open={open}
				closable={false}
				onClose={() => setOpen(false)}
				className="dark:bg-black dark:text-white"
				styles={{
					body: {
						backgroundColor: 'var(--ant-color-bg-container)',
						color: 'var(--ant-color-text)'
					}
				}}
			>
				<ThemeToggleButton style={"text-sm mb-5 text-nowrap"} />

				<nav className='flex gap-5 flex-col'>
					<Link
						to="/"
						className={onPage === "/" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/"), setOpen(false) }}
					>
						Home
					</Link>
					<Link
						to="/contact"
						className={onPage === "/contact" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/contact"), setOpen(false) }}
					>
						Contact
					</Link>
					<Link
						to="/about"
						className={onPage === "/about" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/about"), setOpen(false) }}
					>
						About
					</Link>
					<Link
						to="/register"
						className={onPage === "/register" || onPage === "/login" ? "text-red-500 dark:text-red-500 underline" : "text-black dark:text-white hover:text-red-500 dark:hover:text-red-500"}
						onClick={() => { setPage("/register"), setOpen(false) }}
					>
						Sing Up
					</Link>
				</nav>
			</Drawer>

			<main className="bg-white dark:bg-black transition-all transform-gpu duration-300">
				<Outlet />
			</main>

			<footer className="bg-black dark:bg-gray-900 text-white text-sm transition-all transform-gpu duration-300">
				<div className="grid grid-cols-5 gap-10 px-[10%] md:gap-6 md:grid-cols-2 py-[60px]">
					<div className='md:col-start-1 md:col-end-3'>
						<h3 className="text-lg md:text-3xl font-semibold mb-4">Exclusive</h3>
						<p className="mb-2 md:text-xl font-medium">Subscribe</p>
						<p className="mb-4 md:text-lg">Get 10% off your first order</p>
						<div className='relative flex items-center'>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full px-4 py-2 md:py-4 rounded bg-transparent border border-white placeholder-gray-300 text-white focus:outline-none focus:border-red-500"
							/>
							<SendOutlined
								onClick={(e) => { alert('Subscribe Successfully') }}
								className='absolute right-3 text-[20px] text-white z-[5] cursor-pointer hover:text-red-500'
							/>
						</div>
					</div>

					<div className='md:col-start-1 md:col-end-3'>
						<h3 className="text-lg md:text-2xl font-semibold mb-4">Support</h3>
						<p className="mb-2 md:text-xl">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
						<p className="mb-2 md:text-xl">exclusive@gmail.com</p>
						<p>+88015-88888-9999</p>
					</div>

					<div>
						<h3 className="text-lg md:text-2xl font-semibold mb-4">Account</h3>
						<ul className="space-y-2 md:text-xl">
							<li className="hover:text-red-500 cursor-pointer">My Account</li>
							<li className="hover:text-red-500 cursor-pointer">Cart</li>
							<li className="hover:text-red-500 cursor-pointer">Wishlist</li>
							<li className="hover:text-red-500 cursor-pointer">Shop</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg md:text-2xl font-semibold mb-4">Quick Link</h3>
						<ul className="space-y-2 md:text-xl">
							<li className="hover:text-red-500 cursor-pointer">Privacy Policy</li>
							<li className="hover:text-red-500 cursor-pointer">Terms Of Use</li>
							<li className="hover:text-red-500 cursor-pointer">FAQ</li>
							<li className="hover:text-red-500 cursor-pointer">Contact</li>
						</ul>
					</div>

					<div className='md:col-start-1 md:col-end-3'>
						<h3 className="text-lg md:text-2xl font-semibold mb-4">Social</h3>
						<div className="flex space-x-4">
							<Facebook className='md:size-[25px] hover:text-red-500 cursor-pointer' />
							<TwitterIcon className='md:size-[25px] hover:text-red-500 cursor-pointer' />
							<Instagram className='md:size-[25px] hover:text-red-500 cursor-pointer' />
							<Linkedin className='md:size-[25px] hover:text-red-500 cursor-pointer' />
						</div>
					</div>
				</div>

				<div className="text-center text-xs md:text-lg md:max-w-[200px] md:mx-auto md:border-none py-5 border-t border-gray-700 text-gray-400">
					© Copyright Rimel 2022. All right reserved
				</div>
			</footer>
		</div>
	)
}