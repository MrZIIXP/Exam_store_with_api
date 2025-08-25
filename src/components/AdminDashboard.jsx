import { Link } from 'react-router-dom'
import { Users, Package, ShoppingCart, BarChart3, ArrowRight, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Get_product, Get_Users } from '../redux/Api'
import { Image } from 'antd'

const AdminDashboard = () => {


	const { data_users, data_products } = useSelector(state => state.Market)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(Get_Users())
		dispatch(Get_product())
	}, [])

	const getActivityIcon = (type) => {
		switch (type) {
			case 'User':
				return <User size={16} className="text-green-500" />
			case 'Admin':
				return <User size={16} className="text-red-500" />
			case "SuperAdmin":
				return <User size={16} className="text-yellow-500" />
			default:
				return <BarChart3 size={16} className="text-gray-500" />
		}
	}

	return (
		<div className="bg-white dark:bg-gray-900 shadow-lg rounded p-10">
			<h2 className="text-red-500 font-medium text-xl mb-8">Dashboard Overview</h2>

			<div className="grid grid-cols-2 gap-6 mb-8">
				<Link
					to="users"
					className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
				>
					<div className="flex items-center justify-between mb-4">
						<Users size={24} className="text-red-500" /></div>
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{data_users?.length}</h3>
					<p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
				</Link>

				<Link
					to="products"
					className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
				>
					<div className="flex items-center justify-between mb-4">
						<Package size={24} className="text-red-500" /></div>
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{data_products?.products?.length}</h3>
					<p className="text-gray-600 dark:text-gray-400 text-sm">Total Products</p>
				</Link>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Recent Activities
						</h3>
						<Link
							to="/admin/users"
							className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
						>
							View all
							<ArrowRight size={16} />
						</Link>
					</div>

					<div className="space-y-4">
						{data_users.slice(0, 5).map((activity) => (
							<div key={activity.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
								<div>
									<Image src={import.meta.env.VITE_API_BASE_URL + "images/" + activity.image} width={30} height={30} className='rounded-full object-cover' fallback='images/image.png' />
								</div>

								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.userName} </p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
								</div>

								<div className="flex gap-1">
									{activity?.userRoles?.map(item => getActivityIcon(item?.name))}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
						Quick Actions
					</h3>

					<div className="space-y-3">
						<Link
							to="/admin/products"
							className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
						>
							<div className="flex items-center gap-3">
								<Package size={20} className="text-red-500" />
								<span className="text-gray-900 dark:text-white">Add New Product</span>
							</div>
							<ArrowRight size={16} className="text-gray-400" />
						</Link>

						<button
							className="flex w-full items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
						>
							<div className="flex items-center gap-3">
								<BarChart3 size={20} className="text-red-500" />
								<span className="text-gray-900 dark:text-white">Generate Report</span>
							</div>
							<ArrowRight size={16} className="text-gray-400" />
						</button>

						<button
							className="flex items-center w-full justify-between p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
						>
							<div className="flex items-center gap-3">
								<BarChart3 size={20} className="text-red-500" />
								<span className="text-gray-900 dark:text-white">System Settings</span>
							</div>
							<ArrowRight size={16} className="text-gray-400" />
						</button>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					System Status
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white dark:bg-gray-700 rounded-lg p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-3 h-3 bg-green-500 rounded-full"></div>
							<span className="text-sm font-medium text-gray-900 dark:text-white">API Status</span>
						</div>
						<p className="text-xs text-gray-600 dark:text-gray-400">All systems operational</p>
					</div>

					<div className="bg-white dark:bg-gray-700 rounded-lg p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-3 h-3 bg-green-500 rounded-full"></div>
							<span className="text-sm font-medium text-gray-900 dark:text-white">Database</span>
						</div>
						<p className="text-xs text-gray-600 dark:text-gray-400">Connected and stable</p>
					</div>

					<div className="bg-white dark:bg-gray-700 rounded-lg p-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-3 h-3 bg-green-500 rounded-full"></div>
							<span className="text-sm font-medium text-gray-900 dark:text-white">Storage</span>
						</div>
						<p className="text-xs text-gray-600 dark:text-gray-400">75% of 100GB used</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard