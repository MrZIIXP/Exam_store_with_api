import { atom } from 'jotai'
export const Account = atom(localStorage.getItem('account') || null)
export const Favorite = atom(JSON.parse(localStorage.getItem('favorite')) || [])
