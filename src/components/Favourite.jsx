import { Empty } from 'antd'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Account, Favorite } from '../jotai/Acc'
import { Add_to_Cart, Get_product } from '../redux/Api'
import { ProductCard } from './Home'
import { LoadingOutlined } from '@ant-design/icons'

const Favourite = () => {
	const [fav, setFav] = useAtom(Favorite)
	const { data_products, product_loading, add_to_cart_loading, error } = useSelector(state => state.Market)
	const dispatch = useDispatch()
	const [acc] = useAtom(Account)
	const navigate = useNavigate()

	useEffect(() => {
		!acc && navigate("/login")
	}, [fav])

	useEffect(() => {
		dispatch(Get_product())
	}, [])

	const handleAddAll = () => {
		fav?.forEach(item => {
			data_products?.products?.some(items => items.id === item.id && !items.productInMyCart) && dispatch(Add_to_Cart(item.id))
		}
		)
	}

	const filteredProducts = useMemo(() => {
		return data_products?.products?.filter((item) =>
			fav?.some(sd => sd.id === item.id)
		) || []
	}, [data_products, fav])

	if (!fav) {
		navigate("/login")
	}

	if (error) {
		return <div className='flex justify-center items-center h-screen text-[100px] bg-white dark:bg-black text-black dark:text-white'>{error === "Network Error" ? <p className='font-semibold'>Network <span className='text-red-500'>Error</span></p> : error == "Request failed with status code 401" ? <p className='font-semibold'>Change to login</p> : <p className='font-semibold'>Something <span className='text-red-500'>went</span> wrong {error} </p>}</div>
	}

	return (
		<div className='bg-white dark:bg-black min-h-screen transition-colors duration-300'>
			<section className='my-16 pt-8'>
				<div className='md:px-4 px-[10%] flex flex-col items-start w-full'>
					<div className='mt-6 md:mt-[24px] w-full flex gap-4 md:gap-0 md:flex-col'>
						<p className='md:text-[20px] text-[30px] font-semibold text-black dark:text-white'>
							Wishlist ({fav?.length > 0 ? fav.length :
								<span className='md:text-[10px] inline text-[20px] font-semibold text-gray-500 dark:text-gray-400'>No favourites</span>
							})
						</p>

						<button
							disabled={fav?.length <= 0 || add_to_cart_loading}
							onClick={handleAddAll}
							className='py-4 md:py-2 font-medium md:px-[32px] ml-auto md:ml-0 md:mt-4 px-[48px] border border-black dark:border-white rounded text-black dark:text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300'
						>
							{add_to_cart_loading && <LoadingOutlined spin />}
							Move All To Bag
						</button>
					</div>

					<br />
					{fav?.length > 0 ?
						<Swiper
							modules={[Navigation]}
							navigation={{
								prevEl: '.prod_prev',
								nextEl: '.prod_next',
							}}
							loop={true}
							spaceBetween={16}
							breakpoints={{
								640: { slidesPerView: 1 },
								768: { slidesPerView: 2 },
								1024: { slidesPerView: 3 },
								1280: { slidesPerView: 4 },
							}}
							className='w-full'
						>
							{filteredProducts.map((product) => (
								<SwiperSlide key={product.id}>
									<ProductCard product={product} />
								</SwiperSlide>
							))}
						</Swiper> :
						<div className='flex justify-center items-center w-full border-2 border-black dark:border-gray-700 rounded-md py-16'>
							<Empty
								className='m-auto'
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span className='text-black dark:text-white'>No Favourites</span>}
							/>
						</div>
					}
				</div>
			</section>

			<section className='my-16'>
				<div className='md:px-4 px-[10%] flex flex-col items-start w-full'>
					<div className='mt-6 md:mt-[24px] w-full flex gap-4 md:gap-0 md:flex-col'>
						<div className='flex items-center gap-2'>
							<div className='w-5 h-10 rounded-md bg-[#DB4444]' />
							<p className='md:text-[20px] text-[30px] font-medium text-black dark:text-white'>Just For You</p>
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
						modules={[Navigation]}
						navigation={{
							prevEl: '.prod_prev',
							nextEl: '.prod_next',
						}}
						loop={true}
						spaceBetween={16}
						breakpoints={{
							640: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
							1280: { slidesPerView: 4 },
						}}
						className='w-full'
					>
						{data_products?.products?.filter(item => {
							const rand = Math.ceil(Math.random() * 1)
							return rand ? true : false
						}).filter((item) => !fav?.some(sd => sd.id === item.id)).map((product, ind) => (
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

export default Favourite