import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, ImageIcon, Palette, Upload, X, CheckCircle } from 'lucide-react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Add_product, Get_Brands, Get_Features } from '../redux/Api'
import { API } from '../config'

const AdminAddProduct = () => {
	const dispatch = useDispatch()
	const { data_features, data_brands, add_product } = useSelector(state => state.Market)
	const [color, setColors] = useState([])
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const successModalRef = useRef()

	const Update = async () => {
		const { data } = await API.get("Color/get-colors")
		setColors(data.data)
	}

	useEffect(() => {
		dispatch(Get_Brands())
		dispatch(Get_Features())
		Update()
	}, [])

	useEffect(() => {
		if (add_product === true) {
			setShowSuccessModal(true)
			successModalRef.current.showModal()
		}
	}, [add_product])

	const inputRef = useRef()
	const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
		defaultValues: {
			productName: '',
			code: '',
			description: '',
			brandId: '',
			colorId: '',
			quantity: '',
			weight: '',
			size: '',
			price: '',
			hasDiscount: false,
			discountPrice: 0,
			subCategoryId: '',
			images: []
		}
	})

	const onSubmit = (data) => {
		const formData = new FormData()
		Array.from(data.images)?.forEach(item => formData.append("images", item))
		formData.append("productName", data.productName)
		formData.append("code", data.code)
		formData.append("description", data.description)
		formData.append("brandId", data.brandId)
		formData.append("colorId", data.colorId)
		formData.append("quantity", data.quantity)
		formData.append("weight", data.weight)
		formData.append("size", data.size)
		formData.append("price", data.price)
		formData.append("hasDiscount", data.hasDiscount)
		formData.append("discountPrice", data.discountPrice || 0)
		formData.append("subCategoryId", data.subCategoryId)
		dispatch(Add_product(formData))
	}

	return (
		<div className="bg-white dark:bg-gray-900 w-full p-4 lg:p-6 min-h-screen">
			<dialog className='bg-transparent' ref={successModalRef}>
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => successModalRef.current.close()}>
					<div onClick={(e) => e.stopPropagation()} className='min-w-[90%] lg:min-w-[468px] bg-white dark:bg-gray-800 rounded-xl p-6 text-center'>
						<div className="flex justify-center mb-4">
							<CheckCircle className="w-16 h-16 text-green-500" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Successfully added</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-6">Do you want to add new product to your store?</p>
						<div className="flex flex-col lg:flex-row justify-center gap-3 lg:gap-4">
							<Link to="/admin/products">
								<button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
									Go to products
								</button>
							</Link>
							<button
								onClick={() => {
									successModalRef.current.close()
									setShowSuccessModal(false)
								}}
								className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
							>
								<span>+</span>
								<span>Add new</span>
							</button>
						</div>
					</div>
				</div>
			</dialog>

			<div className="flex flex-col lg:flex-row items-start lg:items-center w-full gap-3 lg:gap-2 mb-6">
				<button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
					<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
				</button>
				<h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Products / Add new</h1>
				<div className='ml-auto flex flex-col lg:flex-row gap-3 lg:gap-4 w-full lg:w-auto mt-4 lg:mt-0'>
					<Link to={-1} className='w-full lg:w-auto'>
						<button className='text-blue-500 border border-blue-500 px-4 lg:px-8 py-2 lg:py-3 text-base lg:text-lg rounded-lg w-full hover:bg-blue-50 dark:hover:bg-blue-900/20'>
							Cancel
						</button>
					</Link>
					<button
						onClick={handleSubmit(onSubmit)}
						className='text-white bg-blue-500 hover:bg-blue-600 px-4 lg:px-8 py-2 lg:py-3 text-base lg:text-lg rounded-lg flex items-center justify-center min-w-[120px] w-full lg:w-auto disabled:opacity-50'
						disabled={add_product}
					>
						{add_product ? (
							<div className="animate-spin size-5 lg:size-6 rounded-full border-b-2 border-l-2 border-white"></div>
						) : (
							'Save'
						)}
					</button>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='flex flex-col lg:flex-row gap-5'>
					<div className='w-full lg:w-2/3'>
						<div className="mb-6 lg:mb-8">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Information</h2>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product name *</label>
									<input
										type="text"
										className={`w-full px-4 py-3 lg:py-4 border ${errors.productName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
										placeholder="Enter product name"
										{...register("productName", { required: "Product name is required" })}
									/>
									{errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code *</label>
									<input
										type="text"
										className={`w-full px-4 py-3 lg:py-4 border ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
										placeholder="Enter product code"
										{...register("code", { required: "Product code is required" })}
									/>
									{errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
								</div>
							</div>
						</div>

						<div className="mb-6 lg:mb-8">
							<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Description *</h3>
							<div className="flex items-center gap-1 mb-0 p-2 border border-gray-300 dark:border-gray-600 rounded-t-md bg-gray-50 dark:bg-gray-800">
								<button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Bold className="w-4 h-4" /></button>
							</div>

							<textarea
								className={`w-full px-3 py-2 border border-t-0 ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-b-md h-32 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
								placeholder="Enter product description"
								{...register("description", { required: "Description is required" })}
							/>
							{errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
						</div>

						<div className="mb-6 lg:mb-8 flex flex-col lg:flex-row gap-4 lg:gap-5">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SubCategory *</label>
								<select
									className={`w-full px-4 py-3 lg:py-4 border ${errors.subCategoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
									{...register("subCategoryId", {
										required: "SubCategory is required",
									})}
								>
									{data_features && data_features.map((item) => <option key={item.id} value={item.id}>{item.subCategoryName}</option>)}
								</select>
								{errors.subCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subCategoryId.message}</p>}
							</div>

							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand *</label>
								<select
									className={`w-full px-4 py-3 lg:py-4 border ${errors.brandId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
									{...register("brandId", {
										required: "Brand is required",
									})}
								>
									{data_brands && data_brands.map(item => <option key={item.id} value={item.id}>{item.brandName}</option>)}
								</select>
								{errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>}
							</div>
						</div>

						<div className="mb-6 lg:mb-8">
							<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Prices</h3>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product price *</label>
									<input
										type="number"
										step="0.01"
										className={`w-full px-4 py-3 lg:py-4 border ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
										placeholder="0.00"
										{...register("price", {
											required: "Price is required",
											valueAsNumber: true,
											min: { value: 0, message: "Price must be positive" }
										})}
									/>
									{errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity *</label>
									<input
										type="number"
										className={`w-full px-4 py-3 lg:py-4 border ${errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
										placeholder="0"
										{...register("quantity", {
											required: "Quantity is required",
											valueAsNumber: true,
											min: { value: 0, message: "Quantity must be positive" }
										})}
									/>
									{errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount Price</label>
									<input
										type="number"
										step="0.01"
										className="w-full px-4 py-3 lg:py-4 border border-gray-300 dark:border-gray-600 rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
										placeholder="0.00"
										{...register("discountPrice", {
											min: { value: 0, message: "Discount price must be positive" }
										})}
									/>
									{errors.discountPrice && <p className="text-red-500 text-sm mt-1">{errors.discountPrice.message}</p>}
								</div>
							</div>
						</div>

						<div className="mb-6 lg:mb-8">
							<label className="flex items-center">
								<input
									type="checkbox"
									className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
									{...register("hasDiscount")}
								/>
								<span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Add discount for this product</span>
							</label>
						</div>

						<div className="mb-6 lg:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight</label>
								<input
									type="text"
									className="w-full px-4 py-3 lg:py-4 border border-gray-300 dark:border-gray-600 rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
									placeholder="Enter weight"
									{...register("weight")}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
								<input
									type="text"
									className="w-full px-4 py-3 lg:py-4 border border-gray-300 dark:border-gray-600 rounded-md outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
									placeholder="Enter size"
									{...register("size")}
								/>
							</div>
						</div>
					</div>

					<div className="w-full lg:w-1/3">
						<div className="mb-6 lg:mb-8">
							<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
								<Palette className="w-4 h-4" />
								Color: *
							</h3>
							<div className="flex items-center gap-2">
								<div
									style={{ scrollbarWidth: "none" }}
									className={`w-full p-3 lg:p-4 items-center border ${!errors.colorId ? "border-gray-300  dark:border-gray-600" : "border-red-500"} flex overflow-x-auto rounded-md outline-none bg-white dark:bg-gray-800`}
								>
									{color && color.map((color, index) => (
										<div
											key={index}
											onClick={() => { setValue("colorId", color.id) }}
											style={{ backgroundColor: color.colorName }}
											className={`${watch("colorId") === color.id ? "border-4 border-blue-300" : ""} w-8 h-8 lg:w-10 lg:h-10 border border-gray-300 dark:border-gray-600 rounded-full outline-none cursor-pointer`}
										/>
									))}
								</div>
								<input type="hidden" {...register("colorId", { required: "Color is required" })} />
							</div>
							{errors.colorId && <p className="text-red-500 text-sm mt-1">{errors.colorId.message}</p>}
						</div>

						<div className="mb-6 lg:mb-8">
							<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Images *</h3>
							<label htmlFor="images">
								<div className={`border-2 cursor-pointer hover:border-black dark:hover:border-white border-dashed ${errors.images ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg p-4 lg:p-6 text-center bg-white dark:bg-gray-800`}>
									<div className="max-w-md mx-auto">
										<input type="file" id="images" className='hidden' ref={inputRef} multiple {...register("images", { required: true })} />
										<Upload className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
										<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click to upload or drag and drop</p>
										<p className="text-xs text-gray-500 dark:text-gray-500">(SVG, JPG, PNG, or gif maximum 900×400)</p>
									</div>
								</div>
							</label>

							{Array.from(watch("images"))?.length > 0 && (
								<div className='mt-4 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden'>
									<div className='bg-gray-100 dark:bg-gray-800 px-4 py-2 grid grid-cols-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
										<span>Img</span>
										<span>Name</span>
										<span>Action</span>
									</div>
									<div className='max-h-40 overflow-y-auto'>
										{Array.from(watch("images"))?.map((image, index) => (
											<div key={index} className='grid grid-cols-3 items-center px-4 py-2 even:bg-gray-50 dark:even:bg-gray-700'>
												<div>
													<img src={URL.createObjectURL(image)} alt="preview" className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded" />
												</div>
												<div className="text-sm text-gray-700 dark:text-gray-300 truncate">
													{image.name}
												</div>
												<div className="flex justify-center">
													<button
														onClick={(e) => {
															e.stopPropagation()
															setValue("images", Array.from(watch("images")).filter((_, i) => i !== index))
														}}
														className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
													>
														<X className="w-4 h-4 lg:w-5 lg:h-5" />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default AdminAddProduct