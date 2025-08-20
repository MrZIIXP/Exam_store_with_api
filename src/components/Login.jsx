import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../config'
import { useState } from 'react'

const Login = () => {
	const navigate = useNavigate()
	const [isLoading, setLoading] = useState(false)

	async function login(userName, password) {
		setLoading(true)
		try {
			const res = await API.post("Account/login", { userName, password })

			if (res.data.data) {
				localStorage.setItem("account", res.data.data)
				window.location.href = "/"
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
		login(data.userName, data.password)
		Log.reset()
	}

	return (
		<div className='w-full flex flex-col md:py-[60px] items-center py-[150px] bg-white dark:bg-black min-h-screen transition-colors duration-300'>
			<form onSubmit={Log.handleSubmit(onSubmit)} className='grid mx-auto min-w-[420px] md:min-w-full md:px-5 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-300'>
				<h1 className='text-[36px] font-semibold md:text-[32px] text-black dark:text-white'>Log in to Exclusive</h1>
				<p className='text-gray-600 dark:text-gray-400'>Enter your details below</p>

				<br /><br />

				<input
					type="text"
					placeholder='Name'
					{...Log.register("userName")}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<input
					type="password"
					placeholder='Password'
					{...Log.register("password")}
					className='my-[10px] w-full py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
				/>

				<div className='py-4 w-full bg-transparent text-[#DB4444] font-semibold rounded-md flex items-center justify-center gap-3 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300'>
					<Link to="/register" className='text-[#DB4444] hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-300'>
						Forget Password?
					</Link>
				</div>

				<button
					type='submit'
					disabled={isLoading}
					className='py-4 mt-2 w-full text-center bg-[#DB4444] hover:bg-red-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center'
				>
					{isLoading ? (
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
					) : (
						'Log In'
					)}
				</button>

				<div className='mt-6 text-center'>
					<p className='text-gray-600 dark:text-gray-400'>
						Don't have an account?{' '}
						<Link
							to="/register"
							className='text-[#DB4444] hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 font-semibold transition-colors duration-300'
						>
							Sign up
						</Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Login