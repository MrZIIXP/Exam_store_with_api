import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../config'

export const Get_product = createAsyncThunk('Market/Get_product', async () => {
	const { data } = await API.get('Product/get-products?PageSize=1000')
	return data.data
})

export const Add_product = createAsyncThunk(
	'Market/Add_product',
	async formData => {
		await API.post('Product/add-product', formData)
	}
)

export const Del_product = createAsyncThunk('Market/Del_product', async id => {
	await API.delete(`Product/delete-product?id=${id}`)
})

export const Get_Users = createAsyncThunk('Market/Get_Users', async () => {
	const { data } = await API.get('UserProfile/get-user-profiles?PageSize=1000')
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

export const Edit_profile = createAsyncThunk(
	'Market/Edit_profile',
	async data => {
		await API.put(`UserProfile/update-user-profile`, data)
	}
)

export const Get_profile = createAsyncThunk(
	'Market/Get_profile',
	async name => {
		const data = await API.get(`UserProfile/get-user-profile-by-id?id=${name}`)
		return data.data.data
	}
)

export const Delete_user = createAsyncThunk('Market/Delete_user', async id => {
	await API.delete(`UserProfile/delete-user?id=${id}`)
})

export const get_roles = createAsyncThunk('Market/get_roles', async () => {
	const { data } = await API.get('UserProfile/get-user-roles')
	return data.data
})

export const add_role = createAsyncThunk(
	'Market/add_role',
	async (id, RoleId) => {
		await API.post(
			`UserProfile/addrole-from-user?UserId=${id}&RoleId=${RoleId}`
		)
	}
)

export const MarketApi = createSlice({
	name: 'Market',
	initialState: {
		messages: localStorage.getItem('messages')
			? JSON.parse(localStorage.getItem('messages'))
			: [],
		unreaded_message: localStorage.getItem('messages')
			? JSON.parse(localStorage.getItem('messages'))?.filter(
					item => item.read === false
			  )?.length
			: 0,

		set_category: null,
		set_brand: null,
		set_product: null,
		set_feature: null,
		set_profile: null,

		data_profile: {},
		data_users: [],
		data_products: [],
		data_product_by_id: [],
		data_brands: [],
		data_cart: [],
		data_features: [],
		data_category: [],

		favourite: JSON.parse(localStorage.getItem('favorite')) || [],
		account: localStorage.getItem('account') || null,

		del_product: false,
		add_product: false,
		del_user: false,
		profile_loading: false,
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
		account_reset: state => {
			state.account = null
		},
		_fav_reset: state => {
			state.favourite = []
		},
		_toggle_favourite: (state, { payload }) => {
			if (payload.fav) {
				state.favourite = state.favourite.filter(
					item =>
						item.id !== payload.id && item.productName !== payload.productName
				)
				localStorage.setItem('favorite', JSON.stringify(state.favourite))
			} else {
				state.favourite = [...state.favourite, payload]
				localStorage.setItem('favorite', JSON.stringify(state.favourite))
			}
		},
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

			.addCase(Get_profile.pending, state => {
				state.profile_loading = true
				state.error = null
			})
			.addCase(Get_profile.fulfilled, (state, action) => {
				state.profile_loading = false
				state.data_profile = action.payload
			})
			.addCase(Get_profile.rejected, (state, action) => {
				state.profile_loading = false
				state.error = action.error.message
			})

			.addCase(Delete_user.pending, state => {
				state.del_user = true
				state.error = null
			})
			.addCase(Delete_user.fulfilled, state => {
				state.del_user = false
			})
			.addCase(Delete_user.rejected, (state, action) => {
				state.del_user = false
				state.error = action.error.message
			})

			.addCase(Add_product.pending, state => {
				state.error = null
				state.add_product = true
			})
			.addCase(Add_product.fulfilled, state => {
				state.add_product = false
			})
			.addCase(Add_product.rejected, (state, action) => {
				state.error = action.error.message
				state.add_product = false
			})

			.addCase(Del_product.pending, state => {
				state.error = null
				state.del_product = true
			})
			.addCase(Del_product.fulfilled, state => {
				state.del_product = false
			})
			.addCase(Del_product.rejected, (state, action) => {
				state.error = action.error.message
				state.del_product = false
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
	_toggle_favourite,
	_fav_reset,
	account_reset,
} = MarketApi.actions
