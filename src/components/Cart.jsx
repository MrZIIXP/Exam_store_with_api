import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Decriment_into_Cart, Delete_All_from_Cart, Delete_from_Cart, Get_Cart, Increment_into_Cart } from '../redux/Api'
import { LoadingOutlined } from '@ant-design/icons'
import { RotateCcw, Trash2 } from 'lucide-react'

const Cart = () => {
	const navigate = useNavigate()
	const { error, cart_loading, account: acc, increment_loading, decrement_loading, delete_loading, delete_all_loading } = useSelector(state => state.Market)
	const dispatch = useDispatch()
	const [price_loaded, setRices] = useState({})
	const [dels_loaded, setDels] = useState({})
	const [data, setData] = useState([])

	useEffect(() => {
		if (!acc) {
			navigate("/login")
		}
	}, [])

	const Updating = async () => {
		try {
			const dataa = await dispatch(Get_Cart())
			setData(dataa?.payload[0])
			console.log(data)
		} finally {
		}
	}

	useEffect(() => {
		Updating()
	}, [])

	if (error) {
		return <div className='flex justify-center items-center h-screen text-[100px] bg-white dark:bg-black text-black dark:text-white'>{error === "Network Error" ? <p className='font-semibold'>Network <span className='text-red-500'>Error</span></p> : error == "Request failed with status code 401" ? <p className='font-semibold'>Change to login</p> : <p className='font-semibold'>Something <span className='text-red-500'>went</span> wrong {error} </p>}</div>
	}

	return (
		<div className='min-h-screen bg-white dark:bg-black transition-colors duration-300'>

			<section className='px-[10%] md:px-5 md:flex-col py-[60px]'>
				<p className='text-gray-500 dark:text-gray-400 font-semibold'>
					<Link to="/" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Home</Link> / <span className='text-black dark:text-white'>Cart</span>
				</p>
				<br /><br />

				<div className='flex flex-col w-full'>
					<div className="py-8 w-full md:hidden flex justify-between">
						<p className="text-gray-500 dark:text-gray-400 min-w-[240px]">Product</p>
						<p className="text-gray-500 dark:text-gray-400">Price</p>
						<p className="text-gray-500 dark:text-gray-400">Quantity</p>
						<p className="text-gray-500 dark:text-gray-400 min-w-[125px]">Subtotal</p>
					</div>

					<div className="w-full flex flex-col gap-2">
						{!cart_loading || data?.productsInCart?.length > 0 ? data && data?.productsInCart?.length > 0 ? (
							data.productsInCart.map((item) => (
								<div
									onClick={() => navigate("/products/" + item.product.productName.replaceAll(" ", "&") + "!" + item.product.id)}
									key={item.id}
									className='flex items-center relative shadow-md dark:shadow-gray-800 rounded-lg transition-all hover:scale-[1.02] duration-300 hover:shadow-xl dark:hover:shadow-gray-700 justify-between px-8 py-5 bg-white dark:bg-gray-900'
								>
									<div className="flex justify-between md:items-start items-center md:flex-col w-full pr-[40px]">
										<div className="flex gap-5 items-center md:items-start md:flex-col">
											<img
												src={import.meta.env.VITE_API_BASE_URL + "images/" + item.product.image}
												alt=""
												className="size-[54px] md:size-[60px] object-contain"
												onError={(e) => { e.target.src = '/placeholder-image.png' }}
											/>
											<h1 className='text-black dark:text-white'>{item.product.productName || 'No title'}</h1>
										</div>
										<h1 className='text-black dark:text-white'>${item.product.price || 0}</h1>
									</div>

									<div className="flex justify-between md:items-end md:max-w-[116px] w-full md:flex-col md:pl-0 pl-[175px]">
										<div onClick={(e) => e.stopPropagation()} className='flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg'>
											<button
												disabled={item.quantity <= 1 || decrement_loading}
												onClick={() => {
													item.quantity > 1 && dispatch(Decriment_into_Cart(item.id)).then(() => {
														Updating()
														setRices(prev => {
															const newState = { ...prev }
															delete newState[item.product.id]
															return newState
														})
													}), item.quantity > 1 && setRices({ ...price_loaded, [item.product.id]: true })
												}}
												className={'flex items-center relative z-40 justify-center group rounded-l-lg active:bg-red-500 size-[30px] py-6 border-r-2 border-gray-300 dark:border-gray-700'}
											>
												{decrement_loading && price_loaded[item.product.id] ? <LoadingOutlined spin /> : <div className='w-4 h-[2px] bg-black dark:bg-white group-active:bg-white' />}
											</button>
											<p className='px-[20px] text-black dark:text-white'>{item.quantity}</p>
											<button
												disabled={increment_loading}
												onClick={() => {
													dispatch(Increment_into_Cart(item.id)).then(() => {
														Updating()
														setRices(prev => {
															const newState = { ...prev }
															delete newState[item.id]
															return newState
														})
													}), setRices({ ...price_loaded, [item.id]: true })
												}}
												className='flex items-center justify-center z-40 size-[30px] active:bg-red-500 rounded-r-lg group active:text-white py-6 border-l-2 border-gray-300 dark:border-gray-700 relative'
											>{
													increment_loading && price_loaded[item.id] ? <LoadingOutlined spin /> : <>
														<div className='w-[2px] absolute h-4 group-active:bg-white bg-black dark:bg-white' />
														<div className='w-4 h-[2px] group-active:bg-white bg-black dark:bg-white' />
													</>
												}
											</button>
										</div>
										<div className='flex items-center gap-3 py-3'>
											<b className='text-black dark:text-white'>${(item.product.price || 0) * (item.quantity || 1)}</b>
											<button
												onClick={(e) => {
													e.stopPropagation()
													setDels({ ...dels_loaded, [item.product.id]: true })
													!delete_loading && dispatch(Delete_from_Cart(item.id)).then(() => { Updating(), delete dels_loaded[item.product.id] })
												}}
												className='hidden size-5 md:flex items-center justify-center rounded-full hover:scale-125 transition-all duration-300 text-white bg-red-500 hover:bg-red-600'
											>
												{delete_loading && dels_loaded[item.product.id] ? <LoadingOutlined spin /> : "X"}
											</button>
										</div>
									</div>

									<button
										onClick={(e) => {
											e.stopPropagation()
											setDels({ ...dels_loaded, [item.product.id]: true })
											!delete_loading && dispatch(Delete_from_Cart(item.id)).then(() => { Updating(), delete dels_loaded[item.product.id] })
										}}
										className='absolute z-10 md:hidden right-0 size-5 flex items-center justify-center rounded-full hover:scale-125 transition-all duration-300 text-white top-0 bg-red-500 hover:bg-red-600'
									>
										{delete_loading && dels_loaded[item.product.id] ? <LoadingOutlined spin /> : "X"}
									</button>
								</div>
							))
						) : (
							<div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg">
								Your cart is empty
							</div>
						) : <div className='w-full py-[50px] flex justify-center items-center text-black dark:text-white'>Loading from Bag</div>}
					</div>

					<br /><br />

					<div className='w-full flex gap-4'>
						<Link
							to={"/products"}
							className='py-4 px-[30px] min-w-[200px] hover:scale-105 dark:hover:bg-white dark:hover:text-black text-center mr-auto border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-900 text-black dark:text-white hover:shadow-md hover:text-white hover:bg-black transition-all duration-300'
						>
							Return To Shop
						</Link>
						<button
							onClick={() => { Updating() }}
							className='py-4 px-[30px] md:hidden min-w-[200px] hover:scale-105 dark:hover:bg-white dark:hover:text-black text-center ml-auto md:ml-0 border-2 border-black dark:border-white rounded-md bg-white dark:bg-gray-900 text-black dark:text-white hover:shadow-md hover:text-white hover:bg-black transition-all duration-300'
						>
							Update Cart
						</button>
						<button
							onClick={async () => { data?.productsInCart?.length > 0 && dispatch(Delete_All_from_Cart()).then(() => Updating()) }}
							className='py-4 md:hidden px-[30px] min-w-[200px] hover:scale-105 dark:hover:bg-red-500 dark:hover:text-white text-center ml-3 md:ml-0 border-2 border-red-500 text-red-500 dark:text-red-400 rounded-md bg-white dark:bg-gray-900 hover:bg-red-500 hover:text-white transition-all duration-300'
						>
							Remove all
						</button>
						<div className='flex gap-4'>
							<button
								onClick={() => { Updating() }}
								className='hidden md:inline hover:scale-105 text-center ml-auto md:ml-0 text-black dark:text-white transition-all duration-300'
							>
								<RotateCcw />
							</button>
							<button
								onClick={async () => { data?.productsInCart?.length > 0 && dispatch(Delete_All_from_Cart()).then(() => Updating()) }}
								className='hidden md:inline hover:scale-105 text-center ml-auto md:ml-0 text-red-500 transition-all duration-300'
							>
								<Trash2 />
							</button>
						</div>
					</div>

					<br /><br />

					<div className="flex md:flex-col gap-6 rounded-xl">
						<div className="flex flex-col gap-2 w-full">
							<div className="flex gap-3 w-fit md:w-full md:flex-col">
								<form action="" className='flex gap-5'>
									<input
										id="coupon"
										type="text"
										placeholder="Enter code"
										className="flex-1 px-[30px] py-4 border-2 border-black dark:border-gray-700 w-full max-w-[300px] rounded-md hover:border-black focus:ring-black focus:outline-none ring-black bg-white dark:bg-gray-800 text-black dark:text-white"
									/>
									<button
										className="py-4 text-red-500 dark:text-red-500 dark:hover:text-white border-red-500 dark:border-red-500 hover:scale-105 border-2 px-[40px] md:px-5 font-medium rounded-md transition duration-200 hover:bg-red-500 hover:text-white"
									>
										Apply
									</button>
								</form>
							</div>
						</div>

						<div className="min-w-[450px] md:min-w-full border-2 border-black dark:border-gray-700 hover:scale-105 dark:hover:shadow-gray-800 bg-white dark:bg-gray-800 p-6 rounded-md hover:shadow-lg transition-all duration-300">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cart Total</h3>
							<div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
								<span>Subtotal:</span>
								<span>${data && data?.totalPrice}</span>
							</div>
							<div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
								<span>Shipping:</span>
								<span>{data && data?.totalDiscountPrice}</span>
							</div>
							<div className="flex justify-between text-base font-medium border-t border-gray-200  text-gray-800 dark:text-white mb-4">
								<span>Total:</span>
								<span>${data && data?.totalPrice - data?.totalDiscountPrice}</span>
							</div>
							<Link to="checkout">
								<button className="w-[80%] mx-[10%] py-3 bg-red-600 hover:bg-red-700 hover:scale-105 text-white font-semibold rounded-md transition-all duration-200">Proceed to checkout</button>
							</Link>
						</div>
					</div>
				</div>
			</section >
		</div >
	)
}

export default Cart