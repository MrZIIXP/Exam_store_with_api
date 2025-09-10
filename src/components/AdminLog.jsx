import React, { useEffect, useState } from 'react'
import { API } from '../config'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export const AdminLog = () => {
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		if (localStorage.getItem("account")) {
			window.location.href = "/admin"
		}
	}, [])

	async function login(userName, password) {
		setLoading(true)
		try {
			const res = await API.post("Account/login", { userName, password })
			if (res.data.data) {
				localStorage.setItem("account", res.data.data)
				const { data } = await API.get(
					`UserProfile/get-user-profiles?UserName=${userName}`
				)
				console.log(data.data)
				const user = data.data.find(item => item.userName === userName.toLowerCase())
				localStorage.setItem("user", user?.userId)
				window.location.href = "/admin/"
			}
			return res.data
		} catch (error) {
			alert(error)
		}
		finally {
			setLoading(false)
		}
	}

	const Log = useForm({
		defaultValues: {
			userName: "",
			password: ""
		}
	})

	const onSubmit = (data) => {
		if (data.userName && data.password) {
			login(data.userName, data.password)
			Log.reset()
		}
		else{
			setLoading(false)
		}
	}

	return (
		<div className='flex min-h-screen w-full'>
			<div className='h-screen flex-col w-1/2 bg-gray-900 text-white px-[64px] bg-cover flex justify-center' style={{ backgroundImage: "url('/images/Header/gradient-bg.svg.png')" }}>
				<p className='text-2xl font-medium'>Welcome to admin panel</p>
				<img src="/images/Header/Group 1116606595 (1).png" alt="" className='w-[344px] h-[100px]' />
			</div>
			<div className='flex item-center justify-center w-1/2 py-40'>
				<form onSubmit={Log.handleSubmit(onSubmit)} className='grid mx-auto min-w-[420px] h-auto md:min-w-full md:px-5 bg-white dark:bg-gray-900 p-8 transition-colors duration-300'>
					<h1 className='text-[36px] font-semibold md:text-[32px] text-black dark:text-white'>Log in to Exclusive</h1>
					<p className='text-gray-600 dark:text-gray-400'>Enter your details below</p>

					<br /><br />

					<input
						type="text"
						placeholder='Name'
						{...Log.register("userName")}
						className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition-colors duration-300'
					/>

					<input
						type="password"
						placeholder='Password'
						{...Log.register("password")}
						className='my-[10px] w-full py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition-colors duration-300'
					/>

					<div className='py-4 w-full bg-transparent text-blue-500 font-semibold rounded-md flex items-center justify-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300'>
						<button className='text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300'>
							Forget Password?
						</button>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='py-4 mt-2 w-full text-center bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center'
					>
						{isLoading ? (
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
						) : (
							'Log In'
						)}
					</button>
				</form></div>
		</div>
	)
}

export default AdminLog