import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Edit_profile, Get_profile } from '../redux/Api'
import { Image } from 'antd'
import { Input } from './ui/input'

const Account = () => {
	const dispatch = useDispatch()
	const navigator = useNavigate()
	const [imagePreview, setImagePreview] = useState('')
	const { data_profile: user, profile_loading } = useSelector(state => state.Market)

	const { handleSubmit, register, reset, formState: { errors } } = useForm({
		defaultValues: {
			Image: "",
			FirstName: "",
			LastName: "",
			Email: "",
			PhoneNumber: "",
			Dob: ""
		}
	})

	const Get = async () => {
		dispatch(Get_profile(localStorage.getItem("user"))).then((item) => {
			reset({
				Image: item?.payload?.image || "",
				FirstName: item?.payload?.firstName || "",
				LastName: item?.payload?.lastName || "",
				Email: item?.payload?.email || "",
				PhoneNumber: item?.payload?.phoneNumber || "",
				Dob: item?.payload?.dob || ""
			})
			console.log(item)
			if (item?.payload?.image) {
				setImagePreview(import.meta.env.VITE_API_BASE_URL + "images/" + item.payload.image)
			}
		})
	}

	useEffect(() => {
		Get()
	}, [])

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target.result)
			}
			reader.readAsDataURL(file)
		}
	}

	const onSubmit = async (data) => {
		const formData = new FormData()
		if (data.Image && data.Image[0]) {
			formData.append("Image", data.Image[0])
		}
		else{
			formData.append("Image", data.Image)
		}
		formData.append("FirstName", data.FirstName)
		formData.append('LastName', data.LastName)
		formData.append("Email", data.Email)
		formData.append("PhoneNumber", data.PhoneNumber)
		formData.append("Dob", data.Dob)
		dispatch(Edit_profile(formData)).then(() => { Get() })
		console.log(data)
	}

	if (profile_loading) {
		return <div className='w-full py-[250px] flex justify-center'>
			<div className='animate-spin size-[100px] rounded-full border-b-2 border-l-2 border-red-500'></div>
		</div>

	}

	return (
		<div className="min-h-screen py-8">
			<div className="max-w-6xl mx-auto px-4">
				<p className='text-gray-500 my-10 dark:text-gray-400 font-semibold'>
					<Link to="/" className='text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>Home</Link> / <span className='text-black dark:text-white'>Contact</span>
				</p>

				<div className="flex gap-8 md:flex-col">
					<div className="w-64 flex-shrink-0 md:w-full">
						<div className="bg-white dark:bg-gray-900 rounded-lg p-6">
							<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-base">Manage My Account</h3>
							<ul className="space-y-2 mb-6 pl-7">
								<li className="text-red-500 font-normal text-base cursor-pointer">My Profile</li>
								<li className="opacity-50 font-normal text-base hover:text-red-500 cursor-pointer">Address Book</li>
								<li className="opacity-50 font-normal text-base hover:text-red-500 cursor-pointer">My Payment Options</li>
							</ul>

							<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-base">My Orders</h3>
							<ul className="space-y-2 mb-6 pl-7">
								<li className="opacity-50 font-normal text-base hover:text-red-500 cursor-pointer">My Returns</li>
								<li className="opacity-50 font-normal text-base hover:text-red-500 cursor-pointer">My Cancellations</li>
							</ul>

							<Link to="/favourite"><h3 className="font-semibold hover:text-red-500 text-gray-900 dark:text-gray-100 text-base">My WishList</h3></Link>
						</div>
					</div>

					<div className="flex-1">
						<div className="bg-white dark:bg-gray-900 shadow-lg rounded p-10">
							<h2 className="text-red-500 font-medium text-xl mb-8">Profile</h2>

							<div className='flex gap-5 items-center mb-5'>
								<Image
									className='rounded-full object-contain border-2'
									width={70}
									height={60}
									src={imagePreview || import.meta.env.VITE_API_BASE_URL + "images/" + user?.image}
								/>
								<div className="flex flex-col">
									<Input
										type="file"
										accept="image/*"
										{...register("Image")}
										onChange={handleFileChange}
										className={errors.Image ? "border-red-500 border" : ""}
									/>
									{errors.Image && <span className="text-red-500 text-sm mt-1">Image is required</span>}
								</div>
							</div>

							<form onSubmit={handleSubmit(onSubmit)} id="edit" className="space-y-8 flex flex-col">
								<div>
									<div className="grid grid-cols-2 md:grid-cols-1 md:gap-7 gap-5 mb-6">
										<div>
											<div className={`border rounded h-14 relative ${errors.FirstName ? "border-red-500" : "border-gray-300"}`}>
												<input
													type="text"
													id="name"
													placeholder=''
													className="w-full h-full px-4 pt-4 pb-2 outline-none peer rounded dark:bg-gray-700"
													{...register("FirstName", { required: true })}
												/>
												<label htmlFor='name' className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 peer-placeholder-shown:text-base dark:bg-transparent dark:text-white dark:left-0 dark:-top-5 dark:peer-focus:-top-5 dark:peer-placeholder-shown:left-3 dark:peer-focus:left-0 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs">
													First name
												</label>
											</div>
											{errors.FirstName && <span className="text-red-500 text-sm">First name is required</span>}
										</div>

										<div>
											<div className={`border rounded h-14 relative ${errors.LastName ? "border-red-500" : "border-gray-300"}`}>
												<input
													type="text"
													id="lastname"
													className="w-full h-full px-4 pt-4 pb-2 outline-none peer rounded dark:bg-gray-700"
													placeholder=''
													{...register("LastName", { required: true })}
												/>
												<label htmlFor='lastname' className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 peer-placeholder-shown:text-base dark:bg-transparent dark:text-white dark:left-0 dark:-top-5 dark:peer-focus:-top-5 dark:peer-placeholder-shown:left-3 dark:peer-focus:left-0 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs">
													Last name
												</label>
											</div>
											{errors.LastName && <span className="text-red-500 text-sm">Last name is required</span>}
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-1 md:gap-7 gap-5">
										<div>
											<div className={`border rounded h-14 relative ${errors.Email ? "border-red-500" : "border-gray-300"}`}>
												<input
													type="email"
													id='email'
													className="w-full h-full px-4 pt-4 pb-2 outline-none peer rounded dark:bg-gray-700"
													placeholder=''
													{...register("Email", {
														required: true,
														pattern: {
															value: /^\S+@\S+$/i,
															message: "Invalid email address"
														}
													})}
												/>
												<label htmlFor='email' className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 peer-placeholder-shown:text-base dark:bg-transparent dark:text-white dark:left-0 dark:-top-5 dark:peer-focus:-top-5 dark:peer-placeholder-shown:left-3 dark:peer-focus:left-0 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs">
													Email address
												</label>
											</div>
											{errors.Email && (
												<span className="text-red-500 text-sm">
													{errors.Email.type === "required" ? "Email is required" : errors.Email.message}
												</span>
											)}
										</div>

										<div>
											<div className={`border rounded h-14 relative ${errors.PhoneNumber ? "border-red-500" : "border-gray-300"}`}>
												<input
													type="text"
													id="phone"
													className="w-full h-full px-4 pt-4 pb-2 outline-none peer rounded dark:bg-gray-700"
													placeholder=''
													{...register("PhoneNumber", {
														required: true,
														pattern: {
															value: /^\+?[0-9]{10,15}$/,
															message: "Invalid phone number"
														}
													})}
												/>
												<label htmlFor="phone" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 peer-placeholder-shown:text-base dark:bg-transparent dark:text-white dark:left-0 dark:-top-5 dark:peer-focus:-top-5 dark:peer-placeholder-shown:left-3 dark:peer-focus:left-0 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs">
													Phone
												</label>
											</div>
											{errors.PhoneNumber && (
												<span className="text-red-500 text-sm">
													{errors.PhoneNumber.type === "required" ? "Phone is required" : errors.PhoneNumber.message}
												</span>
											)}
										</div>
									</div>
									<div className="mt-6">
										<div className="border border-gray-300 rounded h-14 relative dark:border-gray-600">
											<input
												type="date"
												id="dob"
												className="w-full h-full px-4 pt-4 pb-2 outline-none peer rounded dark:bg-gray-700 dark:text-white"
												{...register("Dob")}
											/>
											<label htmlFor="dob" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 peer-placeholder-shown:text-base dark:bg-transparent dark:text-white dark:left-0 dark:-top-5 dark:peer-focus:-top-5 dark:peer-placeholder-shown:left-3 dark:peer-focus:left-0 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs">
												Date of Birth
											</label>
										</div>
									</div>
								</div>

								<div className="flex ml-auto items-center gap-8 pt-4">
									<span
										onClick={() => navigator(-1)}
										className="text-gray-900 dark:text-gray-100 font-normal text-base cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors"
									>
										Cancel
									</span>
									<button
										form="edit"
										type="submit"
										className="bg-red-500 text-white px-12 py-4 rounded hover:bg-red-600 transition-colors font-medium text-base"
									>
										Save Changes
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Account