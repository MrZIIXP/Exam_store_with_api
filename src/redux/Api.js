import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../config'

export const Get_product = createAsyncThunk('Market/Get_product', async () => {
	const { data } = await API.get('Product/get-products')
	return data.data
})

export const Get_Users = createAsyncThunk('Market/Get_Users', async () => {
	const { data } = await API.get('UserProfile/get-user-profiles')
	return data.data
})

export const Get_Brands = createAsyncThunk('Market/Get_Brands', async () => {
	const { data } = await API.get('Brand/get-brands')
	return data.data
})

export const Get_Cart = createAsyncThunk('Market/Get_Cart', async () => {
	const { data } = await API.get('Cart/get-products-from-cart')
	return data.data
})

export const Get_Category = createAsyncThunk(
	'Market/Get_Category',
	async () => {
		const { data } = await API.get('Category/get-categories')
		return data.data
	}
)

export const Get_Features = createAsyncThunk(
	'Market/Get_Features',
	async () => {
		const { data } = await API.get('SubCategory/get-sub-category')
		return data.data
	}
)

export const Get_product_by_id = createAsyncThunk(
	'Market/Get_product_by_id',
	async id => {
		const { data } = await API.get(`Product/get-product-by-id?id=${id}`)
		return data.data
	}
)

export const Get_Users_by_id = createAsyncThunk(
	'Market/Get_Users_by_id',
	async id => {
		const { data } = await API.get(
			`UserProfile/get-user-profile-by-id?id=${id}`
		)
		return data.data
	}
)

export const Get_Features_by_id = createAsyncThunk(
	'Market/Get_Features_by_email',
	async id => {
		const { data } = await API.get(
			`UserProfile/get-user-sub-category-by-id?id=${id}`
		)
		return data.data
	}
)

export const Get_Brands_by_id = createAsyncThunk(
	'Market/Get_Brands_by_id',
	async id => {
		const { data } = await API.get(`Brand/get-brand-by-id?id=${id}`)
		return data.data
	}
)

export const Get_Category_by_id = createAsyncThunk(
	'Market/Get_Category_by_id',
	async id => {
		const { data } = await API.get(`Category/get-category-by-id?id=${id}`)
		return data.data
	}
)

export const Add_to_Cart = createAsyncThunk('Market/Add_to_Cart', async id => {
	await API.post(`Cart/add-product-to-cart?id=${id}`)
	const { data } = await API.get('Product/get-products')
	return data.data
})

export const Increment_into_Cart = createAsyncThunk(
	'Market/Increment_into_Cart',
	async id => {
		await API.put(`Cart/increase-product-in-cart?id=${id}`)
		return id
	}
)

export const Decriment_into_Cart = createAsyncThunk(
	'Market/Decriment_into_Cart',
	async id => {
		await API.put(`Cart/reduce-product-in-cart?id=${id}`)
		return id
	}
)

export const Delete_from_Cart = createAsyncThunk(
	'Market/Delete_from_Cart',
	async id => {
		await API.delete(`Cart/delete-product-from-cart?id=${id}`)
		return id
	}
)

export const Delete_All_from_Cart = createAsyncThunk(
	'Market/Delete_All_from_Cart',
	async () => {
		await API.delete(`Cart/clear-cart`)
	}
)

export const MarketApi = createSlice({
	name: 'Market',
	initialState: {

		messages: localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages')) : [],
		unreaded_message: localStorage.getItem("messages") ? JSON.parse(localStorage.getItem("messages"))?.filter((item) => item.read === false)?.length : 0,

		set_category: null,
		set_brand: null,
		set_product: null,
		set_feature: null,
		set_profile: null,

		data_users: [],
		data_products: [],
		data_product_by_id: [],
		data_brands: [],
		data_cart: [],
		data_features: [],
		data_category: [],

		users_loading: false,
		brands_loading: false,
		category_loading: false,
		features_loading: false,
		product_loading: false,
		cart_loading: false,
		increment_loading: false,
		decrement_loading: false,
		delete_loading: false,
		delete_all_loading: false,
		add_to_cart_loading: false,

		error: null,
	},
	reducers: {
		_set_massanges: (state, action) => {
			state.messages = action.payload
		},
		_set_unreaded_message: (state, action) => {
			state.unreaded_message = action.payload
		},
		_set_category: (state, action) => {
			state.set_category = action.payload
		},
		_set_brand: (state, action) => {
			state.set_brand = action.payload
		},
		_set_product: (state, action) => {
			state.data_brands = action.payload
		},
		_set_feature: (state, action) => {
			state.data_features = action.payload
		},
		_set_profile: (state, action) => {
			state.set_profile = action.payload
		},
		_clear_error: state => {
			state.error = null
		},
	},
	extraReducers: build => {
		build
			.addCase(Get_product.pending, state => {
				state.product_loading = true
				state.error = null
			})
			.addCase(Get_product.fulfilled, (state, action) => {
				state.product_loading = false
				state.data_products = action.payload
			})
			.addCase(Get_product.rejected, (state, action) => {
				state.product_loading = false
				state.error = action.error.message
			})

			.addCase(Get_Users.pending, state => {
				state.users_loading = true
				state.error = null
			})
			.addCase(Get_Users.fulfilled, (state, action) => {
				state.users_loading = false
				state.data_users = action.payload
			})
			.addCase(Get_Users.rejected, (state, action) => {
				state.users_loading = false
				state.error = action.error.message
			})

			.addCase(Get_Brands.pending, state => {
				state.brands_loading = true
				state.error = null
			})
			.addCase(Get_Brands.fulfilled, (state, action) => {
				state.brands_loading = false
				state.data_brands = action.payload
			})
			.addCase(Get_Brands.rejected, (state, action) => {
				state.brands_loading = false
				state.error = action.error.message
			})

			.addCase(Get_Cart.pending, state => {
				state.cart_loading = true
				state.error = null
			})
			.addCase(Get_Cart.fulfilled, (state, action) => {
				state.cart_loading = false
				state.data_cart = action.payload
			})
			.addCase(Get_Cart.rejected, (state, action) => {
				state.cart_loading = false
				state.error = action.error.message
			})

			.addCase(Get_Category.pending, state => {
				state.category_loading = true
				state.error = null
			})
			.addCase(Get_Category.fulfilled, (state, action) => {
				state.category_loading = false
				state.data_category = action.payload
			})
			.addCase(Get_Category.rejected, (state, action) => {
				state.category_loading = false
				state.error = action.error.message
			})

			.addCase(Get_Features.pending, state => {
				state.features_loading = true
				state.error = null
			})
			.addCase(Get_Features.fulfilled, (state, action) => {
				state.features_loading = false
				state.data_features = action.payload
			})
			.addCase(Get_Features.rejected, (state, action) => {
				state.features_loading = false
				state.error = action.error.message
			})

			.addCase(Get_product_by_id.pending, state => {
				state.product_loading = true
				state.error = null
			})
			.addCase(Get_product_by_id.fulfilled, (state, action) => {
				state.product_loading = false
				state.data_product_by_id = action.payload
			})
			.addCase(Get_product_by_id.rejected, (state, action) => {
				state.product_loading = false
				state.error = action.error.message
			})

			.addCase(Add_to_Cart.pending, state => {
				state.add_to_cart_loading = true
				state.error = null
			})
			.addCase(Add_to_Cart.fulfilled, (state, action) => {
				state.add_to_cart_loading = false
				state.data_products = action.payload
			})
			.addCase(Add_to_Cart.rejected, (state, action) => {
				state.add_to_cart_loading = false
				state.error = action.error.message
			})

			.addCase(Increment_into_Cart.pending, state => {
				state.increment_loading = true
				state.error = null
			})
			.addCase(Increment_into_Cart.fulfilled, state => {
				state.increment_loading = false
			})
			.addCase(Increment_into_Cart.rejected, (state, action) => {
				state.increment_loading = false
				state.error = action.error.message
			})

			.addCase(Decriment_into_Cart.pending, state => {
				state.decrement_loading = true
				state.error = null
			})
			.addCase(Decriment_into_Cart.fulfilled, state => {
				state.decrement_loading = false
			})
			.addCase(Decriment_into_Cart.rejected, (state, action) => {
				state.decrement_loading = false
				state.error = action.error.message
			})

			.addCase(Delete_from_Cart.pending, state => {
				state.delete_loading = true
				state.error = null
			})
			.addCase(Delete_from_Cart.fulfilled, state => {
				state.delete_loading = false
			})
			.addCase(Delete_from_Cart.rejected, (state, action) => {
				state.delete_loading = false
				state.error = action.error.message
			})

			.addCase(Delete_All_from_Cart.pending, state => {
				state.delete_all_loading = true
				state.error = null
			})
			.addCase(Delete_All_from_Cart.fulfilled, state => {
				state.delete_all_loading = false
				state.data_cart = []
			})
			.addCase(Delete_All_from_Cart.rejected, (state, action) => {
				state.delete_all_loading = false
				state.error = action.error.message
			})
	},
})

export default MarketApi.reducer
export const {
	_set_brand,
	_set_category,
	_set_profile,
	_set_feature,
	_set_product,
	_clear_error,
	_set_massanges,
	_set_unreaded_message,
} = MarketApi.actions
