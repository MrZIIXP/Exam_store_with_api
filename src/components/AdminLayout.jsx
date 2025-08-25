import { useDispatch } from 'react-redux'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Get_profile } from '../redux/Api'
import { useEffect, useState } from 'react'

const AdminLayout = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const Get = async () => {
		dispatch(Get_profile(localStorage.getItem("user").toLowerCase())).then((res) => { res.payload.userRoles.some(item => item.name === "User") ? window.location.href = "/" : null })
	}

	useEffect(() => {
		Get()
	}, [])

	const isActive = (path) => {
		return location.pathname === path ? 'text-red-500' : 'opacity-50 hover:text-red-500'
	}

	return (
		<div className="min-h-screen py-8">
			<div className="max-w-6xl mx-auto px-4">
				<p className='my-10 font-semibold'>
					<Link to="/" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>
						Home
					</Link> / <Link to="/admin" className={location.pathname === "/admin" ? 'text-black dark:text-white' : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"}>Admin Panel</Link>
					{location.pathname === "/admin/users" ? location.pathname === "/admin/products" ? <> / <span className='text-black dark:text-white'>Products</span></> : null : <> / <span className='text-black dark:text-white'>Users</span></>}
				</p>

				<div className="flex gap-8 ">
					<div className="w-64 flex-shrink-0">
						<div className="bg-white dark:bg-gray-900 rounded-lg p-6 sticky top-20">
							<Link to="/admin"><h3 className="font-semibold hover:text-red-500 text-gray-900 dark:text-gray-100 mb-4 text-base">Admin Panel</h3></Link>
							<ul className="space-y-2 mb-6 pl-7">
								<li className={`font-normal text-base cursor-pointer transition-colors ${isActive('/admin/users')}`}>
									<Link to="/admin/users">Users</Link>
								</li>
								<li className={`font-normal text-base cursor-pointer transition-colors ${isActive('/admin/products')}`}>
									<Link to="/admin/products">Products</Link>
								</li>
								<li className={`font-normal text-base cursor-pointer transition-colors ${isActive('/admin/orders')}`}>
									<button>Orders</button>
								</li>
							</ul>

							<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-base">Statistics</h3>
							<ul className="space-y-2 mb-6 pl-7">
								<li className={`font-normal text-base cursor-pointer transition-colors ${isActive('/admin/reports')}`}>
									<button>Sales Reports</button>
								</li>
								<li className={`font-normal text-base cursor-pointer transition-colors ${isActive('/admin/activity')}`}>
									<>User Activity</>
								</li>
							</ul>

						</div>
					</div>

					<div className="flex-1">
						<Outlet />
					</div>
				</div>
			</div>
		</div >
	)
}

export default AdminLayout