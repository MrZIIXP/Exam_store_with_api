import { GoogleOutlined } from '@ant-design/icons'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import { Account } from '../jotai/Acc'

const Register = () => {
	const [, setAccount] = useAtom(Account)
	const navigate = useNavigate()
	const Reg = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: ""
		}
	})

	const onSubmit = (data) => {
		localStorage.setItem("account", JSON.stringify(data))
		setAccount(data)
		navigate("/")
	}

	return (
		<div className='w-full flex flex-col md:py-[60px] items-center py-[150px] bg-white dark:bg-black min-h-screen transition-colors duration-300'>
			<form
				className='grid mx-auto min-w-[420px] md:min-w-full md:px-5 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-300'
				onSubmit={Reg.handleSubmit(onSubmit)}
			>
				<h1 className='text-[36px] font-semibold md:text-[32px] text-black dark:text-white'>Create an account</h1>
				<p className='text-gray-600 dark:text-gray-400'>Enter your details below</p>
				<br /><br />

				<input
					type="text"
					placeholder={Reg.formState.errors.name ? Reg.formState.errors.name.message : 'Name'}
					style={Reg.formState.errors.name && { border: "1px solid red" }}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
					{...Reg.register("name", { required: "Name is required" })}
				/>

				<input
					type="text"
					placeholder={Reg.formState.errors.email ? Reg.formState.errors.email.message : 'Email or phone number'}
					style={Reg.formState.errors.email && { border: "1px solid red" }}
					className='w-full my-[10px] py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
					{...Reg.register("email", { required: "Email is required" })}
				/>

				<input
					type="password"
					placeholder={Reg.formState.errors.password ? Reg.formState.errors.password.message : 'Password'}
					style={Reg.formState.errors.password && { border: "1px solid red" }}
					className='my-[10px] w-full py-4 px-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-500 transition-colors duration-300'
					{...Reg.register("password", { required: "Password is required" })}
				/>

				<br />

				<button
					type='submit'
					className='py-4 mb-2 w-full text-center bg-[#DB4444] hover:bg-red-600 text-white rounded-md transition-colors duration-300'
				>
					Create Account
				</button>

				<button
					className='py-4 w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-[#00000066] dark:border-gray-700 rounded-md flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300'
				>
					<GoogleOutlined className='text-[25px]' />
					Sign up with Google
				</button>

				<div className='py-4 w-full bg-transparent text-black dark:text-white rounded-md flex items-center justify-center gap-3 transition-colors duration-300'>
					Already have account?
					<Link
						to="/login"
						className="font-medium underline text-[#DB4444] hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
					>
						Log in
					</Link>
				</div>
			</form>
		</div>
	)
}

export default Register