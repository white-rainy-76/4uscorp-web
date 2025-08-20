'use client'

import { useSignInMutation } from '@/features/session/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'

const signInSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  password: z.string(),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  })

  const signInMutation = useSignInMutation({
    onError: async (error) => {
      // console.error('Sign-in error:', error.response.data[0].message)
    },
  })

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-[#343434] font-nunito">
          Sign in
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Username */}
          <div>
            <label className="text-sm font-bold text-[#A8A8A8] font-nunito">
              Login
            </label>
            <Controller
              control={control}
              name="userName"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter login"
                  className="mt-2 w-full h-11 px-4 rounded-full bg-[#F2F2F2] text-black font-nunito text-base"
                />
              )}
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-bold text-[#A8A8A8] font-nunito">
              Password
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  placeholder="Enter password"
                  className="mt-2 w-full h-11 px-4 rounded-full bg-[#F2F2F2] text-black font-nunito text-base"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Info Text */}
          <p className="text-sm text-[#343434] font-nunito">
            Enter the data sent to you by your manager
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signInMutation.isPending}
            className="w-full h-11 bg-[#4964D8] text-[#A8A8A8] font-nunito font-medium rounded-full hover:opacity-90 transition">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
