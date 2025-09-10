import { useState, useEffect } from 'react'
import { Image, Modal, Pagination } from 'antd'
import { Users, Search, Filter, MoreVertical, Trash2, Edit3 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { add_role, del_role, Delete_user, get_roles, Get_Users } from '../redux/Api'

const AdminUsers = () => {
	const { users_loading, del_user } = useSelector(state => state.Market)
	const [users, setUser] = useState([])
	const [search, setSearch] = useState("")
	const [delactive, setDelactive] = useState({})
	const [page, setPage] = useState(1)
	const [deleteModalVisible, setDeleteModalVisible] = useState(false)
	const [editModalVisible, setEditModalVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const dispatch = useDispatch()

	const Update = async () => {
		dispatch(Get_Users()).then((data) => { setUser(data?.payload) })
		dispatch(get_roles()).then((data) => { setRole(data?.payload), setRoles(data?.payload[0].id) })
	}

	useEffect(() => {
		Update()
	}, [])

	const showDeleteModal = (user) => {
		setSelectedUser(user)
		setDeleteModalVisible(true)
	}

	const showEditModal = (user) => {
		setSelectedUser(user)
		setEditModalVisible(true)
	}

	const handleDelete = () => {
		if (selectedUser) {
			dispatch(Delete_user(selectedUser.userId)).then(() => {
				Update()
				setDeleteModalVisible(false)
				delete delactive[selectedUser.userId]
			})
			setDelactive((prev) => ({ ...prev, [selectedUser.userId]: true }))
		}
	}

	const handleRoleChange = (roleId, roleName) => {
		if (selectedUser) {
			const hasRole = selectedUser.userRoles.some(item => item.name === roleName)

			if (hasRole) {
				dispatch(del_role({ id: selectedUser.userId, RoleId: roleId })).then(() => Update())
			} else {
				dispatch(add_role({ id: selectedUser.userId, RoleId: roleId })).then(() => Update())
			}
		}
	}

	if (users_loading && users.length === 0) {
		return <div className='w-full py-[150px] flex justify-center'>
			<div className='animate-spin size-[100px] rounded-full border-b-2 border-l-2 border-red-500'></div>
		</div>
	}

	return (
		<div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
			<div className="flex items-center md:flex-col md:items-start md:gap-3 justify-between mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
				<div className="flex items-center gap-4">
					<div className="relative md:w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search..."
							className="pl-10 pr-4 md:w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<button className="flex items-center gap-2 px-4 py-2 border md:hidden border-gray-300 dark:border-gray-600 rounded-md dark:text-white">
						<Filter className="w-4 h-4" />
						Filter
					</button>
				</div>
			</div>

			<div className="mb-4 flex items-center justify-between">
				<span className="text-gray-500 dark:text-gray-400">{users.length} users</span>
				<div className="flex items-center gap-2">
					<span className="text-gray-500 dark:text-gray-400">Newest</span>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 md:grid-cols-3 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
				<div className="col-span-2 font-medium text-gray-500 dark:text-gray-400 md:col-span-1">User</div>
				<div className="col-span-2 font-medium text-gray-500 dark:text-gray-400 md:col-span-1">Username</div>
				<div className="col-span-3 font-medium text-gray-500 dark:text-gray-400 md:hidden">Email</div>
				<div className="col-span-2 font-medium text-gray-500 dark:text-gray-400 md:hidden">Status</div>
				<div className="col-span-2 font-medium text-gray-500 dark:text-gray-400 md:hidden">Roles</div>
				<div className="col-span-1 font-medium text-gray-500 dark:text-gray-400 md:col-span-1">Actions</div>
			</div>

			{Array.from(users)
				.filter(item => item.userName.toLowerCase().includes(search.toLowerCase()))
				.reverse()
				.slice((0 + (7 * (page - 1))), (7 * page))
				.map((user) => (
					<div key={user.userId} className="grid grid-cols-12 md:grid-cols-3 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
						<div className="col-span-2 flex items-center md:col-span-1">
							<Image
								className="rounded-full object-cover border-2 mr-3"
								width={40}
								height={40}
								src={import.meta.env.VITE_API_BASE_URL + "images/" + user.image}
								alt={user.userName}
								fallback="images/image.png"
							/>
							<div>
								<p className="font-medium text-gray-900 dark:text-white">
									{user.firstName} {user.lastName}
								</p>
							</div>
						</div>

						<div className="col-span-2 flex items-center md:col-span-1">
							<p className="text-gray-900 dark:text-white">@{user.userName}</p>
						</div>

						<div className="col-span-3 flex items-center md:hidden">
							<p className="text-gray-900 dark:text-white">{user.email}</p>
						</div>

						<div className="col-span-2 flex items-center md:hidden">
							<span className={`px-2 py-1 rounded-full text-xs ${user.userRoles.some(r => r.name === 'Admin' || r.name === 'SuperAdmin')
								? 'bg-green-100 text-green-800'
								: 'bg-blue-100 text-blue-800'
								}`}>
								{user.userRoles.some(r => r.name === 'Admin' || r.name === 'SuperAdmin') ? 'Active' : 'User'}
							</span>
						</div>

						<div className="col-span-2 flex items-center gap-1 md:hidden">
							{user.userRoles.map((item, index) => (
								<span key={index} className={`px-2 py-1 rounded text-xs ${item.name === 'Admin' ? 'bg-red-100 text-red-800' :
									item.name === "SuperAdmin" ? "bg-yellow-100 text-yellow-700" :
										'bg-blue-100 text-blue-800'
									}`}>
									{item.name}
								</span>
							))}
						</div>

						<div className="col-span-1 flex items-center justify-end">
							<div className="relative group">
								<button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
									<MoreVertical className="w-4 h-4" />
								</button>
								<div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
									<button
										onClick={() => showEditModal(user)}
										className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
									>
										<Edit3 className="w-4 h-4 mr-2" />
										Edit
									</button>
									<button
										onClick={() => showDeleteModal(user)}
										className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				))}

			{users.length === 0 && (
				<div className="text-center py-12">
					<Users size={48} className="mx-auto text-gray-400 mb-4" />
					<p className="text-gray-500 dark:text-gray-400">No users found</p>
				</div>
			)}

			<div className="mt-6 flex justify-center">
				<Pagination
					current={page}
					total={users
						.filter(item => item.userName.toLowerCase().includes(search.toLowerCase()))
						.length}
					pageSize={7}
					onChange={(page) => setPage(page)}
					className="dark:text-white"
				/>
			</div>

			<Modal
				centered
				title="Delete User"
				open={deleteModalVisible}
				onOk={handleDelete}
				onCancel={() => setDeleteModalVisible(false)}
				okText="Delete"
				okButtonProps={{ danger: true }}
				cancelText="Cancel"

			>
				{selectedUser && (
					<p>Are you sure you want to delete user <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>? This action cannot be undone.</p>
				)}
			</Modal>

			<Modal
				title="Edit User Roles"
				centered
				open={editModalVisible}
				onCancel={() => setEditModalVisible(false)}
				footer={null}
			>
				{selectedUser && (
					<div className="space-y-4">
						<div className="flex items-center gap-3 mb-4">
							<Image
								className="rounded-full object-cover border-2"
								width={50}
								height={50}
								src={import.meta.env.VITE_API_BASE_URL + "images/" + selectedUser.image}
								alt={selectedUser.userName}
								fallback="images/image.png"
							/>
							<div>
								<h4 className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</h4>
								<p className="text-sm text-gray-500">@{selectedUser.userName}</p>
							</div>
						</div>

						<div className="space-y-2">
							<h5 className="font-medium">Roles</h5>
							<div className="flex flex-wrap gap-2">
								<button
									onClick={() => handleRoleChange("34808f49-52e9-4fb7-9001-cf05800d608d", "Admin")}
									className={`px-3 py-1 rounded-full text-sm ${selectedUser.userRoles.some(item => item.name === 'Admin')
										? 'bg-red-100 text-red-800 border border-red-200'
										: 'bg-gray-100 text-gray-800 border border-gray-200'
										}`}
								>
									Admin
								</button>
								<button
									onClick={() => handleRoleChange("82f1e62b-03ca-4d0e-a61a-e5398d8a67e1", "User")}
									className={`px-3 py-1 rounded-full text-sm ${selectedUser.userRoles.some(item => item.name === 'User')
										? 'bg-blue-100 text-blue-800 border border-blue-200'
										: 'bg-gray-100 text-gray-800 border border-gray-200'
										}`}
								>
									User
								</button>
								<button
									onClick={() => handleRoleChange("81c36908-e111-4376-8f85-81ff3aae7798", "SuperAdmin")}
									className={`px-3 py-1 rounded-full text-sm ${selectedUser.userRoles.some(item => item.name === 'SuperAdmin')
										? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
										: 'bg-gray-100 text-gray-800 border border-gray-200'
										}`}
								>
									SuperAdmin
								</button>
							</div>
						</div>

						<div className="pt-4 border-t border-gray-200 flex justify-end">
							<button
								onClick={() => setEditModalVisible(false)}
								className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
							>
								Close
							</button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}

export default AdminUsers