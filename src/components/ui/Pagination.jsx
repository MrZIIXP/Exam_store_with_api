import React from 'react'

const Pagination = ({
	currentPage,
	pageSize,
	totalItems,
	onPageChange
}) => {
	const totalPages = Math.ceil(totalItems / pageSize)
	if (totalPages <= 1) return null
	const getPageNumbers = () => {
		const pages = []
		const maxVisiblePages = 5

		if (totalPages <= maxVisiblePages + 2) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			pages.push(1)
			let startPage = Math.max(2, currentPage - 1)
			let endPage = Math.min(totalPages - 1, currentPage + 1)
			if (startPage > 2) {
				pages.push('...')
			}
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i)
			}
			if (endPage < totalPages - 1) {
				pages.push('...')
			}
			pages.push(totalPages)
		}

		return pages
	}

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1)
		}
	}

	const handlePageClick = (page) => {
		if (typeof page === 'number' && page !== currentPage) {
			onPageChange(page)
		}
	}

	return (
		<div className="flex items-center justify-center space-x-2 my-6">
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className={`px-3 py-2 rounded-md border ${currentPage === 1
					? 'text-gray-400 cursor-not-allowed border-gray-300'
					: 'text-gray-700 hover:bg-gray-100 border-gray-300'
					}`}
			>
				←
			</button>

			{getPageNumbers().map((page, index) => (
				<button
					key={index}
					onClick={() => handlePageClick(page)}
					className={`px-3 py-2 rounded-md border min-w-[40px] ${page === currentPage
						? 'bg-blue-500 text-white border-blue-500'
						: page === '...'
							? 'text-gray-500 cursor-default border-transparent'
							: 'text-gray-700 hover:bg-gray-100 border-gray-300'
						}`}
					disabled={page === '...'}
				>
					{page}
				</button>
			))}

			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className={`px-3 py-2 rounded-md border ${currentPage === totalPages
					? 'text-gray-400 cursor-not-allowed border-gray-300'
					: 'text-gray-700 hover:bg-gray-100 border-gray-300'
					}`}
			>
				→
			</button>
		</div>
	)
}

export default Pagination