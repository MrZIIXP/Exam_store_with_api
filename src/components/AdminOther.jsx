import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Get_Category,
	Get_Brands,
	Get_Features,
	Add_Category,
	Del_Category,
	Edit_Category,
	Add_Brand,
	Del_Brand,
	Edit_Brand,
	Add_Feature,
	Del_Feature,
	Edit_Feature,
} from '../redux/Api'
import { Search, Plus, X, Check, Edit2, Trash2 } from 'lucide-react'
import Pagination from './ui/Pagination'
import { LineOutlined } from '@ant-design/icons'
import { useForm } from 'react-hook-form'
import { Image } from 'antd'

const AdminOther = () => {
	const dispatch = useDispatch()
	const { category_ops_loading, brand_ops_loading, feature_ops_loading } = useSelector(
		(state) => state.Market
	)
	const [data_category, setCat] = useState(null)
	const [data_brands, setBrand] = useState(null)
	const [data_features, setFeat] = useState(null)
	const [activeTab, setActiveTab] = useState('categories')
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedItems, setSelectedItems] = useState([])
	const [editingItem, setEditingItem] = useState(null)

	const addModalRef = useRef()
	const editModalRef = useRef()
	const deleteModalRef = useRef()

	const cat = useForm({
		defaultValues: {
			catName: "",
			catImage: null,
		}
	})
	const catedit = useForm({
		defaultValues: {
			catName: "",
			catImage: null,
		}
	})

	const itemsPerPage = 10

	const Update = async () => {
		dispatch(Get_Category()).then((res) => setCat(res.payload))
		dispatch(Get_Brands()).then((res) => setBrand(res.payload))
		dispatch(Get_Features()).then((res) => setFeat(res.payload))
	}

	useEffect(() => {
		Update()
	}, [dispatch])

	const filteredItems = {
		categories:
			data_category?.filter((item) =>
				item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
			) || [],
		brands:
			data_brands?.filter((item) =>
				item.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
			) || [],
		features:
			data_features?.filter((item) =>
				item.subCategoryName?.toLowerCase().includes(searchTerm.toLowerCase())
			) || [],
	}

	const currentItems = filteredItems[activeTab]?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handleAddNew = () => {
		addModalRef.current.showModal()
	}

	const handleEdit = (item) => {
		setEditingItem(item)
		if (activeTab === "categories"){
			catedit.reset({
				catName: item.categoryName,
				catImage: null
			})
		}
		editModalRef.current.showModal()
	}

	const handleDelete = (item) => {
		setEditingItem(item)
		deleteModalRef.current.showModal()
	}

	const handleBulkDelete = async () => {
		try {
			switch (activeTab) {
				case 'categories':
					const categoryPromises = selectedItems.map((item) => dispatch(Del_Category(item)))
					await Promise.all(categoryPromises)
					break
				case 'brands':
					const brandPromises = selectedItems.map((item) => dispatch(Del_Brand(item)))
					await Promise.all(brandPromises)
					break
				case 'features':
					const featurePromises = selectedItems.map((item) => dispatch(Del_Feature(item)))
					await Promise.all(featurePromises)
					break
			}
			Update()
			setSelectedItems([])
		} catch (error) {
			console.error('Error during bulk delete:', error)
		}
	}

	const toggleSelectAll = () => {
		if (selectedItems.length === currentItems.length) {
			setSelectedItems([])
		} else {
			setSelectedItems(currentItems.map((item) => item.id))
		}
	}
	const [preview, setPreview] = useState(null)
	const find = cat.watch("catImage")
	const finds = catedit.watch("catImage")

	useEffect(() => {
		const file = find?.[0]
		if (file instanceof File) {
			const url = URL.createObjectURL(file)
			setPreview(url)
		} else {
			setPreview(null)
		}
	}, [find])

	useEffect(() => {
		const file = finds?.[0]
		if (file instanceof File) {
			const url = URL.createObjectURL(file)
			setPreview(url)
		} else {
			setPreview(null)
		}
	}, [finds])


	const toggleSelectItem = (id) => {
		if (selectedItems.includes(id)) {
			setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
		} else {
			setSelectedItems([...selectedItems, id])
		}
	}

	if (!data_brands && !data_category && !data_features) {
		return (
			<div className="w-full py-[150px] flex justify-center bg-white dark:bg-gray-900">
				<div className="animate-spin size-[100px] rounded-full border-b-2 border-l-2 border-red-500"></div>
			</div>
		)
	}

	return (
		<div className="p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
			<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
				{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
			</h1>

			<div className="flex md:flex-col gap-2 mb-4 md:mb-6">
				{['categories', 'brands', 'features'].map((tab) => (
					<button
						key={tab}
						className={`px-3 py-1.5 md:px-4 md:py-2 font-medium rounded-md transition-colors ${activeTab === tab
							? 'bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-white'
							: 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
							}`}
						onClick={() => {
							setActiveTab(tab)
							setCurrentPage(1)
							setSelectedItems([])
						}}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>

			<div className="flex md:flex-col lg:items-center lg:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
				<div className="flex items-center gap-2 md:flex-col md:items-start w-full">
					<div className="relative w-52 md:w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search..."
							className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<label
						htmlFor="allCheck"
						className={`size-10 md:size-[42px] rounded-md border flex items-center justify-center transition-colors ${selectedItems.length === currentItems.length && currentItems.length !== 0
							? 'bg-blue-600 border-blue-600'
							: selectedItems.length > 0
								? 'bg-blue-600 border-blue-600'
								: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
							}`}
					>
						{selectedItems.length === currentItems.length && currentItems.length !== 0 ? (
							<Check className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={5} />
						) : selectedItems.length > 0 ? (
							<LineOutlined className="text-white text-xl md:text-3xl" />
						) : null}
					</label>
					<input
						className="hidden"
						id="allCheck"
						type="checkbox"
						onChange={toggleSelectAll}
						checked={selectedItems.length === currentItems.length}
					/>
					<div className="md:flex gap-2 hidden md:gap-3 flex-wrap">
						{selectedItems.length > 0 && (
							<button
								onClick={handleBulkDelete}
								className="px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 md:gap-2"
							>
								<Trash2 className="w-4 h-4" />
								Delete Selected ({selectedItems.length})
							</button>
						)}
						{activeTab === 'categories' && (
							<button
								onClick={handleAddNew}
								className="px-3 text-nowrap py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 md:gap-2"
							>
								<Plus className="w-4 h-4" />
								<p className="text-nowrap">Add New</p>
							</button>
						)}
					</div>
				</div>

				<div className="flex gap-2 md:hidden flex-nowrap md:flex-wrap">
					{selectedItems.length > 0 && (
						<button
							onClick={handleBulkDelete}
							className="px-3 py-2 md:px-4 md:py-2 text-nowrap bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 md:gap-2"
						>
							<Trash2 className="w-4 h-4" />
							Delete Selected ({selectedItems.length})
						</button>
					)}
					{activeTab === 'categories' && (
						<button
							onClick={handleAddNew}
							className="px-3 py-2 md:px-4 text-nowrap md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 md:gap-2"
						>
							<Plus className="w-4 h-4" />
							Add New
						</button>
					)}
				</div>
			</div>

			{activeTab !== 'categories' && (
				<div className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-start w-full">
					<div className="rounded-lg overflow-hidden w-full border border-gray-200 dark:border-gray-700">
						<div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
							<div className="col-span-6 font-medium">{activeTab}</div>
							<div className="col-span-6 font-medium text-right">Action</div>
						</div>

						{currentItems?.map((item) => (
							<div
								key={item.id}
								className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								<div className="col-span-6 flex items-center">
									<h3 className="font-medium truncate">{item.brandName || item.subCategoryName}</h3>
								</div>
								<div className="col-span-6 flex items-center justify-end gap-2">
									<input
										type="checkbox"
										checked={selectedItems.includes(item.id)}
										onChange={() => toggleSelectItem(item.id)}
										className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
									/>
									<button
										onClick={() => handleEdit(item)}
										className="p-1 text-blue-600 hover:text-blue-800"
									>
										<Edit2 className="w-4 h-4" />
									</button>
									<button
										onClick={() => handleDelete(item)}
										className="p-1 text-red-500 hover:text-red-700"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="p-4 md:p-5 flex flex-col w-full lg:max-w-sm gap-3 border rounded-lg border-gray-200 dark:border-gray-700">
						<h1 className="text-lg md:text-xl font-semibold">
							Add new {activeTab}
						</h1>
						<form
							className="w-full flex flex-col gap-4 md:gap-6"
							onSubmit={async (e) => {
								e.preventDefault()
								switch (activeTab) {
									case 'features':
										dispatch(
											Add_Feature({
												categoryId: e.target.catId.value,
												subCategoryName: e.target.name.value,
											})
										).then(() => Update())
										break
									case 'brands':
										dispatch(Add_Brand(e.target.name.value)).then(() => Update())
										break
								}
							}}
						>
							{activeTab === 'features' && (
								<select
									name="catId"
									className="border rounded-md px-4 py-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
								>
									{data_category?.map((item) => (
										<option key={item.id} value={item.id}>
											{item.categoryName}
										</option>
									))}
								</select>
							)}
							<input
								type="text"
								name="name"
								placeholder={`${activeTab.at(0).toUpperCase() + activeTab.slice(1, -1)
									} name`}
								className="border rounded-md px-4 py-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
							/>
							<button
								type="submit"
								className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-md ml-auto"
							>
								Create
							</button>
						</form>
					</div>
				</div>
			)}

			{activeTab === 'categories' && (
				<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
					{currentItems?.map((item) => (
						<div
							key={item.id}
							className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
						>
							<div className="flex items-start justify-between">
								<div className="flex flex-col md:w-[80%] lg:h-52 gap-1">
									<img
										src={
											import.meta.env.VITE_API_BASE_URL +
											'images/' +
											item.categoryImage
										}
										className="w-full h-44 md:h-36 object-contain bg-white rounded"
										alt=""
									/>
									<h3 className="font-semibold truncate text-sm md:text-base">
										{item.categoryName}
									</h3>
								</div>
								<div className="flex flex-col items-center gap-1 ml-2">
									<input
										type="checkbox"
										checked={selectedItems.includes(item.id)}
										onChange={() => toggleSelectItem(item.id)}
										className="w-4 h-4"
									/>
									<button
										onClick={() => handleEdit(item)}
										className="p-1 text-blue-600 hover:text-blue-800"
									>
										<Edit2 className="w-4 h-4" />
									</button>
									<button
										onClick={() => handleDelete(item)}
										className="p-1 text-red-500 hover:text-red-700"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{currentItems?.length === 0 && (
				<div className="text-center py-12 text-gray-500 dark:text-gray-400">
					No {activeTab} found
				</div>
			)}

			<div className="flex justify-center items-center mt-6">
				<Pagination
					totalItems={filteredItems[activeTab]?.length || 0}
					currentPage={currentPage}
					pageSize={itemsPerPage}
					onPageChange={setCurrentPage}
				/>
			</div>

			<dialog ref={addModalRef} className="bg-transparent">
				<div className="fixed inset-0 dark:text-white bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Add {activeTab.slice(0, -1)}
							</h3>
							<button
								onClick={() => addModalRef.current.close()}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<form
							onSubmit={cat.handleSubmit((data) => {
								const formData = new FormData()
								Array.from(data.catImage)?.forEach((item) =>
									formData.append('CategoryImage', item)
								)
								formData.append('CategoryName', data.catName)
								dispatch(Add_Category(formData)).then(() => Update())
								addModalRef.current.close()
								cat.reset()
							})}
							className="space-y-4"
						>
							<div>
								<label className="block text-sm font-medium mb-2">
									{activeTab === 'categories'
										? 'Category'
										: activeTab === 'brands'
											? 'Brand'
											: 'SubCategory'}{' '}
									name *
								</label>
								<input
									type="text"
									{...cat.register("catName", { required: true })}
									className={`w-full px-3 py-2 border ${cat.formState.errors.catName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700`}
									placeholder={`Enter ${activeTab.slice(0, -1)} name`}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Image</label>
								{preview ? (
									<label htmlFor="img" className="block bg-white w-full h-[200px] relative cursor-pointer">
										<img
											src={preview}
											alt="Preview"
											className="object-contain w-full h-full bg-white mix-blend-multiply"
										/>
									</label>
								) : (
									<label htmlFor="img">
										<div
											className={`border-2 border-dashed ${cat.formState.errors.catImage
												? "border-red-500"
												: "border-gray-300 dark:border-gray-600"
												} rounded-lg p-6 text-center cursor-pointer`}>
											<div className="w-10 h-10 text-gray-400 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
												<Plus className="w-5 h-5" />
											</div>
											<p className="text-sm mb-1">Click to upload or drag and drop</p>
											<p className="text-xs text-gray-500">(SVG, JPG, PNG, or gif maximum 900×400)</p>
										</div>
									</label>
								)}
								<input type="file" id="img" className="hidden" onChange={() => console.log(cat.watch("catImage"))} {...cat.register("catImage", { required: true })} />
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => { addModalRef.current.close(), cat.reset() }}
									className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
								>
									Create
								</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>

			<dialog ref={editModalRef} className="bg-transparent">
				<div className="fixed inset-0 bg-black bg-opacity-50 dark:text-white flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Edit {activeTab.slice(0, -1)}
							</h3>
							<button
								onClick={() => editModalRef.current.close()}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{activeTab === 'categories' && (
							<form
								onSubmit={catedit.handleSubmit((data) => {
									const formData = new FormData()
									Array.from(data.catImage)?.forEach((item) =>
										formData.append('CategoryImage', item)
									)
									formData.append('CategoryName', data.catName)
									formData.append('Id', editingItem.id)
									dispatch(Edit_Category(formData)).then(() => Update())
									editModalRef.current.close()
									catedit.reset()
								})}
								className="space-y-4"
							>
								<div>
									<label className="block text-sm font-medium mb-2">Name *</label>
									<input
										type="text"
										{...catedit.register("catName", { required: true })}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Image</label>
									{preview ? <label htmlFor='imges' className='bg-white w-full'><div className='bg-white'><img className='w-full bg-white h-52 object-contain mix-blend-multiply' src={preview} alt="" /></div></label> :
										<label htmlFor="imges">
											<div className={`border-2 border-dashed ${catedit.formState.errors.catImage ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg p-6 text-center cursor-pointer`}>
												<div className="w-10 h-10 text-gray-400 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
													<Plus className="w-5 h-5" />
												</div>
												<p className="text-sm mb-1">Click to upload or drag and drop</p>
												<p className="text-xs text-gray-500">
													(SVG, JPG, PNG, or gif maximum 900×400)
												</p>
											</div>
										</label>}

									<input type="file" {...catedit.register("catImage", { required: true })} id="imges" className="hidden" />
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={() => editModalRef.current.close()}
										className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
									>
										Save
									</button>
								</div>
							</form>
						)}

						{activeTab === 'features' && (
							<form
								onSubmit={async (e) => {
									e.preventDefault()
									dispatch(
										Edit_Feature({
											id: editingItem?.id,
											categoryId: e.target.catId.value,
											subCategoryName: editingItem?.subCategoryName,
										})
									).then(() => Update())
									editModalRef.current.close()
								}}
								className="space-y-4"
							>
								<div>
									<label className="block text-sm font-medium mb-2">Category</label>
									<select
										name="catId"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
									>
										{data_category?.map((item) => (
											<option key={item.id} value={item.id}>
												{item.categoryName}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Name</label>
									<input
										type="text"
										value={editingItem?.subCategoryName || ''}
										onInput={(e) =>
											setEditingItem({ ...editingItem, subCategoryName: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
									/>
								</div>
								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={() => editModalRef.current.close()}
										className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
									>
										Update
									</button>
								</div>
							</form>
						)}

						{activeTab === 'brands' && (
							<form
								onSubmit={async (e) => {
									e.preventDefault()
									dispatch(
										Edit_Brand({
											id: editingItem?.id,
											brandName: editingItem?.brandName,
										})
									).then(() => Update())
									editModalRef.current.close()
								}}
								className="space-y-4"
							>
								<div>
									<label className="block text-sm font-medium mb-2">Brand name</label>
									<input
										type="text"
										value={editingItem?.brandName || ''}
										onInput={(e) =>
											setEditingItem({ ...editingItem, brandName: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
									/>
								</div>
								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={() => {editModalRef.current.close(), cat.reset()}}
										className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
									>
										Update
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</dialog>

			<dialog ref={deleteModalRef} className="bg-transparent">
				<div className="fixed inset-0 bg-black dark:text-white bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 w-full max-w-sm">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Delete {activeTab.slice(0, -1)}
							</h3>
							<button
								onClick={() => deleteModalRef.current.close()}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<p className="text-gray-600 dark:text-gray-300 mb-6">
							Are you sure you want to delete this item?
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => deleteModalRef.current.close()}
								className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
							>
								Cancel
							</button>
							<button
								onClick={async () => {
									const item = editingItem
									switch (activeTab) {
										case 'categories':
											dispatch(Del_Category(item.id)).then(() => Update())
											break
										case 'brands':
											dispatch(Del_Brand(item.id)).then(() => Update())
											break
										case 'features':
											dispatch(Del_Feature(item.id)).then(() => Update())
											break
									}
									deleteModalRef.current.close()
								}}
								className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</dialog>
		</div>
	)
}

export default AdminOther