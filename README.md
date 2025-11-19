# Next.js Firebase Authentication with Domain Restriction

This project implements a Next.js authentication system using Firebase that allows only users with **@thmanyah.com** email addresses to log in. The authentication system supports:

- **Google OAuth login** with Firebase Authentication
- **Domain restriction** to thmanyah.com emails

## Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication and select Google as the sign-in method
3. Create a web app in your Firebase project to get your configuration

### 2. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_PASS_LOGIN=false
```

Set `NEXT_PUBLIC_PASS_LOGIN=true` to bypass authentication (for development purposes only).

### 3. Install Dependencies

```bash
npm install firebase
# or
yarn add firebase
```

## Authentication Flow

1. User attempts to access any page
2. If not authenticated, they are redirected to the login page
3. User signs in with Google
4. System checks if the user's email ends with @thmanyah.com
5. If it's a thmanyah.com email, user is granted access; if not, they are shown an error and logged out

## Components

- `AuthProvider`: Context provider for authentication state
- `Login`: Login component with Google Sign-In
- `ProtectedComponent`: Example component that displays user information
- `DefaultLayout`: Layout component that handles authentication checks

## Security Notes

- Domain restriction happens on the client side, so it should be complemented with Firebase Security Rules
- Set up proper Firebase Authentication rules to restrict access to your application

Example Firebase Authentication rules:

```javascript
// In your Firebase console, you can set up additional security with custom claims
// This would require server-side implementation, but provides stronger security
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
