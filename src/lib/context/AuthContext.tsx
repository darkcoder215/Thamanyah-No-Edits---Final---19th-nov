"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "firebase/auth"
import { signInWithGoogle, signOutUser, subscribeToAuthChanges } from "../firebase/auth"

interface AuthContextType {
	user: User | null
	loading: boolean
	error: string | null
	signInWithGoogleProvider: () => Promise<void>
	logout: () => Promise<void>
	clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const unsubscribe = subscribeToAuthChanges((user) => {
			setUser(user)
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	const signInWithGoogleProvider = async () => {
		try {
			setLoading(true)
			setError(null)
			const { error } = await signInWithGoogle()
			if (error) {
				setError(error)
			}
		} catch (err) {
			setError("An unexpected error occurred during Google sign in.")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const logout = async () => {
		try {
			setLoading(true)
			setError(null)
			const { success, error } = await signOutUser()
			if (!success && error) {
				setError(error)
			}
		} catch (err) {
			setError("An unexpected error occurred during logout.")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const clearError = () => {
		setError(null)
	}

	const value = {
		user,
		loading,
		error,
		signInWithGoogleProvider,
		logout,
		clearError,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
