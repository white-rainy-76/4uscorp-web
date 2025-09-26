'use client'

import { useSignInMutation } from '@/features/session/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { useDictionary } from '@/shared/lib/hooks'

export default function SignInScreen() {
  const { dictionary } = useDictionary()

  const signInSchema = z.object({
    userName: z.string().min(1, dictionary.home.auth.username_required),
    password: z.string(),
  })

  type SignInFormData = z.infer<typeof signInSchema>

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
          {dictionary.home.auth.sign_in}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Username */}
          <div>
            <label className="text-sm font-bold text-[#A8A8A8] font-nunito">
              {dictionary.home.auth.login}
            </label>
            <Controller
              control={control}
              name="userName"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder={dictionary.home.auth.login_placeholder}
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
              {dictionary.home.auth.password}
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  placeholder={dictionary.home.auth.password_placeholder}
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
            {dictionary.home.auth.info_text}
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signInMutation.isPending}
            className="w-full h-11 bg-[#4964D8] text-[#ffffff] font-nunito font-medium rounded-full hover:opacity-90 transition">
            {dictionary.home.auth.continue}
          </button>
        </form>
      </div>
    </div>
  )
}
