import { useState, useEffect } from 'react'

const ThemeToggleButton = ({ style }) => {
	const [darkMode, setDarkMode] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('darkMode')
			if (savedTheme !== null) {
				const isDark = savedTheme === 'true'
				setDarkMode(isDark)
				document.documentElement.classList.toggle('dark', isDark)
			}
			else {
				setDarkMode(false)
				document.documentElement.classList.remove('dark')
				localStorage.setItem('darkMode', 'false')
			}
		}
	}, [])

	const toggleDarkMode = () => {
		const newMode = !darkMode
		setDarkMode(newMode)
		localStorage.setItem('darkMode', newMode.toString())
		document.documentElement.classList.toggle('dark', newMode)
	}

	return (
		<button
			onClick={toggleDarkMode}
			className={`px-4 py-2 rounded-md bg-white text-black border border-black dark:border-white hover:scale-105 dark:bg-black dark:text-white transition-all duration-300 ${style} `}
		>
			{darkMode ? 'Светлая тема' : 'Темная тема'}
		</button>
	)
}

export default ThemeToggleButton