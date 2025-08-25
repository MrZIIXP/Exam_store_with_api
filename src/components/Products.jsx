import React, { useEffect, useMemo, useState } from 'react'
import { ProductCard } from './Home'
import { Collapse, Slider, Rate, Select, Drawer, Input } from 'antd'
import { Link } from 'react-router-dom'
import { ArrowUpOutlined } from '@ant-design/icons'
import { LucideFilter, LucideMenu, LucideSearch } from 'lucide-react'
import { useAtom } from 'jotai'
import { useDispatch, useSelector } from 'react-redux'
import { _set_brand, Get_Brands, Get_Category, Get_Features, Get_product } from '../redux/Api'

const { Panel } = Collapse

const FilterSidebar = ({ filters, setFilters }) => {
	const red = '#ef4444'
	const { data_category, data_features, data_brands } = useSelector((state) => state.Market)
	const [min, setMin] = useState(0)
	const [max, setMax] = useState(40000)
	const dispatch = useDispatch()
	const [catal, setCatal] = useState("")
	const [brand, setBrand] = useState("")
	const [feat, setFeat] = useState("")

	useEffect(() => {
		if (data_brands.length === 0) {
			dispatch(Get_Brands())
		}
		if (data_category.length === 0) {
			dispatch(Get_Category())
		}
		if (data_features.length === 0) {
			dispatch(Get_Features())
		}
	}, [data_brands, data_features, data_category])

	const handleCategoryChange = (checkedValues) => {
		setFilters({ ...filters, categories: checkedValues })
	}

	const handleBrandChange = (checkedValues) => {
		setFilters({ ...filters, brands: checkedValues })
	}

	const handleFeatureChange = (checkedValues) => {
		setFilters({ ...filters, features: checkedValues })
	}

	const handleNewChange = (e) => {
		setFilters({ ...filters, condition: e.target.value })
	}

	const handleRatingChange = (checkedValues) => {
		setFilters({ ...filters, ratings: checkedValues })
	}

	return (
		<div className="w-[230px] pb-7 min-h-[1300px] dark:rounded-lg sticky top-[100px] pr-4 bg-white dark:bg-gray-900 overflow-y-hidden transition-colors duration-300">
			<Collapse
				defaultActiveKey={['1', '2', '3', '4', '5', '6']}
				expandIconPosition="end"
				className="bg-white dark:bg-gray-900"
				ghost
			>
				<Panel className='border-t dark:border-gray-800' style={{ borderRadius: '0px' }} header={<span className="text-[#111827] dark:text-white font-bold">Category</span>} key="1">
					{data_category.length > 8 && <Input className='mb-5 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700' onInput={(e) => setCatal(e.target.value)} />}
					<div style={{ scrollbarColor: "transparent transparent" }} className="flex flex-col max-h-[300px] overflow-y-auto gap-3 text-[#374151] dark:text-gray-400">
						{data_category.filter(item => catal.toLowerCase().split(" ").some(word => item.categoryName.toLowerCase().includes(word))).map((label) => {
							const value = label.categoryName.toLowerCase()
							const isChecked = filters.categories.includes(value)

							return (
								<label key={label.id} className="flex items-center gap-3 cursor-pointer group">
									<button onClick={() => handleCategoryChange(
										isChecked
											? filters.categories.filter(cat => cat !== value)
											: [...filters.categories, value]
									)} className={`${isChecked ? 'text-red-500 font-medium' : 'text-gray-700 dark:text-gray-300'} transition-colors text-nowrap duration-300`}>
										{label.categoryName}
									</button>
								</label>
							)
						})}
					</div>
				</Panel>

				<Panel className='border-t dark:border-gray-800' style={{ borderRadius: '0px' }} header={<span className="text-[#111827] dark:text-white font-bold">Brands</span>} key="2">
					{data_brands.length > 7 && <Input className='mb-5 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700' onInput={(e) => setBrand(e.target.value)} />}
					<div style={{ scrollbarColor: "transparent transparent" }} className={`flex max-h-[300px] overflow-y-auto flex-col gap-3 text-[#374151] dark:text-gray-400`}>
						{data_brands.filter(brands => brand.toLowerCase().split(" ").some(word => brands.brandName.toLowerCase().includes(word))).map((label) => {
							const value = label.brandName.toLowerCase()
							const isChecked = filters.brands.includes(value)

							return (
								<label key={label.id} className="flex items-center gap-3 cursor-pointer group">
									<div className={`relative h-5 w-5 rounded border-2 transition-all 
                    ${isChecked ? 'bg-red-500 border-red-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-red-300'}`}>
										{isChecked && (
											<svg className="absolute inset-0 m-auto h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
										)}
									</div>
									<span className={`${isChecked ? 'text-red-500 font-medium' : 'text-gray-700 dark:text-gray-300'} transition-colors duration-300`}>
										{label.brandName}
									</span>
									<input
										type="checkbox"
										className="opacity-0 absolute"
										checked={isChecked}
										onChange={() => handleBrandChange(
											isChecked
												? filters.brands.filter(brand => brand !== value)
												: [...filters.brands, value]
										)}
									/>
								</label>
							)
						})}
					</div>
				</Panel>

				<Panel className='border-t dark:border-gray-800' style={{ borderRadius: '0px' }} header={<span className="text-[#111827] dark:text-white font-bold">Features</span>} key="3">
					{data_features.length > 7 && <Input className='mb-5 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700' onInput={(e) => setFeat(e.target.value)} />}
					<div style={{ scrollbarColor: "transparent transparent" }} className="flex overflow-y-auto flex-col gap-3 max-h-[300px] text-[#374151] dark:text-gray-400">
						{data_features.filter(feature => feat.toLowerCase().split(" ").some(word => feature.subCategoryName.toLowerCase().includes(word))).map((label) => {
							const value = label.subCategoryName.toLowerCase()
							const isChecked = filters.features.includes(value)

							return (
								<label key={label.id} className="flex pl-2 items-center gap-3 cursor-pointer group">
									<input
										type="checkbox"
										className="scale-150 accent-red-500"
										checked={isChecked}
										onChange={() => handleFeatureChange(
											isChecked
												? filters.features.filter(feat => feat !== value)
												: [...filters.features, value]
										)}
									/>
									<span className={`${isChecked ? 'text-red-500 font-medium' : 'text-gray-700 dark:text-gray-300'} transition-colors duration-300`}>
										{label.subCategoryName}
									</span>
								</label>
							)
						})}
					</div>
				</Panel>

				<Panel className='border-t dark:border-gray-800' style={{ borderRadius: '0px' }} header={<span className="text-[#111827] dark:text-white font-bold">Price Range</span>} key="4">
					<Slider
						range
						value={[min, max]}
						onChange={(value) => { setMin(value[0]); setMax(value[1]) }}
						min={0}
						max={40000}
						trackStyle={[{ backgroundColor: red }]}
						handleStyle={[{ borderColor: red }, { borderColor: red }]}
					/>
					<div className='flex gap-2 mt-4'>
						<input
							type="number"
							placeholder='Min'
							value={min}
							onChange={(e) => { setMin(e.target.value) }}
							className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
							min={0}
						/>
						<input
							type="number"
							placeholder='Max'
							value={max}
							onChange={(e) => { setMax(e.target.value) }}
							className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
							max={100}
						/>
					</div>
					<button onClick={() => setFilters({ ...filters, priceRange: [min, max] })} className='w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mt-4 transition-colors duration-300'>Apply</button>
				</Panel>

				<Panel className='border-t dark:border-gray-800' style={{ borderRadius: '0px' }} header={<span className="text-[#111827] dark:text-white font-bold">Condition</span>} key="5">
					<div className="flex flex-col gap-3 text-[#374151] dark:text-gray-400">
						{['Any', 'New', 'Old'].map((label) => {
							const value = label.toLowerCase()
							const isSelected = filters.new === value

							return (
								<label key={label} onClick={() => handleNewChange({ target: { value } })} className="flex items-center gap-3 cursor-pointer group">
									<div className={`relative h-5 w-5 rounded-full border-2 transition-all 
                    ${isSelected ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-red-300'}`}>
										{isSelected && (
											<div className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-red-500" />
										)}
									</div>
									<span className={`${isSelected ? 'text-red-500 font-medium' : 'text-gray-700 dark:text-gray-300'} transition-colors duration-300`}>
										{label}
									</span>
								</label>
							)
						})}
					</div>
				</Panel>
			</Collapse>
		</div>
	)
}

const Products = () => {
	const { set_brand, set_category, set_feature, loading, error, data_products } = useSelector(state => state.Market)
	const dispatch = useDispatch()
	const [filters, setFilters] = useState({
		categories: [],
		brands: [],
		features: [],
		priceRange: [0, 40000],
		condition: 'any',
		ratings: [],
		search: '',
		sort: ''
	})

	useEffect(() => {
		dispatch(Get_product())
	}, [])

	const [open, setOpen] = useState(false)
	const [wind, setWind] = useState(0)
	const [page, setPage] = useState(wind < 1023 ? 4 : 2)
	useEffect(() => {
		setWind(window.screen.width)
	}, [window.screen.width])

	useEffect(() => {
		if (set_brand) {
			setFilters(prev => ({
				...prev,
				brands: [...prev.brands, set_brand.toLowerCase()]
			}))
		}
		if (set_category) {
			setFilters(prev => ({
				...prev,
				categories: [...prev.categories, set_category.toLowerCase()]
			}))
		}
		if (set_feature) {
			setFilters(prev => ({
				...prev,
				features: [...prev.features, set_feature.toLowerCase()]
			}))
		}
	}, [set_brand, set_category, set_feature])

	const filteredProducts = useMemo(() => {
		if (!data_products.products) return []

		return data_products?.products?.filter(product => {
			if (filters.categories.length > 0 &&
				!filters.categories.includes(product.categoryName.toLowerCase())) {
				return false
			}

			if (product.price < filters.priceRange[0] ||
				product.price > filters.priceRange[1]) {
				return false
			}

			if (filters.condition !== 'any') {
				if (filters.condition === 'new' && product.hasDiscount) return false
				if (filters.condition === 'old' && !product.hasDiscount) return false
			}
			return true
		})
			.sort((a, b) => {
				switch (filters.search) {
					case 'price':
						return a.price - b.price
					case 'new':
						return (b.hasDiscount ? 0 : 1) - (a.hasDiscount ? 0 : 1)
					case 'popular':
					default:
						return b.quantity - a.quantity
				}
			})
	}, [data_products, filters])

	if (loading) {
		return <div className='text-[100px] h-screen flex justify-center items-center bg-white dark:bg-black text-black dark:text-white'>Loading....</div>
	}
	if (error) {
		return <div className='text-[100px] h-screen flex justify-center items-center bg-white dark:bg-black text-black dark:text-white'>{error}</div>
	}

	return (
		<div className='bg-white dark:bg-black transition-colors duration-300 min-h-screen'>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				className="dark:bg-gray-900"
				styles={{
					body: {
						backgroundColor: 'var(--ant-color-bg-container)',
						color: 'var(--ant-color-text)'
					}
				}}
			>
				<p className='text-[30px] text-black dark:text-white'>Filters</p>
				<FilterSidebar filters={filters} setFilters={setFilters} />
			</Drawer>

			<div className='flex md:flex-col gap-3 justify-between items-center md:items-start px-[7%] pt-[60px] pb-[40px] bg-white dark:bg-black transition-colors duration-300'>
				<h1 className='text-gray-500 dark:text-gray-400'>
					<Link to="/" className='hover:underline text-gray-500 dark:text-gray-400'>Home</Link> / <span className='text-black dark:text-white hover:underline'>Explore Our Products</span>
				</h1>
				<div className='relative w-full max-w-[300px] ml-auto md:ml-0 flex items-center'>
					<input
						type="text"
						placeholder='Search products...'
						onChange={e => setFilters({ ...filters, sort: e.target.value })}
						className="w-full placeholder-black dark:placeholder-white text-black dark:text-white border-black dark:border-white py-2 md:py-4 px-3 border rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
					/>
					<LucideSearch className='absolute right-3 text-black dark:text-white' />
				</div>
				<div className='flex md:w-full gap-2'>
					<Select
						className='w-[120px] md:w-1/2 ml-auto md:ml-0 text-bold'
						size='large'
						onChange={value => { setFilters({ ...filters, search: value }) }}
						value={filters.search || "popular"}
						suffixIcon={<LucideMenu className="text-black dark:text-white" />}
						options={[{ value: "popular", label: "Popular" }, { value: "new", label: "New" }, { value: "price", label: "Lowerest Price" }]}
						popupClassName="dark:bg-gray-800"
					/>
					<button className='hidden md:flex border border-gray-300 dark:border-gray-700 rounded-lg justify-center items-center px-2 gap-2 w-1/2 text-bold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300' onClick={() => setOpen(true)}>
						Filter <LucideFilter className='text-gray-300 dark:text-gray-600 ml-auto' />
					</button>
				</div>
				<div className='flex-wrap gap-3 hidden md:flex'>
					{filters.categories.length > 0 && filters.categories.map(item => <button onClick={() => setFilters({ ...filters, categories: filters.categories.filter(cat => cat !== item) })} className='px-3 py-1 flex gap-4 border border-red-400 text-red-400 rounded-lg text-bold hover:bg-red-400 hover:text-white transition-colors duration-300'>{item} <p>х</p></button>)}
					{filters.brands.length > 0 && filters.brands.map(item => <button onClick={() => setFilters({ ...filters, brands: filters.brands.filter(brand => brand !== item) })} className='px-3 py-1 border flex gap-4 border-red-400 rounded-lg text-bold text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-300'>{item} <p>х</p></button>)}
					{filters.features.length > 0 && filters.features.map(item => <button onClick={() => setFilters({ ...filters, features: filters.features.filter(feat => feat !== item) })} className='px-3 py-1 border flex gap-4 border-red-400 rounded-lg text-bold text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-300'>{item} <p>х</p></button>)}
				</div>
			</div>

			<div className='flex px-[5%] md:px-5 bg-white dark:bg-black transition-colors duration-300'>
				<div className='md:hidden pb-32'>
					<FilterSidebar
						filters={filters}
						setFilters={setFilters}
					/>
				</div>
				<div className='w-full m-5 mb-20 md:m-0 flex flex-col items-center'>
					<div className='grid grid-cols-3 md:grid-cols-1 gap-5 w-full'>
						{filteredProducts.filter(item => item.productName.toLowerCase().includes(filters?.sort?.toLowerCase().trim()) || filters?.sort?.toLowerCase().trim().split(" ").some(filt => item.categoryName.toLowerCase().includes(filt))).map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</div>

			{page > 4 && <button className='size-[70px] bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-full sticky bottom-10 mb-10 ml-auto right-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-300' onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}><ArrowUpOutlined /></button>}
		</div>
	)
}

export default Products