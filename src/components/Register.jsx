import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { API, createAccountWithAdmin } from '../config'
import { useState } from 'react'

const Register = () => {
	const [isLoading, setLoading] = useState(false)

	async function registerAndLogin(userData) {
		setLoading(true)
		try {
			await createAccountWithAdmin(userData)
			const loginResponse = await API.post('Account/login', {
				userName: userData.userName,
				password: userData.password
			})

			if (loginResponse.data.data) {
				localStorage.setItem('account', loginResponse.data.data)
				const { data } = await API.get(
					`UserProfile/get-user-profiles?UserName=${userName}`
				)
				const user = data.data.find(item => item.userName === userName)
				console.log(user)
				localStorage.setItem("user", user.userId)
				window.location.href = '/'
			}

		} catch (error) {
			alert(error.response?.data?.message || 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	const Reg = useForm({
		defaultValues: {
			userName: '',
			email: '',
			password: '',
			confirmPassword: '',
			phoneNumber: "",
		}
	})

	const onSubmit = (data) => {
		if (data.password !== data.confirmPassword) {
			alert("Passwords don't match")
			return
		}

		registerAndLogin(data)
	}

	return (
		<div className='w-full flex flex-col md:py-[100px] md:px-5 items-center py-[150px] bg-white dark:bg-black min-h-screen transition-colors duration-300'>
			<form onSubmit={Reg.handleSubmit(onSubmit)} className='grid mx-auto min-w-[420px] md:min-w-full md:px-5 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-300'>
				<h1 className='text-[36px] font-semibold md:text-[32px] text-black dark:text-white'>Create Account</h1>
				<p className='text-gray-600 dark:text-gray-400'>Enter your details below</p>

				<br /><br />

				<input
					type="text"
					placeholder='Username'
					{...Reg.register('userName', { required: true })}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<input
					type="email"
					placeholder='Email'
					{...Reg.register('email', { required: true })}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<input
					type="tel"
					placeholder='Phone Number'
					{...Reg.register('phoneNumber', { required: true })}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<input
					type="password"
					placeholder='Password'
					{...Reg.register('password', { required: true })}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<input
					type="password"
					placeholder='Confirm Password'
					{...Reg.register('confirmPassword', { required: true })}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<button
					type='submit'
					disabled={isLoading}
					className='py-4 mt-2 w-full text-center bg-[#DB4444] hover:bg-red-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center'
				>
					{isLoading ? (
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
					) : (
						'Sign Up'
					)}
				</button>

				<div className='mt-6 text-center'>
					<p className='text-gray-600 dark:text-gray-400'>
						Already have an account?{' '}
						<Link
							to="/login"
							className='text-[#DB4444] hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 font-semibold transition-colors duration-300'
						>
							Log in
						</Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Register