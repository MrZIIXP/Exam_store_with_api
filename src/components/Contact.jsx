import React from 'react'
import { Phone, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { _set_massanges, _set_unreaded_message } from '../redux/Api'
const Contact = () => {
	const Cont = useForm({ defaultValues: { name: "", email: "", phone: "", message: "" } })
	const dispatch = useDispatch()
	const { messages, unreaded_message } = useSelector(state => state.Market)
	const navigate = useNavigate()

	React.useEffect(() => {
		window.scrollTo(0, 0)
		const user = JSON.parse(localStorage.getItem("checkout")) || null
		Cont.reset({
			name: user ? (user?.firstName + " " + user?.lastName) : "",
			email: user?.email || "",
			phone: user?.phone || "",
			message: ""
		})
	}, [])

	const onSubmit = (data) => {
		const text = `Многоуважемый ${data.name}, мы примем ваше жалование, и сообщим вам по номеру ${data.phone} или же по почте ${data.email}`
		const mess = JSON.parse(localStorage.getItem("messages")) || []
		localStorage.setItem("messages", JSON.stringify([...mess, { text: text, read: false, date: Date.now() }]))
		dispatch(_set_massanges([...messages, { text: text, read: false, date: Date.now() }]))
		dispatch(_set_unreaded_message(unreaded_message + 1))
		navigate("/")
	}


	return (
		<div className='pt-[80px] bg-white dark:bg-black min-h-screen px-[10%]'>
			<p className='text-gray-500 dark:text-gray-400 font-semibold'>
				<Link to="/" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Home</Link> / <span className='text-black dark:text-white'>Contact</span>
			</p>
			<section className="py-12 bg-white dark:bg-black">
				<div className="max-w-[1200px] mx-auto flex md:flex-col gap-10">
					<div className="flex flex-col justify-between dark:bg-gray-900 rounded-lg gap-6 shadow-lg p-10">
						<div className="flex flex-col gap-4">
							<div className='flex items-center gap-4'>
								<div className="bg-red-500 text-white p-3 rounded-full">
									<Phone size={20} />
								</div>
								<h3 className="text-lg font-semibold">Call To Us</h3>
							</div>
							<div className='flex flex-col gap-2'>
								<p className="text-sm font-medium mt-1">
									We are available 24/7, 7 days a week.
								</p>
								<p className="text-sm font-medium mt-1">Phone: +8801611112222</p>
							</div>
						</div>
						<hr />
						<div className="flex flex-col gap-4">
							<div className="flex gap-4 item-center">
								<div className="bg-red-500 text-white p-3 rounded-full">
									<Mail size={20} />
								</div>
								<h3 className="text-lg font-semibold">Write To Us</h3>
							</div>
							<div className='flex flex-col gap-2'>
								<p className="text-sm font-medium mt-1">
									Fill out our form and we will contact you within 24 hours.
								</p>
								<p className="text-sm font-medium mt-1">
									Emails: customer@exclusive.com
								</p>
								<p className="text-sm font-medium">Emails: support@exclusive.com</p>
							</div>
						</div>
					</div>

					<form onSubmit={Cont.handleSubmit(onSubmit)} className="p-8 rounded-lg dark:bg-gray-900 w-full shadow-md space-y-4 flex flex-col">
						<div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:gap-7">
							<div className='relative w-full'>
								<input
									type="text"
									placeholder=""
									className="border peer border-gray-300 w-full rounded-md px-4 py-4 text-sm dark:bg-gray-700 outline-none"
									id='name'
									{...Cont.register("name", { required: true })}
								/>
								<label htmlFor="name" className='absolute -top-[25px] text-gray-400 dark:peer-focus:text-gray-400 text-base left-0 transition-all duration-300 peer-placeholder-shown:left-4 peer-focus:-top-6 peer-focus:text-base peer-focus:text-black peer-focus:left-0 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm'>Full Name</label>
							</div>
							<div className='relative w-full'>
								<input
									type="email"
									placeholder=""
									id="email"
									className="border peer w-full border-gray-300 rounded-md px-4 py-4 text-sm dark:bg-gray-700 outline-none"
									{...Cont.register("email", { required: true })}
								/>
								<label htmlFor="email" className='absolute -top-[25px] text-gray-400 dark:peer-focus:text-gray-400 text-base left-0 transition-all duration-300 peer-placeholder-shown:left-4 peer-focus:-top-6 peer-focus:text-base peer-focus:text-black peer-focus:left-0 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm'>Email</label>
							</div>
							<div className='relative w-full'>
								<input
									type="text"
									placeholder=""
									id="phone"
									className="border peer w-full border-gray-300 rounded-md px-4 py-4 text-sm dark:bg-gray-700 outline-none"
									{...Cont.register("phone", { required: true })}
								/>
								<label htmlFor="phone" className='absolute -top-[25px] text-gray-400 dark:peer-focus:text-gray-400 text-base left-0 transition-all duration-300 peer-placeholder-shown:left-4 peer-focus:-top-6 peer-focus:text-base peer-focus:text-black peer-focus:left-0 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm'>Phone</label>
							</div>
						</div>
						<br />
						<div className='relative'>
							<textarea
								placeholder=""
								rows={7}
								id='message'
								className="w-full border border-gray-300 peer rounded-md px-4 dark:bg-gray-700 py-2 text-sm resize-none"
								{...Cont.register("message", { required: true })}
							/>
							<label htmlFor="message" className='absolute -top-[25px] text-gray-400 dark:peer-focus:text-gray-400 text-base left-0 transition-all duration-300 peer-placeholder-shown:left-4 peer-focus:-top-6 peer-focus:text-base peer-focus:text-black peer-focus:left-0 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm'>Your Message</label>
						</div>
						<br />
						<button
							type="submit"
							className="bg-red-500 text-white px-6 py-4 rounded-md text-base ml-auto hover:bg-red-600 transition"
						>
							Send Message
						</button>
					</form>
				</div>
			</section>
		</div>
	)
}

export default Contact