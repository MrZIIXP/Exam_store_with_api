import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/swiper-bundle.css"
import { Image } from 'antd'
import { HeartFilled, HeartOutlined, LoadingOutlined } from '@ant-design/icons'
import { RefreshCcw, Truck } from 'lucide-react'
import { MinCard, ProductCard } from './Home'
import { useDispatch, useSelector } from 'react-redux'
import { _toggle_favourite, Add_to_Cart, Decriment_into_Cart, Delete_from_Cart, Get_Cart, Get_product, Get_product_by_id, Increment_into_Cart } from '../redux/Api'

const By_Id = () => {
	const { id } = useParams()
	const dispatch = useDispatch()
	const { product_loading, favourite: fav, account: acc, increment_loading, decrement_loading, add_to_cart_loading, error, data_products } = useSelector(state => state.Market)
	const [favorite, setFavorite] = useState(false)
	const [selectedColor, setSelectedColor] = useState('')
	const [selectedImage, setSelectedImage] = useState('')
	const [filtered, setFiltered] = useState([])
	const [width, setWidth] = useState(window.innerWidth)
	const [data_product_by_id, setDataProductById] = useState(null)

	const Updating = async () => {
		dispatch(Get_product_by_id(id.split("!")[1])).then((item) => { setDataProductById(item.payload), console.log(item.payload) })
		if (acc) {
			dispatch(Get_Cart())
		}
	}

	const filterProducts = () => {
		if (data_products.products) {
			return [...data_products.products].filter(item => {
				const random = Math.ceil(Math.random() * 1)
				return random == 1 ? true : false
			})
		}
	}

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
		Updating()
		if (data_products.length <= 0) {
			dispatch(Get_product())
		}
		const handleResize = () => setWidth(window.innerWidth)
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [id])

	useEffect(() => {
		if (data_product_by_id) {
			const firstImage = data_product_by_id.images?.[0]?.images || ''
			setSelectedImage(firstImage)
			const isFavorite = fav.some(item => item.id === data_product_by_id.id)
			setFavorite(isFavorite)
			const filter = filterProducts()
			setFiltered(filter)
		}
	}, [data_product_by_id, fav])

	const handleToggleFavorite = () => {
		if (!data_product_by_id) return
		const isFavorite = fav.some(item => item.id === data_product_by_id.id)
		dispatch(_toggle_favourite({ id: data_product_by_id.id, productName: data_product_by_id.productName, fav: isFavorite }))
		setFavorite(!isFavorite)
	}

	if (product_loading && !data_product_by_id || !data_product_by_id) {
		return <div className='flex justify-center items-center h-screen text-[100px] bg-white dark:bg-black text-black dark:text-white'>Loading...</div>
	}

	if (error) {
		return <div className='flex justify-center items-center h-screen text-[100px] bg-white dark:bg-black'>
			{error === "Network Error" ? <p className='font-semibold text-black dark:text-white'>Network <span className='text-red-500'>Error</span></p> : <p className='font-semibold text-black dark:text-white'>Something <span className='text-red-500'>went</span> wrong</p>}
		</div>
	}

	if (!data_product_by_id) {
		return <div className='text-center py-20 bg-white dark:bg-black text-black dark:text-white'>Product not found</div>
	}

	return (
		<div className='min-h-screen bg-white dark:bg-black transition-colors duration-300'>
			<section className='px-[10%] md:px-5 md:flex-col py-[60px]'>
				<p className='text-gray-500 dark:text-gray-400 font-semibold'>
					<Link to="/" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Home</Link> / <Link to="/products" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Products</Link> / <span className='text-black dark:text-white'>{data_product_by_id?.productName}</span>
				</p>
				<br />

				<div className="flex gap-[30px] h-[600px] md:flex-col md:gap-3 md:h-auto">
					{data_product_by_id?.images?.length > 0 && (
						<Swiper
							className='w-[170px] z-10 md:w-full h-auto'
							slidesPerView={4}
							direction={width < 1023 ? 'horizontal' : 'vertical'}
						>
							{data_product_by_id?.images?.map((img, ind) => (
								<SwiperSlide
									onClick={() => setSelectedImage(img.images)}
									key={ind}
									className='bg-gray-200'
								>
									<div className='w-full flex items-center h-full'>
										<img
											src={import.meta.env.VITE_API_BASE_URL + "images/" + img.images}
											onError={(e) => { e.target.src = '/images/image.png' }}
											alt=""
											className='w-full mix-blend-multiply object-contain h-full'
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					)}

					<div className='md:w-full w-[500px] justify-center bg-gray-200 md:-order-1 flex items-center'>
						<Image
							src={import.meta.env.VITE_API_BASE_URL + "images/" + selectedImage}
							fallback='/images/image.png'
							width={"100%"}
							height={"100%"}
							className='object-contain mix-blend-multiply'
							alt={data_product_by_id?.productName}
						/>
					</div>

					<div className='w-[400px] md:w-full md:ml-0 ml-auto flex flex-col gap-3'>
						<h1 className='text-[24px] font-medium text-black dark:text-white'>{data_product_by_id?.productName}</h1>
						<div className='flex gap-4 items-center'>
							<span className='text-gray-500 dark:text-gray-400 flex gap-4 items-center'>
								| {!data_product_by_id?.hasDiscount ? (
									<p className='text-green-500'>New</p>
								) : (
									<p className='px-[10px] py-[5px] rounded-md text-white bg-red-500'>
										-${data_product_by_id?.discountPrice}
									</p>
								)}
							</span>
						</div>

						<div className='flex gap-4 items-center'>
							<h1 className='text-[24px] font-bold text-black dark:text-white'>${Number(data_product_by_id?.price).toFixed(2)}</h1>
							{data_product_by_id?.hasDiscount && <p className='text-gray-500 dark:text-gray-400 line-through'>${data_product_by_id?.price - data_product_by_id?.discountPrice}</p>}
						</div>

						<p className='text-gray-500 dark:text-gray-400'>{data_product_by_id?.description || "No description"}</p>
						<hr className='border-gray-300 dark:border-gray-700' />

						{data_product_by_id?.color && (
							<div className='flex gap-4 items-center'>
								<p className='text-[20px] text-gray-500 dark:text-gray-400'>Color: </p>
								<div className='flex gap-2'>
									<label
										onClick={() => setSelectedColor(data_product_by_id?.color)}
										className="relative border-black dark:border-white border-2 rounded-full w-5 h-5 cursor-pointer"
									>
										<div
											className="w-full bg-inherit h-full rounded-full"
											style={{ borderColor: data_product_by_id?.color, borderWidth: "3px" }}
										/>
										<div
											className="absolute inset-[4px] rounded-full transition-opacity pointer-events-none"
											style={{
												backgroundColor: data_product_by_id?.color,
												opacity: selectedColor === data_product_by_id?.color ? 1 : 0,
											}}
										/>
									</label>
								</div>
							</div>
						)}

						{acc && <div className='flex gap-4 items-center'>
							{data_product_by_id?.productInMyCart &&
								<div className='flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg'>
									<button
										disabled={data_product_by_id?.productInfoFromCart?.quantity <= 1 || decrement_loading}
										onClick={() => { data_product_by_id?.productInfoFromCart?.quantity > 1 && dispatch(Decriment_into_Cart(data_product_by_id?.productInfoFromCart?.id)).then(() => { Updating() }) }}
										className={'flex items-center relative z-40 justify-center group rounded-l-lg active:bg-red-500 size-[30px] py-6 border-r-2 border-gray-300 dark:border-gray-700'}
									>
										{decrement_loading ? <LoadingOutlined spin /> : <div className='w-4 h-[2px] bg-black dark:bg-white group-active:bg-white' />}
									</button>
									<p className='px-[20px] text-black dark:text-white'>{data_product_by_id?.productInfoFromCart?.quantity}</p>
									<button
										disabled={increment_loading}
										onClick={() => { dispatch(Increment_into_Cart(data_product_by_id?.productInfoFromCart?.id)).then(() => { Updating() }) }}
										className='flex items-center justify-center z-40 size-[30px] active:bg-red-500 rounded-r-lg group active:text-white py-6 border-l-2 border-gray-300 dark:border-gray-700 relative'
									>
										{
											increment_loading ? <LoadingOutlined spin /> : <>
												<div className='w-[2px] absolute h-4 group-active:bg-white bg-black dark:bg-white' />
												<div className='w-4 h-[2px] group-active:bg-white bg-black dark:bg-white' />
											</>
										}
									</button>
								</div>
							}
							{!data_product_by_id?.productInMyCart ? <MinCard
								className='w-full py-3 text-center bg-[#db4444] hover:bg-red-600 text-white rounded-md transition-colors duration-300'
								button={"Add to cart"}
								text={"Added to bag"}
								func={() => dispatch(Add_to_Cart(data_product_by_id.id)).then(() => { Updating() })}
							/> : <MinCard
								className='w-full py-3 text-center bg-[#db4444] hover:bg-red-600 text-white rounded-md transition-colors duration-300'
								button={add_to_cart_loading ? <LoadingOutlined spin /> : "Delete from cart"}
								text={"Deleted from bag"}
								func={() => { dispatch(Delete_from_Cart(data_product_by_id?.productInfoFromCart?.id)).then(() => { Updating(), console.log(data_product_by_id?.productInfoFromCart) }) }}
							/>}

							<button
								className={`${favorite ? "bg-black dark:bg-white" : ""} size-12 rounded-lg px-[20px] flex justify-center items-center border border-black dark:border-white text-[20px] text-black dark:text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300`}
								onClick={handleToggleFavorite}
							>
								{favorite ? <HeartFilled className='text-red-500' /> : <HeartOutlined />}
							</button>
						</div>}

						<div className="flex flex-col border-2 rounded-md border-black dark:border-gray-700 mt-auto w-full">
							<div className="p-5 flex gap-4 pr-[20px] border-b-2 border-black dark:border-gray-700 items-center">
								<Truck className='size-[40px] text-black dark:text-white' />
								<div className="grid w-full">
									<h1 className="text-1xl font-semibold text-black dark:text-white">Free Delivery</h1>
									<p className="font-medium text-sm text-gray-600 dark:text-gray-400">Enter your postal code for Delivery Availability</p>
								</div>
							</div>
							<div className="p-5 flex gap-4 pr-[20px] border-black dark:border-gray-700 items-center">
								<RefreshCcw className='size-[40px] text-black dark:text-white' />
								<div className="grid w-full">
									<h1 className="text-1xl font-semibold text-black dark:text-white">Return Delivery</h1>
									<p className="font-medium text-sm text-gray-600 dark:text-gray-400">Free 30 Days Delivery Returns. <span className='underline cursor-pointer text-red-500 dark:text-red-400'>Details</span></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='my-[50px] bg-white dark:bg-black transition-colors duration-300'>
				<div className='md:px-4 px-[10%] flex flex-col items-start w-full'>
					<div className='mt-6 md:mt-[24px] w-full flex gap-4 md:gap-0 md:flex-col'>
						<div className='flex items-center gap-2 text-[#DB4444]'>
							<div className='w-5 h-10 rounded-md bg-[#DB4444]' />
							<p className='md:text-[20px] text-[30px] font-medium'>Related Item ({Number(filtered?.length) - 1})</p>
						</div>

						<Link
							to="/products"
							className='py-4 md:py-2 font-medium md:px-[32px] ml-auto md:ml-0 md:mt-4 px-[48px] border border-black dark:border-white text-black dark:text-white rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300'
						>
							See all
						</Link>
					</div>

					<br />
					<Swiper
						spaceBetween={16}
						breakpoints={{
							640: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
							1280: { slidesPerView: 4 },
						}}
						className='w-full'
					>
						{filtered?.filter(product => product.id !== data_product_by_id.id).map((product, ind) => (
							<SwiperSlide key={ind}>
								<ProductCard product={product} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</section>
		</div>
	)
}

export default By_Id