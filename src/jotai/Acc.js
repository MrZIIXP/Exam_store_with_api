import { atom } from 'jotai'
export const Account = atom(localStorage.getItem('account') || null)
export const Bag = atom(JSON.parse(localStorage.getItem('bag')) || [])
export const Favorite = atom(JSON.parse(localStorage.getItem('favorite')) || [])
