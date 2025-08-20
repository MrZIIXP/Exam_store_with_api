import { DollarCircleOutlined, InstagramOutlined, LinkedinOutlined, ShoppingOutlined, TwitterOutlined } from '@ant-design/icons'
import { Headphones, ShieldCheck, StoreIcon, Truck, Wallet } from 'lucide-react'
import React from 'react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const About = () => {
	const workers = [
		{
			name: "Tom Cruise",
			role: "Founder & Chairman",
			img: "public/images/Header/image 46.png"
		},
		{
			name: "Emma Watson",
			role: "Managing Director",
			img: "public/images/Header/image 47.png"
		},
		{
			name: "Will Smith",
			role: "Product Designer",
			img: "public/images/Header/image 51.png"
		},
		{
			name: "Tom Cruise",
			role: "Founder & Chairman",
			img: "public/images/Header/image 46.png"
		},
		{
			name: "Emma Watson",
			role: "Managing Director",
			img: "public/images/Header/image 47.png"
		},
		{
			name: "Will Smith",
			role: "Product Designer",
			img: "public/images/Header/image 51.png"
		},
		{
			name: "Tom Cruise",
			role: "Founder & Chairman",
			img: "public/images/Header/image 46.png"
		},
		{
			name: "Emma Watson",
			role: "Managing Director",
			img: "public/images/Header/image 47.png"
		},
		{
			name: "Will Smith",
			role: "Product Designer",
			img: "public/images/Header/image 51.png"
		},
	]

	return (
		<div className='min-h-screen bg-white dark:bg-black transition-colors duration-300'>
			<section className="bg-white dark:bg-black py-20 md:px-10 px-[10%] items-center md:flex-col md:text-center flex gap-20 text-gray-900 dark:text-white transition-colors duration-300">
				<div className="w-full text-lg text-start">
					<h2 className="text-4xl font-bold mb-6">Our Story</h2>
					<p className="text-gray-700 dark:text-gray-300">
						Launced in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.
					</p>
					<br />
					<p className="text-gray-700 dark:text-gray-300">Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.</p>
				</div>
				<div className='w-full'>
					<img src="public/images/Header/Side Image.png" className='w-full' alt="Our story" />
				</div>
			</section>

			<section className='px-[10%] py-[100px] md:px-10 flex md:flex-col gap-7 bg-white dark:bg-black transition-colors duration-300'>
				<div className='flex flex-col items-center p-7 w-1/4 md:w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:text-white hover:bg-red-500 duration-300 group transition-all'>
					<div className='size-[60px] text-white flex items-center justify-center mb-2 rounded-full bg-black dark:bg-white dark:text-black border-8 border-white dark:border-gray-800 group-hover:bg-white group-hover:text-black group-hover:border-red-400 duration-300'>
						<StoreIcon />
					</div>
					<p className='font-bold text-[20px] text-black dark:text-white group-hover:text-white'>10.5k</p>
					<p className='text-gray-600 dark:text-gray-400 group-hover:text-white'>Sellers active our site</p>
				</div>

				<div className='flex flex-col items-center p-7 w-1/4 md:w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:text-white hover:bg-red-500 duration-300 group transition-all'>
					<div className='size-[60px] text-white flex items-center justify-center mb-2 rounded-full bg-black dark:bg-white dark:text-black border-8 border-white dark:border-gray-800 group-hover:bg-white group-hover:text-black group-hover:border-red-400 duration-300'>
						<DollarCircleOutlined className='text-[25px]' />
					</div>
					<p className='font-bold text-[20px] text-black dark:text-white group-hover:text-white'>33k</p>
					<p className='text-gray-600 dark:text-gray-400 group-hover:text-white'>Monthly Product Sale</p>
				</div>

				<div className='flex flex-col items-center p-7 w-1/4 md:w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:text-white hover:bg-red-500 duration-300 group transition-all'>
					<div className='size-[60px] text-white flex items-center justify-center mb-2 rounded-full bg-black dark:bg-white dark:text-black border-8 border-white dark:border-gray-800 group-hover:bg-white group-hover:text-black group-hover:border-red-400 duration-300'>
						<ShoppingOutlined className='text-[25px]' />
					</div>
					<p className='font-bold text-[20px] text-black dark:text-white group-hover:text-white'>45.5k</p>
					<p className='text-gray-600 dark:text-gray-400 group-hover:text-white'>Customers active on our site</p>
				</div>

				<div className='flex flex-col items-center p-7 w-1/4 md:w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:text-white hover:bg-red-500 duration-300 group transition-all'>
					<div className='size-[60px] text-white flex items-center justify-center mb-2 rounded-full bg-black dark:bg-white dark:text-black border-8 border-white dark:border-gray-800 group-hover:bg-white group-hover:text-black group-hover:border-red-400 duration-300'>
						<Wallet className='text-black dark:text-black group-hover:text-black' />
					</div>
					<p className='font-bold text-[20px] text-black dark:text-white group-hover:text-white'>25k</p>
					<p className='text-gray-600 dark:text-gray-400 group-hover:text-white'>Annual gross sale in our site</p>
				</div>
			</section>

			<section className='px-[10%] py-[100px] md:px-10 bg-white dark:bg-black transition-colors duration-300'>
				<Swiper
					modules={[Pagination]}
					breakpoints={{ 1024: { slidesPerView: 3 }, 767: { slidesPerView: 1 }, 1440: { slidesPerView: 3 } }}
					loop={true}
					spaceBetween={30}
					pagination={{
						clickable: true,
						dynamicBullets: true,
						renderBullet: function (index, className) {
							return `<span class="${className} custom-swiper-bullet" style="width: 15px; height: 15px; border-radius: 50%; background-color: gray; display: inline-block; margin: 0 4px;"></span>`
						}
					}}
					className='w-full overflow-y-hidden min-h-[404px]'
				>
					{workers.map((item, index) => (
						<SwiperSlide key={index}>
							<div className='h-full mb-20 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300'>
								<div className='w-full h-[314px] bg-gray-300 dark:bg-gray-800 px-3 pt-3 rounded-t-lg'>
									<img src={item.img} className='w-full bg-gray-300 dark:bg-gray-800 h-[300px] object-contain' alt={item.name} />
								</div>
								<br />
								<h1 className='text-[32px] font-medium text-black dark:text-white'>{item.name}</h1>
								<p className='text-gray-600 dark:text-gray-400'>{item.role}</p>
								<div className='flex gap-4 mt-3'>
									<TwitterOutlined className='text-black dark:text-white hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors duration-300' />
									<InstagramOutlined className='text-black dark:text-white hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors duration-300' />
									<LinkedinOutlined className='text-black dark:text-white hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors duration-300' />
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</section>

			<section className="w-full bg-white dark:bg-black pt-20 pb-[250px] md:pb-[100px] border-gray-200 dark:border-gray-800 transition-colors duration-300">
				<div className="max-w-[1200px] mx-auto md:grid-cols-1 md:gap-20 grid grid-cols-3 gap-6 text-center">
					<div className="flex flex-col items-center">
						<div className="bg-black dark:bg-red-600 size-[70px] border-8 border-white dark:border-gray-800 flex items-center justify-center rounded-full">
							<Truck className="size-[30px] leading-[0] text-white" />
						</div>
						<br />
						<h4 className="text-base font-bold mb-1 text-black dark:text-white">FREE AND FAST DELIVERY</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">Free delivery for all orders over $140</p>
					</div>
					<div className="flex flex-col items-center">
						<div className="bg-black dark:bg-red-600 size-[70px] border-8 border-white dark:border-gray-800 flex items-center justify-center rounded-full">
							<Headphones className="size-[30px] text-white" />
						</div>
						<br />
						<h4 className="text-base font-bold mb-1 text-black dark:text-white">24/7 CUSTOMER SERVICE</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">Friendly 24/7 customer support</p>
					</div>
					<div className="flex flex-col items-center">
						<div className="bg-black dark:bg-red-600 size-[70px] border-8 border-white dark:border-gray-800 flex items-center justify-center rounded-full">
							<ShieldCheck className="size-[30px] text-white" />
						</div>
						<br />
						<h4 className="text-base font-bold mb-1 text-black dark:text-white">MONEY BACK GUARANTEE</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">We return money within 30 days</p>
					</div>
				</div>
			</section>
		</div>
	)
}

export default About