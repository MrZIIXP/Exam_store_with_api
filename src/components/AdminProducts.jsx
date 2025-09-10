import React, { useEffect, useRef, useState } from 'react'
import Pagination from './ui/Pagination'
import { ArrowDown, Check, Edit, Search, Trash, X, Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Del_product, Get_product, Edit_product, Get_product_by_id, Get_Brands, Get_Features } from '../redux/Api'
import { Image } from 'antd'
import { formatNumber } from './AdminDashboard'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { API } from '../config'

const AdminProducts = () => {
	const { register, handleSubmit, setValue, formState: { errors } } = useForm()
	const [selected, setSelect] = useState([])
	const [curPage, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [selID, setID] = useState(null)
	const [data_products, setData] = useState(null)
	const [filters, setFilters] = useState({ search: "", sort: "" })
	const { data_brands, data_features, product_loading } = useSelector(state => state.Market)
	const [colors, setColors] = useState()
	const DelAllRef = useRef(null)
	const DelRef = useRef(null)
	const EditRef = useRef(null)
	const dispatch = useDispatch()

	useEffect(() => {
		Update()
	}, [])

	const Update = async () => {
		dispatch(Get_product()).then(res => setData(res?.payload))
		const { data } = await API.get("Color/get-colors")
		setColors(data.data)
		dispatch(Get_Features())
		dispatch(Get_Brands())
	}

	const handleDelete = () => {
		selected.forEach(id => {
			dispatch(Del_product(id))
		})
		Update()
		setSelect([])
		DelAllRef.current.close()
	}

	const handleSingleDelete = (id) => {
		dispatch(Del_product(id)).then(() => {
			Update()
			DelRef.current.close()
		})
	}

	const openEditDialog = async (product) => {
		let products
		dispatch(Get_product_by_id(product.id)).then((item) => {
			const product = item?.payload
			console.log(product)
			Object.keys(product).forEach(key => {
				if (product[key] !== null && product[key] !== undefined) {
					setValue(key, product[key])
				}
			})
			products = product
			EditRef.current.showModal()
		}).then(() => {
			setID(product.id)
			const brand = data_brands?.find(item => item.brandName === products?.brand)
			setValue("brandId", brand?.id)
			const col = colors?.find(item => item.colorName === products?.color)
			setValue("colorId", col?.id)
			setValue("code", "")
		})
	}

	const onSubmitEdit = (data) => {
		dispatch(Edit_product({
			id: selID,
			hasDiscount: data.hasDiscount === "underfined" && false,
			discountPrice: data.discountPrice === "underfined" && 0,
			...data
		})).then(() => {
			Update()
			EditRef.current.close()
		})
	}

	if (product_loading && data_products === null) {
		return <div className='w-full py-[150px] flex justify-center'>
			<div className='animate-spin size-[100px] rounded-full border-b-2 border-l-2 border-red-500 dark:border-blue-500'></div>
		</div>
	}

	return (
		<div className="p-4 md:p-6 lg:p-10 bg-white dark:bg-gray-900 min-h-screen">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
				<Link to="add_new_product" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
					<Plus size={16} />
					<span>Add New</span>
				</Link>
			</div>

			<dialog className='bg-transparent' ref={DelAllRef}>
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => DelAllRef.current.close()}>
					<div onClick={(e) => e.stopPropagation()} className='min-w-[300px] lg:min-w-[468px] bg-white dark:bg-gray-800 rounded-xl p-6 lg:p-[28px]'>
						<div className='flex justify-between items-center mb-4'>
							<p className='text-xl font-semibold text-gray-900 dark:text-white'>Delete items</p>
							<button onClick={() => DelAllRef.current.close()} className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'>
								<X />
							</button>
						</div>
						<p className='my-1 text-gray-600 dark:text-gray-300'>Are you sure you want to delete {selected.length} selected items?</p>
						<div className='flex w-full justify-end gap-2 mt-7'>
							<button onClick={() => DelAllRef.current.close()} className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
							<button onClick={handleDelete} className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors'>Delete</button>
						</div>
					</div>
				</div>
			</dialog>

			<dialog className='bg-transparent' ref={DelRef}>
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => DelRef.current.close()}>
					<div onClick={(e) => e.stopPropagation()} className='min-w-[300px] lg:min-w-[468px] bg-white dark:bg-gray-800 rounded-xl p-6 lg:p-[28px]'>
						<div className='flex justify-between items-center mb-4'>
							<p className='text-xl font-semibold text-gray-900 dark:text-white'>Delete product</p>
							<button onClick={() => DelRef.current.close()} className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'>
								<X />
							</button>
						</div>
						<p className='my-1 text-gray-600 dark:text-gray-300'>Are you sure you want to delete this product?</p>
						<div className='flex w-full justify-end gap-2 mt-7'>
							<button onClick={() => DelRef.current.close()} className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
							<button onClick={() => handleSingleDelete(selID)} className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors'>Delete</button>
						</div>
					</div>
				</div>
			</dialog>

			<dialog className='bg-transparent' ref={EditRef}>
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4" onClick={() => EditRef.current.close()}>
					<div onClick={(e) => e.stopPropagation()} className='min-w-[90%] lg:min-w-[600px] max-w-2xl bg-white dark:bg-gray-800 rounded-xl p-6 lg:p-[28px] max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center mb-4'>
							<p className='text-xl font-semibold text-gray-900 dark:text-white'>Edit Product</p>
							<button onClick={() => EditRef.current.close()} className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'>
								<X />
							</button>
						</div>

						<form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
									<input
										type="text"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("productName", { required: "Product name is required" })}
									/>
									{errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code *</label>
									<input
										type="text"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("code", { required: "Code is required" })}
									/>
									{errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
								<textarea
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md h-20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									{...register("description", { required: "Description is required" })}
								/>
								{errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand *</label>
									<select
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("brandId", { required: "Brand is required" })}
									>
										{data_brands && data_brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.brandName}</option>)}
									</select>
									{errors.brandId && <p className="text-red-500 text-sm">{errors.brandId.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color *</label>
									<select
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("colorId", { required: "Color is required" })}
									>
										{colors && colors?.map((feature) => <option style={{ backgroundColor: feature.colorName }} key={feature.id} value={feature.id}>{feature.colorName}</option>)}
									</select>
									{errors.colorId && <p className="text-red-500 text-sm">{errors.colorId.message}</p>}
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity *</label>
									<input
										type="number"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("quantity", { required: "Quantity is required", valueAsNumber: true })}
									/>
									{errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SubCategory *</label>
									<select
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("subCategoryId", { required: "SubCategory is required", valueAsNumber: true })}
									>
										{data_features && data_features?.map((feature) => <option key={feature.id} value={feature.id}>{feature.subCategoryName}</option>)}
									</select>
									{errors.subCategoryId && <p className="text-red-500 text-sm">{errors.subCategoryId.message}</p>}
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
									<input
										type="number"
										step="0.01"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("price", { required: "Price is required", valueAsNumber: true })}
									/>
									{errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Price</label>
									<input
										type="number"
										step="0.01"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("discountPrice", { valueAsNumber: true })}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight</label>
									<input
										type="text"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("weight")}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size</label>
									<input
										type="text"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
										{...register("size")}
									/>
								</div>
							</div>

							<div className="flex items-center mt-2">
								<input
									type="checkbox"
									id="hasDiscount"
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
									{...register("hasDiscount")}
								/>
								<label htmlFor="hasDiscount" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									Has Discount
								</label>
							</div>

							<div className="flex w-full justify-end gap-2 mt-7 pt-4 border-t border-gray-200 dark:border-gray-600">
								<button type="button" onClick={() => EditRef.current.close()} className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
								<button type="submit" className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors'>Save Changes</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>

			{data_products && data_products?.products?.length > 0 && !product_loading ? (
				<div>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
						<div className="flex md:flex-col lg:flex-row gap-3 w-full ">
							<div className="relative border flex items-center md:w-full pr-3 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
								<input
									type="text"
									placeholder="Search..."
									onInput={(e) => setFilters({ ...filters, search: e.target.value })}
									className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 dark:bg-gray-800 outline-none rounded"
								/>
								<Search className='pointer-events-none text-gray-400' />
							</div>

							<div className="relative md:w-full">
								<select onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="w-full lg:w-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded appearance-none bg-white dark:bg-gray-800 outline-none text-gray-800 dark:text-gray-300">
									<option value="">All</option>
									<option value={"newest"}>Newest</option>
									<option value="discount">With Discount</option>
								</select>
								<ArrowDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-400' />
								<div className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs text-gray-500 dark:text-gray-400">Filter</div>
							</div>
						</div>

						{selected.length > 0 && (
							<div className='flex gap-3 text-blue-500'>
								<button onClick={() => DelAllRef.current.showModal()} className="w-10 h-10 border border-blue-500 rounded flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20">
									<Trash size={16} />
								</button>
							</div>
						)}
					</div>

					<div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
						<div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
							<div className="col-span-1">
								<input
									type="checkbox"
									className="w-5 h-5 border border-gray-300 dark:border-gray-600 rounded checked:bg-blue-600 dark:checked:bg-blue-500"
									checked={selected.length === data_products?.products?.length}
									onChange={e => e.target.checked ? setSelect(data_products?.products?.map(item => item.id)) : setSelect([])}
								/>
							</div>
							<div className="col-span-4 lg:col-span-3 text-sm text-gray-600 dark:text-gray-400 font-medium">Product</div>
							<div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-medium hidden lg:block">Status</div>
							<div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-medium hidden lg:block">Category</div>
							<div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-medium">Price</div>
							<div className="col-span-1 text-sm text-gray-600 dark:text-gray-400 font-medium">Action</div>
						</div>

						{data_products?.products
							?.filter(item => item.productName.toLowerCase().includes(filters.search.toLowerCase().trim()))
							.filter((item) => {
								switch (filters.sort) {
									case "newest":
										return !item.hasDiscount && item
									case "discount":
										return item.hasDiscount && item
									default:
										return item
								}
							})
							.slice(0 + (pageSize * (curPage - 1)), (pageSize * curPage))
							.map((product, index) => (
								<div
									key={index}
									className={`grid grid-cols-12 gap-4 px-4 py-4 ${selected.includes(product.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'} border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800`}
								>
									<div className="col-span-1 flex items-center">
										<input
											onChange={() => selected.includes(product.id) ? setSelect(selected.filter(item => item !== product.id)) : setSelect([...selected, product.id])}
											checked={selected.includes(product.id)}
											type="checkbox"
											className="w-5 h-5 border border-gray-300 dark:border-gray-600 rounded checked:bg-blue-600 dark:checked:bg-blue-500"
										/>
									</div>
									<div className="col-span-4 lg:col-span-3 flex items-center gap-3">
										<div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden">
											<Image
												src={import.meta.env.VITE_API_BASE_URL + "images/" + product.image}
												height={"100%"}
												width={"100%"}
												className='object-cover'
												fallback="https://via.placeholder.com/48"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<span className="text-sm font-medium text-gray-900 dark:text-white block truncate">{product.productName}</span>
										</div>
									</div>

									<div className="col-span-2 hidden lg:flex items-center">
										{product.hasDiscount ? (
											<span className='text-white bg-red-500 px-2 py-1 rounded text-xs'>Discount</span>
										) : (
											<span className='text-white bg-green-500 px-2 py-1 rounded text-xs'>In Stock</span>
										)}
									</div>

									<div className="col-span-2 hidden lg:flex items-center">
										<span className="text-sm text-gray-700 dark:text-gray-300 truncate">{product.categoryName}</span>
									</div>

									<div className="col-span-2 flex items-center">
										<span className="text-sm text-gray-700 dark:text-gray-300">${formatNumber(product.price)}</span>
									</div>

									<div className="col-span-3 lg:col-span-1 flex items-center gap-2 justify-end">
										<button
											onClick={() => openEditDialog(product)}
											className="w-8 h-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-center"
										>
											<Edit size={16} />
										</button>
										<button
											onClick={() => {
												setID(product.id)
												DelRef.current.showModal()
											}}
											className="w-8 h-8 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center justify-center"
										>
											<Trash size={16} />
										</button>
									</div>
								</div>
							))
						}
					</div>

					<div className='mt-6 flex justify-center'>
						<Pagination
							totalItems={data_products?.products?.filter(item => item.productName.toLowerCase().includes(filters.search.toLowerCase().trim())).filter((item) => {
								switch (filters.sort) {
									case "newest":
										return !item.hasDiscount && item
									case "discount":
										return item.hasDiscount && item
									default:
										return item
								}
							}).length}
							currentPage={curPage}
							pageSize={pageSize}
							onPageChange={setPage}
						/>
					</div>
				</div>
			) : !product_loading && (
				<div className="p-8 text-center">
					<div className="w-24 h-32 mx-auto mb-4 relative">
						<div className='size-[50px] bg-blue-900 dark:bg-blue-700 -bottom-[15px] -right-[15px] absolute z-20 rounded-full flex items-center justify-center'>
							<Check className='text-white' strokeWidth={"5px"} />
						</div>
						<div className='w-1/3 h-[20%] border-x-8 border-t-8 rounded-t-lg translate-x-1/2 right-1/2 top-0 absolute border-gray-900 dark:border-gray-700' />
						<div className='w-full h-[23%] bg-gray-900 dark:bg-gray-700 absolute top-[17%]' />
						<div className='w-1/3 z-10 h-[20%] border-x-8 border-t-8 rounded-t-lg translate-x-1/2 right-1/2 top-[20%] absolute border-[#D7DBEC] dark:border-gray-600' />
						<div className='w-full z-10 h-[60%] absolute bottom-0 bg-[#D7DBEC] dark:bg-gray-600 rounded-b-md' />
					</div>

					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						Add new products
					</h3>
					<p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
						Start making sales by adding your products.<br />
						You can import and manage your products at any time.
					</p>
					<Link to="add_new_product" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg items-center justify-center gap-2 transition-colors">
						<Plus size={16} />
						Add product
					</Link>
				</div>
			)}
		</div>
	)
}

export default AdminProducts