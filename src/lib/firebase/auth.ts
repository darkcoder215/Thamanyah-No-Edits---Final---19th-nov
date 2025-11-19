import {
	AuthError,
	GoogleAuthProvider,
	User,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from "firebase/auth"
import { auth } from "./firebaseConfig"

// Check if a user's email is from thmanyah.com domain
export const isCompanyEmail = (email: string): boolean => {
	try {
		// Extract domain from email and check if it's thmanyah.com
		const domain = email.split("@")[1]
		if (!domain) {
			console.error("Invalid email format: Missing domain.")
			return false
		}

		// Only allow thmanyah.com domain
		return domain === "thmanyah.com"
	} catch (error) {
		console.error("Error checking email domain:", error)
		return false
	}
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<{
	user: User | null
	error: string | null
}> => {
	try {
		const provider = new GoogleAuthProvider()
		const userCredential = await signInWithPopup(auth, provider)

		// Check if email is from thmanyah.com domain
		const email = userCredential.user.email
		if (!email) {
			await signOut(auth)
			return { user: null, error: "No email associated with this Google account." }
		}

		const isAllowed = isCompanyEmail(email)
		if (!isAllowed) {
			await signOut(auth)
			return {
				user: null,
				error: "You are not authorized to access this application.",
			}
		}

		return { user: userCredential.user, error: null }
	} catch (error: unknown) {
		const authError = error as AuthError
		return { user: null, error: authError.message }
	}
}

// Sign out
export const signOutUser = async (): Promise<{
	success: boolean
	error: string | null
}> => {
	try {
		await signOut(auth)
		return { success: true, error: null }
	} catch (error: unknown) {
		const authError = error as AuthError
		return { success: false, error: authError.message }
	}
}

// Listen to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
	return onAuthStateChanged(auth, callback)
}
