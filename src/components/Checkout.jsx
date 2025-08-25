import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { _set_massanges, _set_unreaded_message, Delete_All_from_Cart, Get_Cart } from '../redux/Api'
import { useForm } from 'react-hook-form'

const Checkout = () => {
	const { data_cart, account: acc, cart_loading, messages, unreaded_message } = useSelector(state => state.Market)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [save, setSave] = React.useState(false)
	const [data, setData] = React.useState(null)

	const Pay = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			address: "",
			city: "",
			Apartment: "",
			phone: "",
		}
	})


	const Update = async () => {
		dispatch(Get_Cart()).then((item) => { setData(item.payload[0]) })
	}

	useEffect(() => {
		if (acc) {
			Update()
			const data = JSON.parse(localStorage.getItem("checkout")) || null
			Pay.reset({
				address: data?.address || "",
				city: data?.city || "",
				Apartment: data?.Apartment || "",
				phone: data?.phone || "",
				email: data?.email || "",
				firstName: data?.firstName || "",
				lastName: data?.lastName || "",
			})
		}
		else {
			navigate("/login")
		}
	}, [])

	const onSubmit = (data) => {
		if (save) {
			localStorage.setItem("checkout", JSON.stringify(data))
		}
		if (data_cart) {
			const check = data_cart[0]
			const text = `Вы заказали продукты в общей сумме $${check?.totalPrice - check?.totalDiscountPrice} на ${data.firstName} ${data.lastName} в них включались ${check?.productsInCart?.slice(0, -1).map(item => `${item?.product?.productName} в количестве ${item?.quantity}`).join(", ")} и ${check?.productsInCart[check?.productsInCart?.length - 1]?.product.productName} в количестве ${check?.productsInCart[check?.productsInCart?.length - 1]?.quantity}.Товар прийдёт через 3 дня на адрес: Город ${data.city}, улица ${data.address}, этаж-дом ${data.Apartment}. Мы пришлём сообщение по почте ${data.email}. Благодарим вас за покупку.`
			const mess = JSON.parse(localStorage.getItem("messages")) || []
			localStorage.setItem("messages", JSON.stringify([...mess, { text: text, read: false, date: Date.now() }]))
			dispatch(_set_massanges([...messages, { text: text, read: false, date: Date.now() }]))
			dispatch(Delete_All_from_Cart()).then(() => { navigate("/") }).then(() => { setTimeout(() => dispatch(_set_unreaded_message(unreaded_message + 1)), 500) })
		}
	}


	return (
		<section className='px-[10%] py-[60px]'>
			<p className='text-gray-500 dark:text-gray-400 font-semibold'>
				<Link to="/" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Home</Link> / <Link to="/cart" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Cart</Link> / <span className='text-black dark:text-white'>Checkout</span>
			</p>
			<br /><br />
			<div className="w-full gap-[200px] flex md:flex-col justify-between">
				<div className='w-full'>
					<h1 className='text-4xl font-medium mb-4'>Billing Details</h1>
					<form onSubmit={Pay.handleSubmit(onSubmit)} id="checkout" className="flex flex-col gap-6 w-full py-7  shadow-[0px_0px_20px] shadow-gray-200 p-5 rounded-md">
						<div className='relative w-full'>
							<input
								type="text"
								placeholder=" "
								{...Pay.register("firstName", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.firstName ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>
								First Name
							</label>
						</div>

						<div className='relative w-full'>
							<input
								type="text"
								{...Pay.register("lastName", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
								placeholder=''
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.lastName ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>Last Name</label>
						</div>

						<div className='relative w-full'>
							<input
								type="text"
								{...Pay.register("address", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
								placeholder=''
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.address ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>Street adsress</label>
						</div>

						<div className='relative w-full'>
							<input
								type="text"
								{...Pay.register("Apartment", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
								placeholder=''
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.Apartment ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>Apartment, floor, etc. (optional)</label>
						</div>

						<div className='relative w-full'>
							<input
								type="text"
								{...Pay.register("city", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
								placeholder=''
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.city ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>Town/City</label>
						</div>

						<div className='relative w-full'>
							<input
								type="text"
								{...Pay.register("phone", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
								placeholder=''
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.phone ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>Phone number</label>
						</div>

						<div className='relative w-full'>
							<input
								type="text"
								{...Pay.register("email", { required: true })}
								className="w-full focus:scale-105 transition-all duration-300 px-4 pt-5 pb-2 rounded-md border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none peer"
								placeholder=''
							/>
							<label className={`text-sm font-medium ${Pay.formState.errors.email ? "text-red-500" : "text-gray-500 dark:text-neutral-300"}  transition-all duration-200 absolute peer-placeholder-shown:top-1/3 peer-focus:-top-6 left-0 peer-placeholder-shown:left-4 -top-6 peer-focus:left-0`}>Email address</label>
						</div>
						<div className='w-full flex gap-4'>
							<input type="checkbox" onChange={e => setSave(e.target.checked)} className="scale-150 accent-red-500" id="save" checked={save} />
							<label htmlFor="save">Save this information for faster check-out next time</label>
						</div>
					</form>
				</div>

				<div className='w-full'>
					<div className='w-full flex flex-col text-center max-h-[270px] overflow-y-auto' style={{ scrollbarColor: "transparent transparent" }}>
						{!cart_loading && data ? data?.productsInCart?.map(item => {
							return (
								<div key={item?.product?.id} className='py-2 flex w-full items-center'>
									<div className='text-start w-[50%]'><div className='flex items-center gap-2 max-w-[190px]'><img src={import.meta.env.VITE_API_BASE_URL + "images/" + item?.product?.image} className='size-[50px]' alt="" /> <p>{item?.product?.productName}</p></div></div>
									<div className='w-[20%] text-end'>{item?.quantity}</div>
									<div className='w-[30%] flex justify-end'>${item?.quantity * item?.product?.price}</div>
								</div>
							)
						}
						) : <></>}
					</div>


					<div className="flex flex-col w-full pt-3 gap-3">
						<div className='flex justify-between'>Subtotal: <span>${data?.totalPrice}</span></div>
						<div className='flex justify-between'>Shipping: <span>{data?.totalDiscountPrice === 0 ? "Free" : "$" + data?.totalDiscountPrice}</span></div>
						<hr />
						<div className='flex pb-4 justify-between text-xl font-medium	'>Total: <span>${data?.totalPrice - data?.totalDiscountPrice}</span></div>
						<div className="flex items-center gap-3">
							<input type="radio" id="card" name="payment" className="accent-neutral-900 scale-150" />
							<label htmlFor="card" className="text-sm text-neutral-700 dark:text-neutral-300">Bank</label>
						</div>
						<div className="flex items-center gap-3">
							<input type="radio" id="paypal" name="payment" className="accent-neutral-900 scale-150" />
							<label htmlFor="paypal" className="text-sm text-neutral-700 dark:text-neutral-300">Cash on delivery</label>
						</div>
					</div>
					<br />
					<form action="" className='flex p-5 gap-5 shadow-[0px_0px_15px] hover:scale-105 transition-all duration-200 transform-gpu shadow-gray-200 rounded-md w-full'>
						<input
							id="coupon"
							type="text"
							placeholder="Enter code"
							className="flex-1 px-[30px] w-full py-4 border-2 border-black dark:border-gray-700 rounded-md hover:border-black focus:ring-black focus:outline-none ring-black bg-white dark:bg-gray-800 text-black dark:text-white"
						/>
						<button
							className="py-4 text-red-500 md:px-5 dark:text-red-500 dark:hover:text-white border-red-500 dark:border-red-500 hover:scale-105 border-2 px-[40px] font-medium rounded-md transition duration-200 hover:bg-red-500 hover:text-white"
						>
							Apply
						</button>
					</form>
					<br /><br />
					<button type="submit" form='checkout'
						className="py-4 text-white dark:text-red-500 hover:shadow-lg dark:hover:shadow-none dark:hover:bg-red-500 dark:hover:text-white border-red-500 dark:border-red-500 hover:scale-105 border-2 px-[40px] font-medium rounded-md transition-all duration-200 dark:bg-transparent bg-red-500"
					>
						Place Order
					</button>


				</div>
			</div>
		</section>

	)
}

export default Checkout