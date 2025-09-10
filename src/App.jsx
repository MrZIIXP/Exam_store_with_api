import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Error from './components/Error'
import Products from './components/Products'
import About from './components/About'
import Favourite from './components/Favourite'
import By_Id from './components/By_Id'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Contact from './components/Contact'
import Account from './components/Accaunt'
import AdminUsers from './components/AdmiUser'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './components/AdminDashboard'
import AdminProducts from './components/AdminProducts'
import AdminLog from './components/AdminLog'
import AdminAddProduct from './components/AdminAddProduct'
import AdminOther from './components/AdminOther'

const App = () => {
	const router = createBrowserRouter([{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />
			},
			{
				path: "register",
				element: <Register />
			},
			{
				path: "login",
				element: <Login />
			},
			{
				path: "about",
				element: <About />
			},
			{
				path: "contact",
				element: <Contact />
			},
			{
				path: "cart/checkout",
				element: <Checkout />
			},
			{
				path: "favourite",
				element: <Favourite />
			},
			{
				path: "/cart",
				element: <Cart />
			},
			{
				path: "products",
				element: <Products />
			},
			{
				path: "products/:id",
				element: <By_Id />
			},
			{
				path: "*",
				element: <Error />
			},
			{
				path: "account",
				element: <Account />
			},

		]
	},
	{
		path: "/admin/login",
		element: <AdminLog />
	},
	{
		path: "/admin/",
		element: <AdminLayout />,
		children: [
			{
				index: true,
				element: < AdminDashboard />
			},
			{
				path: "orders",
				element: <AdminUsers />
			},
			{
				path: "*",
				element: <Error />
			},
			{
				path: "products",
				element: <AdminProducts />
			},
			{
				path: "products/add_new_product",
				element: <AdminAddProduct/>
			},
			{
				path: "other",
				element: <AdminOther/>
			}
		]
	}
	])
	return (<RouterProvider router={router}></RouterProvider>)
}

export default App