import { ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, CheckCircleOutlined, HeartFilled, HeartOutlined, LoadingOutlined } from '@ant-design/icons'
import { Eye, Headphones, Search, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "swiper/css/pagination"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/swiper-bundle.css"
import { useDispatch, useSelector } from 'react-redux'
import { _set_category, Add_to_Cart, Get_Category, Get_Cart, Get_product, _toggle_favourite } from '../redux/Api'
import { notification } from 'antd'

export function MinCard({ text, button, className, func, disable = false }) {
  const [api, contextHolder] = notification.useNotification()

  const handleClick = () => {
    if (func && typeof func === "function") {
      func()
    }

    api.open({
      message: text,
      description: '',
      duration: 1,
      showProgress: true,
      pauseOnHover: false,
      placement: "bottom",
      className: "rounded-xl bg-white text-black dark:text-white"
    })
  }

  return (
    <>
      {contextHolder}
      <button
        disabled={disable}
        onClick={handleClick}
        className={className}
      >
        {button}
      </button>
    </>
  )
}

export function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { account: acc, add_cart_load, favourite: favo } = useSelector(state => state.Market)
  const [clicked, setClick] = useState(false)
  const isFavorite = favo?.some((item) => item.id === product.id)

  const handleToggleFavorite = () => {
    dispatch(_toggle_favourite({ id: product.id, productName: product.productName, fav: isFavorite }))
  }

  return (<div className="bg-white dark:bg-black transition-all transform-gpu dark:border dark:border-white dark:p-5 dark:rounded-xl duration-300">
    <div className="relative bg-[#F5F5F5] p-5 rounded-lg overflow-hidden">
      <img
        src={import.meta.env.VITE_API_BASE_URL + "images/" + product.image}
        onError={(e) => { e.target.src = "/images/image.png" }}
        alt={product.productName}
        className="w-full h-[250px] object-center object-contain md:object-contain mix-blend-multiply dark:mix-blend-multiply"
      />
      {product.hasDiscount && (
        <div className="absolute rounded-md top-3 left-3 bg-[#DB4444] text-white w-[60px] text-center px-[10px] text-sm py-1">
          -${product.discountPrice}
        </div>
      )}
      {!product.hasDiscount &&
        <div className="absolute rounded-md top-3 left-3 bg-green-500 text-white w-[60px] text-center px-[10px] text-sm py-1">
          NEW
        </div>
      }
      <div>
        {acc && <MinCard
          text={!isFavorite ? "Added to favorite" : "Delete from favorite"}
          button={isFavorite ? <HeartFilled className="dark:group-hover:text-white text-red-500 group-hover:text-white" /> : <HeartOutlined className="text-black group-hover:text-white dark:text-white" />}
          className="absolute rounded-full top-[10px] right-[10px] bg-white group dark:bg-gray-800 text-black dark:text-white flex justify-center items-center text-lg dark:hover:bg-red-500 size-9 hover:bg-red-500 hover:text-white transition-colors duration-300"
          func={handleToggleFavorite}
        />}
        {acc ?
          <Link to={`/products/${product.productName.replaceAll(" ", "&") + "!" + product.id + "!" + product.price + "!" + product.image + "!" + product.categoryName}`} className="absolute transform hover:scale-125 transition-all duration-300  rounded-full top-[55px] right-[10px] bg-white dark:bg-gray-800 text-black dark:text-white flex justify-center items-center text-lg size-9 hover:bg-red-500 hover:text-white"><Eye /></Link>
          :
          <Link to={`/products/${product.productName.replaceAll(" ", "&") + "!" + product.id + "!" + product.price + "!" + product.image + "!" + product.categoryName}`} className="absolute transform hover:scale-125 transition-all duration-300  rounded-full top-[15px] right-[10px] bg-white dark:bg-gray-800 text-black dark:text-white flex justify-center items-center text-lg size-9 hover:bg-red-500 hover:text-white"><Eye /></Link>
        }
        {!clicked && acc && <div style={{ display: product.productInMyCart ? "none" : "block" }} onClick={() => { (!product.productInMyCart && !clicked) && dispatch(Add_to_Cart(product.id)), setTimeout(() => { dispatch(Get_Cart()) }, 200), setClick(true), console.log("Add") }} className='w-full absolute bottom-0 left-0'>
          <MinCard disable={add_cart_load} className='w-full absolute bottom-0 left-0 py-3 bg-black dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300' button="Add to cart" text={<div><CheckCircleOutlined className='mr-2 text-green-500' />Added to cart</div>} />
        </div>}
      </div>
    </div>

    <div className="mt-4 grid gap-2">
      <h3 className="text-sm font-medium text-black dark:text-white">{product.productName}</h3>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-red-500 font-semibold">${product.price}</span>
        {product.hasDiscount && (
          <span className="line-through text-gray-500 dark:text-gray-400">${product.price - product.discountPrice}</span>
        )}
        <span className="text-black dark:text-white">({product.quantity})</span>
      </div>
    </div>
  </div >)
}

const Home = () => {
  const baner = [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    },
    {
      id: 4
    },
    {
      id: 5
    }
  ]
  const pagination = {
    clickable: true,
    dynamicBullets: true,
    renderBullet: function (index, className) {
      return `<span class="${className} custom-swiper-bullet" style="width: 15px; height: 15px; border-radius: 50%; background-color: white; display: inline-block; margin: 0 4px;"></span>`
    }
  }
  const { data_category: categoruies, account: acc, category_loading, product_loading, error, data_products } = useSelector(state => state.Market)
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const check = () => {
    if (!localStorage.getItem("time")) {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + 3)
      localStorage.setItem("time", targetDate)
    }
  }

  useEffect(() => {
    check()
    const calculateTimeLeft = () => {
      const targetDate = new Date(localStorage.getItem("time")).getTime() || new Date().setDate(new Date().getDate() + 3)
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
      else {
        localStorage.removeItem("time")
        check()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (acc) {
      dispatch(Get_Cart())
    }
    dispatch(Get_product())
    dispatch(Get_Category())
  }, [])


  if (error) {
    return <div className='flex justify-center items-center h-screen text-[100px] bg-white dark:bg-black text-black dark:text-white'>{error === "Network Error" ? <p className='font-semibold'>Network <span className='text-red-500'>Error</span></p> : error == "401 (Unauthorized)" ? <p className='font-semibold'>Change to login</p> : <p className='font-semibold'>Something <span className='text-red-500'>went</span> wrong </p>}</div>
  }

  return (<div className='bg-white dark:bg-black text-black dark:text-white transition-colors duration-300'>
    <section className='px-[10%] md:px-0 py-2 flex min-h-[404px] md:flex-col'>
      <div className='relative w-full px-5 hidden md:flex items-center rounded-md mx-auto'>
        <input
          type="text"
          className='border border-black dark:border-white w-full rounded-md px-[12px] py-[16px] placeholder-black dark:placeholder-white placeholder:text-[20px] bg-white dark:bg-gray-900 text-black dark:text-white'
          placeholder='Search'
        />
        <Search className='absolute right-8 text-[25px] text-black dark:text-white' />
      </div>
      <div style={{ scrollbarColor: "transparent transparent" }} className='grid gap-4 max-w-[238px] pl-3 overflow-y-scroll w-full max-h-[454px] h-full border-r pr-[20px] pt-[40px] md:overflow-y-hidden md:p-1 md:mt-5 md:max-w-full md:px-5 md:flex md:flex-wrap border-gray-200 dark:border-gray-800'>
        {!category_loading ? categoruies.map(item => (
          <p
            onClick={() => {
              dispatch(_set_category(item.categoryName))
              navigator(`/products`)
            }}
            className='w-full md:w-auto md:px-[20px] md:py-2 md:bg-gray-200 md:dark:bg-gray-800 md:rounded-md flex justify-between items-center rounded-md border border-transparent transition-all duration-200 cursor-pointer p-2 hover:border-black dark:hover:border-white hover:shadow-md hover:scale-[1.05] origin-center text-black dark:text-white'
            key={item.id}
          >
            {item.categoryName}
          </p>
        )) : <div className='w-full py-[20px] text-black dark:text-white text-[40px] text-center'><LoadingOutlined /></div>}
      </div>
      <div className='h-full w-full min-h-[404px] pt-[20px] pl-[40px] overflow-hidden md:overflow-auto md:pl-0'>
        <Swiper modules={[Pagination, Autoplay]} autoplay={{ delay: 3000 }} loop={true} pagination={pagination} className='w-full overflow-y-hidden min-h-[404px]'>{baner.map((item) => <SwiperSlide key={item.id}><img src={"/images/Header/Снимок экрана 2025-08-16 171212.png"} className='w-full min-h-[404px] bg-black dark:border-2 dark:border-gray-800 dark:rounded-lg object-contain' alt="" /></SwiperSlide>)}</Swiper>
      </div>
    </section>

    <section className='mt-16 md:mt-4'>
      <div className='md:px-4 px-[10%] flex flex-col items-start w-full'>
        <div className='text-[#DB4444] items-center font-semibold flex gap-2'>
          <div className='w-5 h-10 rounded-md bg-[#DB4444]' />
          Today's
        </div>

        <div className='mt-6 md:mt-[24px] w-full flex md:flex-col gap-4 md:gap-0'>
          <p className='text-[28px] md:text-[36px] font-semibold text-black dark:text-white'>Flash Sales</p>

          <div className='grid ml-[83px] md:ml-0'>
            <div className='text-[12px] font-medium gap-5 flex justify-between text-black dark:text-white'>
              <p>Days</p>
              <p>Hours</p>
              <p>Minutes</p>
              <p>Seconds</p>
            </div>
            <div className='text-[24px] md:text-[32px] text-[#E07575] flex justify-between'>
              <p className='text-black dark:text-white'>{timeLeft.days}</p>:
              <p className='text-black dark:text-white'>{timeLeft.hours}</p>:
              <p className='text-black dark:text-white'>{timeLeft.minutes}</p>:
              <p className='text-black dark:text-white'>{timeLeft.seconds}</p>
            </div>
          </div>

          <div className='ml-auto flex gap-2 md:hidden'>
            <button className='flex items-center justify-center size-[36px] md:size-[40px] rounded-full bg-gray-200 dark:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 prod_prev text-black dark:text-white'>
              <ArrowLeftOutlined />
            </button>
            <button className='flex items-center justify-center size-[36px] md:size-[40px] rounded-full bg-gray-200 dark:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 prod_next text-black dark:text-white'>
              <ArrowRightOutlined />
            </button>
          </div>
        </div>

        <br />
        {!product_loading ? <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.prod_prev',
            nextEl: '.prod_next',
          }}
          loop={true}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className='w-full'
        >
          {data_products?.products?.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper> : <div className='w-full py-[100px] text-[40px] text-center'><LoadingOutlined /></div>}

        <br />
        <Link
          to="/products"
          className='py-3 md:py-4 mt-2 px-6 md:px-[48px] text-center self-center bg-[#DB4444] text-white rounded-md hover:bg-red-600 transition-colors duration-300'
        >
          View All Products
        </Link>
      </div>
    </section>

    <section className='mt-16 md:px-4 px-[10%]'>
      <div className=' py-16 border-y-2 flex flex-col items-start w-full border-gray-200 dark:border-gray-800'>
        <div className='text-[#DB4444] items-center font-semibold flex gap-2'>
          <div className='w-5 h-10 rounded-md bg-[#DB4444]' />
          Categories
        </div>

        <div className='mt-2 w-full flex md:flex-col gap-4 md:gap-0'>
          <p className='md:text-[28px] text-[36px] font-semibold text-black dark:text-white'>Browse By Category</p>

          <div className='ml-auto flex gap-2 md:hidden'>
            <button className='flex items-center justify-center size-[36px] md:size-[40px] rounded-full bg-gray-200 dark:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 cate_prev text-black dark:text-white'>
              <ArrowLeftOutlined />
            </button>
            <button className='flex items-center justify-center size-[36px] md:size-[40px] rounded-full bg-gray-200 dark:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 cate_next text-black dark:text-white'>
              <ArrowRightOutlined />
            </button>
          </div>
        </div>

        <br />
        {!category_loading ? <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.cate_prev',
            nextEl: '.cate_next',
          }}
          loop={true}
          spaceBetween={30}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
          className='w-full'
        >
          {categoruies.map((product) => (
            <SwiperSlide key={product.id} onClick={() => {
              dispatch(_set_category(product.categoryName))
              navigator(`/products`)
            }} className='p-3'>
              <div className='flex flex-col items-center group text-center hover:scale-110 transition-all duration-300 justify-center min-h-[145px] min-w-[170px] border-2 rounded-lg hover:bg-[#DB4444] hover:text-white gap-2 border-gray-200 dark:border-gray-800 text-black dark:text-white'>
                <p className='scale-120 dark:invert group-hover:invert'><img src={import.meta.env.VITE_API_BASE_URL + "images/" + product.categoryImage} alt="" /></p>
                <p>{product.categoryName}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper> : <div className='w-full py-[100px] text-[40px] text-center'><LoadingOutlined /></div>}
      </div>
    </section>

    <section className='my-16'>
      <div className='md:px-4 px-[10%] flex flex-col items-start w-full'>
        <div className='text-[#DB4444] items-center font-semibold flex gap-2'>
          <div className='w-5 h-10 rounded-md bg-[#DB4444]' />
          This Month
        </div>

        <div className='mt-6 md:mt-[24px] w-full flex md:flex-col md:items-start gap-4 md:gap-0'>
          <p className='text-[28px] md:text-[36px] font-semibold text-black dark:text-white'>Best Selling Products</p>

          <Link
            to="/products"
            className='py-3 md:py-4 mt-2 px-6 ml-auto md:px-[48px] md:ml-0 bg-[#DB4444] text-white rounded-md hover:bg-red-600 transition-colors duration-300'
          >
            View All
          </Link>
        </div>

        <br />
        {data_products?.products && <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.prod_prev',
            nextEl: '.prod_next',
          }}
          loop={true}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className='w-full'
        >
          {data_products?.products?.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>}
      </div>
    </section>

    <section className="mt-16 bg-black dark:bg-gray-900 w-[80%] md:w-full px-[56px] py-[40px] items-center mx-auto flex flex-row md:flex-col md:items-center gap-16">
      <div className="flex flex-col gap-4 text-white">
        <p className="text-green-600 font-medium text-[16px] md:text-[14px]">Categories</p>
        <h2 className="text-[36px] md:text-[28px] font-semibold  leading-tight">
          Enhance Your Music Experience
        </h2>

        <div className="flex gap-2">
          <div className='size-[62px] rounded-full flex items-center flex-col leading-[0px] pb-2 scale-[0.8] justify-center bg-white text-black'>
            <p className='font-bold text-lg'>{timeLeft.days}</p>
            <p className='text-sm'>Hours</p>
          </div>
          <div className='size-[62px] rounded-full flex items-center flex-col leading-[0px] pb-2 scale-[0.8] justify-center bg-white text-black'>
            <p className='font-bold text-lg'>{timeLeft.hours}</p>
            <p className='text-sm'>Days</p>
          </div>
          <div className='size-[62px] rounded-full flex items-center flex-col leading-[0px] pb-2 scale-[0.8] justify-center bg-white text-black'>
            <p className='font-bold text-lg'>{timeLeft.minutes}</p>
            <p className='text-sm'>Minutes</p>
          </div>
          <div className='size-[62px] rounded-full flex items-center flex-col leading-[0px] pb-2 scale-[0.8] justify-center bg-white text-black'>
            <p className='font-bold text-lg'>{timeLeft.seconds}</p>
            <p className='text-sm'>Seconds</p>
          </div>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md w-fit transition-colors duration-300">
          Buy Now!
        </button>
      </div>

      <div className="w-full relative flex items-center justify-center max-w-[500px]">
        <div className='size-[1px] bg-white absolute z-0 shadow-[0px_0px_1000px_130px_white] md:shadow-[0px_0px_300px_80px_white]' />
        <img
          src="/images/Header/Frame 694.png"
          alt="JBL Speaker"
          className="w-full h-auto relative z-10 object-contain"
        />
      </div>
    </section>

    <section className='my-16'>
      <div className='md:px-4 px-[10%] flex flex-col items-start w-full'>
        <div className='text-[#DB4444] items-center font-semibold flex gap-2'>
          <div className='w-5 h-10 rounded-md bg-[#DB4444]' />
          This Month
        </div>

        <div className='mt-6 md:mt-[24px] w-full flex md:flex-col gap-4 md:gap-0'>
          <p className='text-[28px] md:text-[36px] font-semibold text-black dark:text-white'>Best Selling Products</p>
        </div>

        <br />
        <div className='grid md:hidden grid-cols-4 gap-[16px]'>
          {data_products?.products?.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
        <div className='w-full hidden md:block'>
          <Swiper
            loop={true}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1023: { slidesPerView: 3 },
            }}
            className='w-full'
          >
            {data_products?.products?.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>

    <section className="w-full py-12 bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full px-[10%] md:px-0 grid grid-cols-4 gap-6 md:grid-cols-1">
        <div
          className="col-start-1 dark:border-white dark:border-2 col-end-3 md:bg-contain md:h-[300px] row-start-1 rounded-md row-end-3 bg-no-repeat md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 bg-bottom h-full bg-black text-white p-4 flex flex-col justify-end"
          style={{
            backgroundImage: 'url("/images/Header/ps5-slim-goedkope-playstation_large 1.png")',
          }}
        >
          <p className="text-sm font-semibold mb-1">Featured</p>
          <h2 className="text-xl font-bold mb-2">New Arrival</h2>
          <h3 className="text-lg font-semibold mb-1">PlayStation 5</h3>
          <p className="text-sm mb-3">
            Black and White version of the PS5 coming out on sale.
          </p>
          <a href="/shop/ps5" className="text-sm font-semibold underline">
            Shop Now
          </a>
        </div>

        <div
          className="col-start-3 dark:border-white dark:border-2 md:col-start-1 md:col-end-2 col-end-5 bg-no-repeat rounded-md bg-right-bottom bg-[#0D0D0D] text-white h-[300px] p-4 flex flex-col justify-end"
          style={{
            backgroundImage: 'url("/images/Header/attractive-woman-wearing-hat-posing-black-background 1.png")',
          }}
        >
          <h3 className="text-lg font-semibold mb-1">Women's Collections</h3>
          <p className="text-sm mb-3">
            Featured woman collections that give you another vibe.
          </p>
          <a href="/shop/women" className="text-sm font-semibold underline">
            Shop Now
          </a>
        </div>

        <div
          className="col-span-1 bg-no-repeat dark:border-white dark:border-2 bg-[#232323] rounded-md text-white bg-center h-[300px] p-4 flex flex-col justify-end"
          style={{
            backgroundImage: 'url("/images/Header/Frame 707.png")',
          }}
        >
          <h3 className="text-lg font-semibold mb-1">Speakers</h3>
          <p className="text-sm mb-3">Amazon wireless speakers</p>
          <a href="/shop/speakers" className="text-sm font-semibold underline">
            Shop Now
          </a>
        </div>

        <div
          className="col-span-1 bg-no-repeat dark:border-white dark:border-2 text-white bg-[#323232] rounded-md bg-center h-[300px] p-4 flex flex-col justify-end"
          style={{
            backgroundImage: 'url("/images/Header/652e82cd70aa6522dd785109a455904c.png")',
          }}
        >
          <h3 className="text-lg font-semibold mb-1">Perfume</h3>
          <p className="text-sm mb-3">GUCCI INTENSE OUD EDP</p>
          <a href="/shop/perfume" className="text-sm font-semibold underline">
            Shop Now
          </a>
        </div>
      </div>
    </section>

    <section className="w-full bg-white dark:bg-black pt-20 pb-[250px] md:pb-[100px] border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto md:grid-cols-1 md:gap-20 grid grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-black dark:bg-red-600 size-[70px] border-8 border-white dark:border-gray-800 flex items-center justify-center rounded-full">
            <Truck className="size-[30px] leading-[0] text-white" />
          </div>
          <br />
          <h4 className="text-base font-bold mb-1 text-black dark:text-white">FREE AND FAST DELIVERY</h4>
          <p className="text-sm text-black dark:text-white">Free delivery for all orders over $140</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-black dark:bg-red-600 size-[70px] border-8 border-white dark:border-gray-800 flex items-center justify-center rounded-full">
            <Headphones className="size-[30px] text-white" />
          </div>
          <br />
          <h4 className="text-base font-bold mb-1 text-black dark:text-white">24/7 CUSTOMER SERVICE</h4>
          <p className="text-sm text-black dark:text-white">Friendly 24/7 customer support</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-black dark:bg-red-600 size-[70px] border-8 border-white dark:border-gray-800 flex items-center justify-center rounded-full">
            <ShieldCheck className="size-[30px] text-white" />
          </div>
          <br />
          <h4 className="text-base font-bold mb-1 text-black dark:text-white">MONEY BACK GUARANTEE</h4>
          <p className="text-sm text-black dark:text-white">We return money within 30 days</p>
        </div>
      </div>
    </section>

    <div className='w-full bg-white dark:bg-black transition-colors duration-300'>
      <button className='size-[40px] md:size-[80px] md:text-[32px] ml-auto mr-[10%] mb-[2%] bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-300' onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}><ArrowUpOutlined /></button>
    </div>
  </div>)
}

export default Home