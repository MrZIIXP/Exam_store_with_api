import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Get_product, Get_profile, Get_Users } from '../redux/Api'
import { useEffect, useState } from 'react'
import { Bell, Folder, Home, List, LogOut, PanelLeft, Search, ShoppingCartIcon, Tag } from 'lucide-react'
import { Tooltip } from 'antd'
import ThemeToggleButton from './DarkMode'
import { formatNumber } from './AdminDashboard'

const AdminLayout = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const { data_profile, data_products, data_users } = useSelector(state => state.Market)
	const [isOpen, setOpen] = useState(true)
	const [isOpenSearch, setOpenSearch] = useState("")
	const [isSearch, setSearch] = useState(false)
	const Get = async () => {
		dispatch(Get_profile(localStorage.getItem("user").toLowerCase())).then((res) => { !res.payload.userRoles.some(item => item.name === "Admin") ? window.location.href = "/" : null })
		dispatch(Get_product())
		dispatch(Get_Users())
	}


	useEffect(() => {
		if (!localStorage.getItem("account")) {
			window.location.href = "/admin/login"
		}
		Get()
	}, [])

	return (
		<div className="min-h-[calc(100vh-88px)]">
			<header className='bg-gray-900 py-5 px-10 flex items-center md:justify-between md:px-5 md:gap-3 md:w-full'>
				{<PanelLeft className='text-white my-3 hidden md:inline' onClick={() => { setOpen(true) }} />}
				<img src="/images/Header/Group 1116606595 (1).png" className='w-[166px] md:w-[100px]' alt="" />

				<div className='w-[400px] relative ml-40 md:hidden'>
					<div className='flex items-center gap-3'>
						<Search className='text-white' />
						<input type="text" className='w-full py-3 placeholder:text-white outline-none text-white bg-transparent' onFocus={() => setSearch(true)} onBlur={() => setSearch(false)} onInput={(e) => setOpenSearch(e.target.value)} placeholder='Search....' />
					</div>
					<div style={{ scrollbarWidth: "none" }} className={`absolute botton-0 left-0 w-full ${isOpenSearch || isSearch ? "h-[400px]" : "h-0 border-none"} transition-all duration-300 overflow-y-auto overflow-x-hidden z-10 bg-white dark:bg-gray-900 border-x border-b border-gray-300 rounded-b-lg`}>
						{data_products && data_products.products && data_products.products.filter(item => item?.productName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || "product".includes(isOpenSearch.trim().toLowerCase())).map((item, index) => (
							<Link to={`/admin/products/`} className='w-full flex p-2 border-y border-gray-300' key={index}>
								<div className='flex items-center w-full gap-3'>
									<img src={import.meta.env.VITE_API_BASE_URL + "images/" + item.image} className='size-[40px] rounded-full object-cover border border-white' alt="" />
									<div>
										<h1 className='text-sm font-semibold'>{item.productName}</h1>
										<p className='text-sm text-gray-500'>${item.price}</p>
									</div>
									<div className='ml-auto'>
										{!item.hasDiscount ? <div className='px-2 py-1 bg-green-500 text-white rounded'>New</div> : <div className='px-2 py-1 bg-red-500 text-white rounded'>-${formatNumber(item.discountPrice)}</div>}
										<p className='dark:text-white text-end underline'>{formatNumber(item.quantity)}</p>
									</div>
								</div>
							</Link>
						))}
						{data_users && data_users.filter(item => item?.userName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || item?.firstName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || item?.lastName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || "users".includes(isOpenSearch.trim().toLowerCase())).map((item, index) => (
							<Link to={`/admin/orders/`} className='w-full flex p-2 border-y border-gray-300' key={index}>
								<div className='flex items-center w-full gap-3'>
									<img src={import.meta.env.VITE_API_BASE_URL + "images/" + item.image} className='size-[40px] rounded-full object-cover border border-white' alt="" />
									<div>
										<h1 className='text-sm font-semibold'>{item.firstName} {item.lastName} {!item.firstName && !item.lastName && `(No name)`}</h1>
										<p className='text-sm text-gray-500'>@{item.userName}</p>
									</div>
									<div className='ml-auto'>
										<p className={`${item.userRoles[0].name === "Admin" ? "text-red-500" : item.userRoles[0].name === "SuperAdmin" ? "text-yellow-500" : "text-green-500"} text-end underline`}>{item.userRoles[0].name}</p>
										<p className='dark:text-white text-end underline'>{item.email || "No email"}</p>
									</div>
								</div>
							</Link>
						))}
						{(data_products && data_products.products && data_products.products.filter(item => item?.productName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || "prodcut".includes(isOpenSearch.trim().toLowerCase())).length === 0) && (data_users && data_users.filter(item => item?.userName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || item?.firstName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || item?.lastName?.toLowerCase().includes(isOpenSearch.toLowerCase()) || "users".includes(isOpenSearch.trim().toLowerCase())).length === 0) && <div className='w-full h-full flex items-center justify-center py-3'>Nothing Found</div>}
					</div>
				</div>
				<div className='ml-auto md:hidden'>
					<ThemeToggleButton />
				</div>
				<Tooltip placement='bottomRight' title={
					<div className='w-40 flex items-center flex-col'>
						<ThemeToggleButton />
						<button onClick={() => { window.location.href = "/admin/login", localStorage.clear() }} className='py-2 px-3 text-lg flex items-center gap-1 hover:text-gray-300 hover:underline'><LogOut /> Log out</button>
						<Link to="/" className='py-2 px-3 text-lg flex items-center gap-1 hover:text-gray-300 hover:underline'><ShoppingCartIcon />Back to shop</Link>
					</div>}>
					<div className='flex gap-3 ml-4 md:ml-0 md:min-w-10 items-center min-w-40'>
						<img src={import.meta.env.VITE_API_BASE_URL + "images/" + data_profile.image} className='size-[40px] rounded-full object-cover border border-white' alt="" />
						<p className='text-white text-xl md:hidden'>{data_profile.firstName} {data_profile.lastName}</p>
					</div>
				</Tooltip>
			</header>
			<div className='h-full flex w-full '>
				<div className={`${isOpen ? "w-[300px] md:backdrop:bg-black/40 md:left-0 md:h-screen z-50" : "w-[68px] md:h-screen md:z-50 md:w-0 md:-left-40"} transition-all md:fixed md:top-0 duration-500 flex flex-col gap-2 py-9 bg-gray-900 min-h-[calc(100vh-88px)] px-5`}>
					{!isOpen ?
						<PanelLeft className='text-white my-3 md:hidden' onClick={() => { setOpen(true) }} />
						: <p className='bg-white w-full py-3 text-center text-black rounded-lg transition-all' onClick={() => { setOpen(false) }}>Close</p>}
					<Link to="/admin/" className={` flex ${isOpen ? "py-2 px-4" : "py-2"} transition-all duration-300 gap-3 text-lg rounded-md font-medium items-center ${location.pathname === "/admin/" || location.pathname === "/admin" ? "bg-white text-black " : "text-white"}`}><Home /> {isOpen && "Dashboard"}</Link>
					<Link to="/admin/orders" className={` flex ${isOpen ? "py-2 px-4" : "py-2"} gap-3 text-lg transition-all duration-300 rounded-md font-medium items-center ${location.pathname.includes("/admin/orders") ? "bg-white text-black " : "text-white"}`}><List /> {isOpen && "Orders"}</Link>
					<Link to="/admin/products" className={` flex ${isOpen ? "py-2 px-4" : "py-2"} gap-3 text-lg rounded-md font-medium transition-all duration-300 items-center ${location.pathname.includes("/admin/products") ? "bg-white text-black " : "text-white"}`}><Tag className='scale-x-[-1]' />{isOpen && "Products"}</Link>
					<Link to="/admin/other" className={` flex gap-3 ${isOpen ? "py-2 px-4" : "py-2"} text-lg rounded-md font-medium transition-all duration-300 items-center ${location.pathname.includes("/admin/other") ? "bg-white text-black " : "text-white"}`}><Folder /> {isOpen && "Other"}</Link>
				</div>
				<div className='h-full w-full p-10 md:p-5'>
					<Outlet />
				</div>
			</div>
		</div >
	)
}

export default AdminLayout