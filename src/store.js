import { configureStore } from '@reduxjs/toolkit'
import MarketApi from './redux/Api'

export const store = configureStore({
	reducer: {
		Market: MarketApi,
	},
})
