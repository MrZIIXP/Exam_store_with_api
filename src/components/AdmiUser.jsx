import { useState, useEffect } from 'react'
import { Image, Collapse, Pagination } from 'antd'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { add_role, Delete_user, get_roles, Get_Users } from '../redux/Api'

const { Panel } = Collapse

const AdminUsers = () => {
	const { users_loading, del_user } = useSelector(state => state.Market)
	const [users, setUser] = useState([])
	const [delactive, setDelactive] = useState({})
	const [page, setPage] = useState(1)
	const [selectedRole, setRoles] = useState("82f1e62b-03ca-4d0e-a61a-e5398d8a67e1")
	const [roles, setRole] = useState([])
	const dispatch = useDispatch()
	const Update = async () => {
		dispatch(Get_Users()).then((data) => { setUser(data?.payload) })
		dispatch(get_roles()).then((data) => { setRole(data?.payload), setRoles(data?.payload[0].id) })
	}
	useEffect(() => {
		Update()
	}, [])

	if (users_loading && users.length === 0) {
		return <div className='w-full py-[150px] flex justify-center'>
			<div className='animate-spin size-[100px] rounded-full border-b-2 border-l-2 border-red-500'></div>
		</div>
	}


	return (
		<div className="bg-white dark:bg-gray-900 shadow-lg rounded p-10">
			<div className="flex items-center gap-3 mb-8">
				<Users className="text-red-500" size={24} />
				<h2 className="text-red-500 font-medium text-xl">User Management</h2>
				<span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full ml-auto">
					{users.length} users
				</span>
				<Pagination showQuickJumper showSizeChanger={false} defaultCurrent={page} total={users.length} className='w-full' pageSize={7} showLessItems={false} onChange={(pages) => { setPage(pages) }} />
			</div>

			<Collapse
				accordion
				expandIcon={({ isActive }) =>
					isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />
				}
				expandIconPosition="end"
				className="bg-transparent"
			>
				{Array.from(users).reverse().slice((0 + (7 * (page - 1))), (7 * page)).map((user) => (
					<Panel
						key={user.userId}
						header={
							<div className="flex items-center gap-4 p-2">
								{del_user && delactive[user.userId] && <div className="animate-spin size-[20px] rounded-full border-b-2 border-l-2 border-red-500"></div>}
								<Image
									className="rounded-full object-cover border-2"
									width={40}
									height={40}
									src={import.meta.env.VITE_API_BASE_URL + "images/" + user.image}
									alt={user.userName}
									fallback="images/image.png"
								/>
								<div>
									<h4 className="font-medium text-gray-900 dark:text-white">
										{user.firstName} {user.lastName}
									</h4>
									<p className="text-sm text-gray-500 dark:text-gray-400">@{user.userName}</p>
								</div>
								{user.userRoles.map(item => <span className={`ml-auto px-2 py-1 rounded text-xs ${item.name === 'Admin'
									? 'bg-red-100 text-red-800'
									: item.name === "SuperAdmin" ? "bg-yellow-100 text-yellow-700" : 'bg-blue-100 text-blue-800'
									}`}>
									{item.name}
								</span>)}
							</div>
						}
						className="mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
					>
						<div className="p-4 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										User ID
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{user.userId}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Username
									</label>
									<p className="text-sm text-gray-900 dark:text-white">@{user.userName}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Email
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Phone
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{user.phoneNumber}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Date of Birth
									</label>
									<p className="text-sm text-gray-900 dark:text-white">
										{user.dob === "0001-01-01" ? "Not set" : new Date(user.dob).toLocaleDateString()}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Role
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{user.userRoles[0].name}</p>
								</div>
							</div>

							<div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
								<button onClick={async () => { dispatch(Delete_user(user.userId)).then(() => { Update(), delete delactive[user.userId] }), setDelactive((prev) => ({ ...prev, [user.userId]: true })) }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
									Delete
								</button>
								<select value={selectedRole} onChange={(e) => {setRoles(e.target.value), selectedRole === item.id}}>
									{roles?.map(item => <option value={item.id}>{item.name}</option>)}
								</select>
								<button onClick={() => dispatch(add_role(user.userId, selectedRole))} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
									Add role
								</button>
							</div>
						</div>
					</Panel>
				))}
			</Collapse>

			{
				users.length === 0 && (
					<div className="text-center py-12">
						<Users size={48} className="mx-auto text-gray-400 mb-4" />
						<p className="text-gray-500 dark:text-gray-400">No users found</p>
					</div>
				)
			}
		</div >
	)
}

export default AdminUsers