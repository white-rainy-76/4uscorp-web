import { privateConfig } from '@/shared/config/private'
import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import axios from 'axios'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: privateConfig.GOOGLE_CLIENT_ID,
      clientSecret: privateConfig.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      authorize: async (credentials) => {
        const email = credentials.email as string | undefined
        const password = credentials.password as string | undefined

        if (!email || !password) {
          throw new CredentialsSignin('Please provide both email & password')
        }
        console.log(email, password)
        return {
          email,
          password,
        }
        // try {
        //   const response = await axios.post(
        //     'https://localhost:5001/api/Authentication/Login',
        //     {
        //       email,
        //       password,
        //     },
        //   )

        //   if (response.status === 200) {
        //     return response.data
        //   } else {
        //     throw new Error('Неверные учетные данные')
        //   }
        // } catch (error) {
        //   console.error('Login error:', error.message)
        //   throw new Error(
        //     error.response?.data?.message || 'Неверные учетные данные',
        //   )
        // }
      },
    }),
  ],

  // pages: {
  //   signIn: '/login',
  // },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === 'google') {
        try {
          const { email, name, image, id } = user
          const response = await axios.post(
            'https://localhost:5001/api/Authentication/Google',
            {
              id,
              name,
              email,
              image,
            },
          )
          if (response.status === 200) {
            return true
          } else {
            throw new Error('Ошибка авторизации через Google')
          }
        } catch (error) {
          throw new Error('Error while creating user')
        }
      }

      if (account?.provider === 'credentials') {
        return true
      } else {
        return false
      }
    },
  },
})
