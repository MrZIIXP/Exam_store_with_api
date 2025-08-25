import { useState, useEffect } from 'react'
import { Image, Collapse, Pagination, Modal, Input, InputNumber, Switch, Upload, Button, message } from 'antd'
import { ChevronDown, ChevronUp, Package, Plus, Edit, Trash2, Upload as UploadIcon, Loader, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Get_product, Add_product, Get_Brands, Get_Features, Del_product } from '../redux/Api'
import { API } from '../config'

const { Panel } = Collapse
const { TextArea } = Input

const AdminProducts = () => {
	const { product_loading, data_brands, del_product, add_product, data_features } = useSelector(state => state.Market)
	const [products, setProducts] = useState([])
	const [delactive, setDelactive] = useState({})
	const [page, setPage] = useState(1)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [colors, setColors] = useState([])
	const [fileList, setFileList] = useState([])
	const dispatch = useDispatch()

	const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
		defaultValues: {
			ProductName: '',
			Description: '',
			BrandId: '',
			ColorId: '',
			Quantity: 0,
			Price: 0,
			HasDiscount: false,
			DiscountPrice: 0,
			SubCategoryId: '',
			Code: '',
			Weight: '',
			Size: ''
		}
	})

	const Update = async () => {
		dispatch(Get_product()).then((data) => {
			setProducts(data?.payload?.products || [])
		})
		const { data } = await API.get("Color/get-colors")
		setColors(data.data)
		dispatch(Get_Brands())
		dispatch(Get_Features())
	}

	useEffect(() => {
		Update()
	}, [])

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
		reset()
		setFileList([])
	}

	const onSubmit = async (data) => {
		const formData = new FormData()

		fileList.forEach(file => {
			formData.append('Images', file.originFileObj)
		})

		Object.keys(data).forEach(key => {
			if (data[key] !== undefined && data[key] !== null) {
				formData.append(key, data[key])
			}
		})

		try {
			await dispatch(Add_product(formData))
			message.success('Product added successfully!')
			handleCancel()
			Update()
		} catch (error) {
			message.error('Error adding product')
		}
	}

	if (product_loading && products.length === 0) {
		return (
			<div className='w-full py-[150px] flex justify-center'>
				<div className='animate-spin size-[100px] rounded-full border-b-2 border-l-2 border-red-500'></div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-900 shadow-lg rounded p-10">
			<Modal
				title="Add New Product"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				width={800}
				className="[&_.ant-modal-content]:bg-white [&_.ant-modal-content]:dark:bg-gray-800 [&_.ant-modal-header]:bg-white [&_.ant-modal-header]:dark:bg-gray-800 [&_.ant-modal-title]:dark:text-white"
				bodyStyle={{
					backgroundColor: 'transparent',
					padding: '20px'
				}}
			>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Product Name *</label>
							<input
								{...register("ProductName", { required: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="Enter product name"
							/>
							{errors.ProductName && <span className="text-red-500 text-sm">Required</span>}
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description *</label>
							<textarea
								{...register("Description", { required: true })}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="Product description"
							/>
							{errors.Description && <span className="text-red-500 text-sm">Required</span>}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Brand *</label>
							<select
								{...register("BrandId", { required: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
							>
								{data_brands.map((brand) => (
									<option key={brand.id} value={brand.id}>{brand.brandName}</option>
								))}
							</select>
							{errors.BrandId && <span className="text-red-500 text-sm">Required</span>}
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Color *</label>
							<select
								{...register("ColorId", { required: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
							>
								{colors.map((color) => (
									<option
										key={color.id}
										value={color.id}
										style={{ backgroundColor: color.colorName === "black" ? "gray" : color.colorName }}
										className="text-black dark:text-white"
									>
										{color.colorName}
									</option>
								))}
							</select>
							{errors.ColorId && <span className="text-red-500 text-sm">Required</span>}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Quantity *</label>
							<input
								type="number"
								{...register("Quantity", { required: true, valueAsNumber: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="0"
								min="0"
							/>
							{errors.Quantity && <span className="text-red-500 text-sm">Required</span>}
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price *</label>
							<input
								type="number"
								step="0.01"
								{...register("Price", { required: true, valueAsNumber: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="0.00"
								min="0"
							/>
							{errors.Price && <span className="text-red-500 text-sm">Required</span>}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="flex items-center">
							<label htmlFor='HasDiscount' className="flex items-center cursor-pointer">
								<input
									id="HasDiscount"
									type="checkbox"
									{...register("HasDiscount")}
									className="mr-2 w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Has Discount</span>
							</label>
						</div>

						{watch("HasDiscount") && (
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Discount Price</label>
								<input
									type="number"
									step="0.01"
									{...register("DiscountPrice", { valueAsNumber: true })}
									className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
									placeholder="0.00"
									min="0"
								/>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">SubCategory *</label>
							<select
								{...register("SubCategoryId", { required: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
							>
								{data_features.map(item => (
									<option key={item.id} value={item.id}>{item.subCategoryName}</option>
								))}
							</select>
							{errors.SubCategoryId && <span className="text-red-500 text-sm">Required</span>}
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Code *</label>
							<input
								{...register("Code", { required: true })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="Product code"
							/>
							{errors.Code && <span className="text-red-500 text-sm">Required</span>}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Weight</label>
							<input
								{...register("Weight")}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="Weight"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Size</label>
							<input
								{...register("Size")}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
								placeholder="Size"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Images *</label>
						<input
							type="file"
							multiple
							onChange={(e) => {
								const files = Array.from(e.target.files)
								setFileList(files.map(file => ({ originFileObj: file })))
							}}
							className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-gray-600 dark:file:text-gray-200"
						/>
					</div>

					<div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
						<button
							type="button"
							onClick={handleCancel}
							className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors mb-2 md:mb-0"
						>
							Cancel
						</button>
						<button
							disabled={add_product}
							type="submit"
							className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
						>
							{add_product && <Loader2 size={16} className='animate-spin'/>}
							Add Product
						</button>
					</div>
				</form>
			</Modal>

			<div className="flex items-center gap-3 mb-8">
				<Package className="text-red-500" size={24} />
				<h2 className="text-red-500 font-medium text-xl">Product Management</h2>
				<span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full ml-auto">
					{products.length} products
				</span>
				<button
					onClick={showModal}
					className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm flex items-center gap-2"
				>
					<Plus size={16} />
					Add Product
				</button>
			</div>

			<Pagination
				showQuickJumper
				showSizeChanger={false}
				current={page}
				total={products.length}
				pageSize={7}
				showLessItems={false}
				onChange={setPage}
				className="mb-6"
			/>

			<Collapse
				accordion
				expandIcon={({ isActive }) =>
					isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />
				}
				expandIconPosition="end"
				className="bg-transparent [&_.ant-collapse-content]:dark:bg-gray-700"
			>
				{products.length > 0 && products?.slice((0 + (7 * (page - 1))), (7 * page)).map((product) => (
					<Panel
						key={product.id}
						header={
							<div className="flex items-center gap-4 p-2">
								{delactive[product.id] && (
									<div className="animate-spin size-[20px] rounded-full border-b-2 border-l-2 border-red-500"></div>
								)}
								<Image
									className="rounded-lg object-cover border-2"
									width={50}
									height={50}
									src={import.meta.env.VITE_API_BASE_URL + "images/" + product.image}
									alt={product.productName}
									fallback="/default-product.png"
								/>
								<div className="flex-1">
									<h4 className="font-medium text-gray-900 dark:text-white">
										{product.productName}
									</h4>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{product.categoryName}
									</p>
								</div>
								<div className="flex flex-col items-end">
									<span className="text-lg font-bold text-red-500">
										${product.hasDiscount ? product.discountPrice : product.price}
									</span>
									{product.hasDiscount && (
										<span className="text-sm text-gray-500 line-through">
											${product.price}
										</span>
									)}
								</div>
							</div>
						}
						className="mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
					>
						<div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Product ID
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{product.id}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Category
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{product.categoryName}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Color
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{product.color}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Quantity
									</label>
									<p className="text-sm text-gray-900 dark:text-white">{product.quantity} units</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Price
									</label>
									<p className="text-sm text-gray-900 dark:text-white">
										${product.price} {product.hasDiscount && `→ $${product.discountPrice}`}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
										Status
									</label>
									<p className="text-sm text-gray-900 dark:text-white">
										{product.hasDiscount ? 'On Sale' : 'Regular Price'}
									</p>
								</div>
							</div>

							<div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
								<button
									disabled={del_product}
									onClick={async () => dispatch(Del_product(product.id)).then(() => Update())}
									className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors text-sm flex items-center gap-2"
								>
									{del_product && <Loader size={16} className="animate-spin" />}
									<Trash2 size={16} />
									Delete
								</button>

								<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm flex items-center gap-2">
									<Plus size={16} />
									Add Images
								</button>
							</div>
						</div>
					</Panel>
				))}
			</Collapse>

			{products.length === 0 && (
				<div className="text-center py-12">
					<Package size={48} className="mx-auto text-gray-400 mb-4" />
					<p className="text-gray-500 dark:text-gray-400">No products found</p>
				</div>
			)}
		</div>
	)
}

export default AdminProducts