import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
	return (
		<div className='flex py-[150px] justify-center items-center bg-white dark:bg-black min-h-screen transition-colors duration-300'>
			<div className='text-center'>
				<h1 className='text-[110px] md:text-[45px] font-medium text-black dark:text-white'>404 Not Found</h1>
				<p className='text-gray-600 dark:text-gray-400'>Your visited page not found. You may go home page.</p>
				<br /><br /><br />
				<Link
					to="/"
					className='py-4 px-[30px] inline-block text-center bg-[#DB4444] hover:bg-red-600 text-white rounded-md transition-colors duration-300'
				>
					Back to Home
				</Link>
			</div>
		</div>
	)
}

export default Error