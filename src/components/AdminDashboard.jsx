import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { Get_product, Get_Users } from '../redux/Api'
import Chart from 'chart.js/auto'
import { Image } from 'antd'

const SalesChart = ({ products }) => {
	const chartRef = useRef(null)
	const chartInstance = useRef(null)

	useEffect(() => {
		if (chartInstance.current) {
			chartInstance.current.destroy()
		}

		if (chartRef.current && products?.length > 0) {
			const sortedProducts = [...products].sort((a, b) => a.id - b.id)
			const maxQuantity = Math.max(...sortedProducts.map(product => product.quantity))
			const maxYValue = Math.ceil(maxQuantity / 10) * 10
			const labels = sortedProducts.map(product =>
				product.productName.length > 8
					? product.productName.substring(0, 8) + '...'
					: product.productName
			)
			const data = sortedProducts.map(product => product.quantity)

			const ctx = chartRef.current.getContext('2d')

			// Градиенты для светлой и темной темы
			const lightGradient = ctx.createLinearGradient(0, 0, 0, 400)
			lightGradient.addColorStop(0, 'rgba(60, 120, 216, 0.4)')
			lightGradient.addColorStop(1, 'rgba(60, 120, 216, 0.05)')

			const darkGradient = ctx.createLinearGradient(0, 0, 0, 400)
			darkGradient.addColorStop(0, 'rgba(96, 165, 250, 0.4)')
			darkGradient.addColorStop(1, 'rgba(96, 165, 250, 0.05)')

			chartInstance.current = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: 'Sales Revenue',
						data: data,
						backgroundColor: lightGradient,
						borderColor: 'rgba(60, 120, 216, 1)',
						borderWidth: 2,
						pointBackgroundColor: 'rgba(60, 120, 216, 1)',
						pointRadius: 3,
						pointHoverRadius: 5,
						fill: true,
						tension: 0
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							mode: 'index',
							intersect: false,
							backgroundColor: 'rgba(0, 0, 0, 0.7)',
							titleColor: '#fff',
							bodyColor: '#fff',
							titleFont: {
								size: 14
							},
							bodyFont: {
								size: 13
							},
							callbacks: {
								title: function (tooltipItems) {
									const product = sortedProducts[tooltipItems[0].dataIndex]
									return product.productName
								},
								label: function (context) {
									return `Quantity: ${context.parsed.y}`
								}
							}
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							max: maxYValue + 10,
							grid: {
								color: 'rgba(0, 0, 0, 0.05)'
							},
							ticks: {
								stepSize: maxYValue / 5,
								font: {
									size: 12
								},
								color: '#374151'
							},
						},
						x: {
							grid: {
								display: false
							},
							ticks: {
								font: {
									size: 10
								},
								color: '#374151'
							}
						}
					}
				}
			})

			// Функция для обновления цветов графика при изменении темы
			const updateChartColors = () => {
				const isDark = document.documentElement.classList.contains('dark')
				if (chartInstance.current) {
					chartInstance.current.data.datasets[0].backgroundColor = isDark ? darkGradient : lightGradient
					chartInstance.current.data.datasets[0].borderColor = isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(60, 120, 216, 1)'
					chartInstance.current.data.datasets[0].pointBackgroundColor = isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(60, 120, 216, 1)'

					chartInstance.current.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
					chartInstance.current.options.scales.y.ticks.color = isDark ? '#D1D5DB' : '#374151'
					chartInstance.current.options.scales.x.ticks.color = isDark ? '#D1D5DB' : '#374151'

					chartInstance.current.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
					chartInstance.current.options.plugins.tooltip.titleColor = isDark ? '#000' : '#fff'
					chartInstance.current.options.plugins.tooltip.bodyColor = isDark ? '#000' : '#fff'

					chartInstance.current.update()
				}
			}

			// Наблюдатель за изменением темы
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.attributeName === 'class') {
						updateChartColors()
					}
				})
			})

			observer.observe(document.documentElement, { attributes: true })

			return () => {
				observer.disconnect()
				if (chartInstance.current) {
					chartInstance.current.destroy()
				}
				chartInstance.current = null
			}
		}
	}, [products])

	const maxQuantityProduct = products?.length > 0
		? products?.reduce((max, product) =>
			product.quantity > max.quantity ? product : max, products[0])
		: null
	const totalOrders = products?.reduce((sum, product) => sum + product.quantity, 0)

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
			<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Sales Revenue</h2>
			<div className="relative h-64">
				<canvas ref={chartRef}></canvas>
			</div>
			<div className="mt-4 flex justify-between items-center">
				<div className="text-sm text-gray-600 dark:text-gray-300">
					<span className="font-semibold">{totalOrders} Orders</span>
				</div>
				<div className="text-sm text-gray-600 dark:text-gray-300">
					<span className="font-semibold">
						{maxQuantityProduct ? maxQuantityProduct.productName : ''}
					</span>
				</div>
			</div>
		</div>
	)
}

export const formatNumber = (num) => {
	if (num === undefined || num === null) return '0'

	const number = typeof num === 'string' ? parseFloat(num) : num

	if (isNaN(number)) return '0'

	if (number >= 1000000000) {
		return (number / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B'
	}
	if (number >= 1000000) {
		return (number / 1000000).toFixed(2).replace(/\.0$/, '') + 'M'
	}
	if (number >= 1000) {
		return (number / 1000).toFixed(2).replace(/\.0$/, '') + 'k'
	}
	return number.toString()
}

const AdminDashboard = () => {
	const { data_users, data_products } = useSelector(state => state.Market)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(Get_Users())
		dispatch(Get_product())
	}, [])

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full p-4 md:p-6 text-gray-900 dark:text-gray-100">
			<div className="flex justify-between items-center mb-6">
				<h1 className='text-2xl md:text-3xl font-semibold'>Dashboard</h1>
			</div>

			<div className='flex flex-col lg:flex-row gap-4 mb-6'>
				<div className='w-full lg:w-7/12 flex flex-col gap-4'>
					<div className='grid md:grid-cols-1 grid-cols-3 gap-3'>
						<div className="bg-red-100 dark:bg-gray-800 rounded-xl flex items-center py-4 px-4 md:px-7 justify-between gap-2 h-[120px] md:h-[130px]">
							<img src="/images/div.MuiBox-root.png" alt="" className='size-16 md:size-20 lg:size-[100px]' />
							<div>
								<p className="text-sm md:text-lg text-gray-500 dark:text-gray-300">TotalProducts</p>
								<p className='text-xl md:text-2xl font-semibold'>{formatNumber(data_products?.products?.reduce((acc, cur) => acc + cur.quantity, 0))}</p>
							</div>
						</div>
						<div className="bg-orange-100 dark:bg-gray-800 rounded-xl gap-2 h-[120px] md:h-[130px] flex py-4 items-center justify-between px-4 md:px-7">
							<img src="/images/iconly-glass-discount.svg.png" className='size-16 md:size-20 lg:size-[100px]' alt="" />
							<div>
								<p className="text-sm md:text-lg text-gray-500 dark:text-gray-300">TotalDiscounts</p>
								<p className='text-xl md:text-2xl font-semibold'>-${formatNumber(data_products?.products?.reduce((acc, cur) => acc + cur.discountPrice * cur.quantity, 0))}</p>
							</div>
						</div>
						<div className="bg-green-100 dark:bg-gray-800 rounded-xl w-full gap-2 h-[120px] md:h-[130px] py-4 flex items-center justify-between px-4 md:px-7">
							<img src="/images/div.MuiBox-root-1.png" alt="" className='size-16 md:size-20 lg:size-[100px]' />
							<div>
								<p className="text-sm md:text-lg text-gray-500 dark:text-gray-300">TotalProfit</p>
								<p className='text-xl md:text-2xl font-semibold'>${formatNumber(data_products?.products?.reduce((acc, cur) => acc + ((cur.price - cur.discountPrice) * cur.quantity), 0))}</p>
							</div>
						</div>
					</div>
					<SalesChart products={data_products?.products} />
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full lg:w-5/12 p-4 md:p-5 rounded-lg">
					<Link to="/admin/products" className="font-semibold hover:border-b border-black dark:border-gray-400 text-lg md:text-xl justify-between flex items-center text-gray-900 dark:text-gray-100">
						Top selling products <ArrowRight size={20} />
					</Link>
					<br />
					{data_products && data_products?.products?.slice(0, 5).map(item =>
						<div key={item.id} className='my-3 flex items-center py-2'>
							<img
								src={import.meta.env.VITE_API_BASE_URL + "images/" + item.image}
								className='size-12 md:size-16 bg-white border-2 rounded-lg object-contain'
								alt=""
							/>
							<div className='ml-2 flex-1 min-w-0'>
								<p className={`font-medium text-sm md:text-base truncate ${item.hasDiscount ? 'text-gray-900 dark:text-gray-200' : 'text-green-500'}`}>
									{item.productName}
								</p>
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{item.categoryName}</p>
							</div>
							<div className='ml-2 text-end'>
								<p className='text-green-500 text-xs md:text-sm'>${formatNumber(item.price)}</p>
								<p className="text-xs md:text-sm text-red-500 dark:text-gray-400">
									{item.hasDiscount ? `-$${formatNumber(item.discountPrice)}` : '-$0'}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className='flex flex-col lg:flex-row gap-4'>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full lg:w-1/2 h-auto lg:h-[400px] p-4 md:p-5 rounded-lg">
					<p className="font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-100">Recent Transactions</p>
					<div className="overflow-x-auto">
						<table className='w-full mt-2 min-w-[500px]'>
							<thead className="border-b border-gray-200 dark:border-gray-700">
								<tr>
									<th className="text-start font-medium pb-4 text-gray-400 dark:text-gray-300">Name</th>
									<th className="font-medium pb-4 text-gray-400 dark:text-gray-300">Data</th>
									<th className="font-medium pb-4 text-gray-400 dark:text-gray-300">Email</th>
									<th className="text-end font-medium pb-4 text-gray-400 dark:text-gray-300">Role</th>
								</tr>
							</thead>
							<tbody>
								{data_users?.slice(0, 6)?.map(item =>
									<tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
										<td className='text-start py-3'>{item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : item.userName}</td>
										<td className='text-center py-3'>{item.dob}</td>
										<td className='text-center py-3'>{item.email || "No email"}</td>
										<td className='text-end py-3'>
											<div className={item?.userRoles[0]?.name.includes("Admin")
												? "text-sm w-fit px-3 py-1 rounded-full ml-auto bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
												: "ml-auto w-fit text-sm px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}>
												{item?.userRoles[0]?.name}
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full lg:w-1/2 h-auto lg:h-[400px] p-4 md:p-5 rounded-lg">
					<p className="font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-100">Top Products by Units Sold</p>
					<div className="overflow-x-auto">
						<table className='w-full mt-2 min-w-[400px]'>
							<thead className="border-b border-gray-200 dark:border-gray-700">
								<tr>
									<th className="text-start font-medium pb-4 text-gray-400 dark:text-gray-300">Name</th>
									<th className="font-medium pb-4 text-gray-400 dark:text-gray-300">Price</th>
									<th className="font-medium text-end pb-4 text-gray-400 dark:text-gray-300">Quantity</th>
								</tr>
							</thead>
							<tbody>
								{data_products?.products && Array.from(data_products.products)?.sort((a, b) => b.quantity - a.quantity).slice(0, 6)?.map(item =>
									<tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
										<td className='text-start py-3'>
											<div className='flex gap-3 items-center min-w-[150px]'>
												<Image
													src={import.meta.env.VITE_API_BASE_URL + "images/" + item.image}
													width={30}
													height={30}
													className='size-[30px] bg-white border-2 rounded-md object-contain'
													alt=""
												/>
												<p className='truncate max-w-[120px]'>{item.productName}</p>
											</div>
										</td>
										<td className='text-center py-3'>${formatNumber(item.price)}</td>
										<td className='text-end py-3'>{formatNumber(item.quantity)}</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard