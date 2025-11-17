'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useSetUserRoleMutation } from '../api/set-user-role.mutation'
import { toast } from 'sonner'

const USER_ROLES = [
  { value: 'Driver', label: 'Driver' },
  { value: 'SuperAdmin', label: 'Super Admin' },
  { value: 'SelfDriver', label: 'Self Driver' },
] as const

type SetUserRoleButtonProps = {
  userId: string | null
}

export function SetUserRoleButton({ userId }: SetUserRoleButtonProps) {
  const { mutate: setUserRole, isPending } = useSetUserRoleMutation({
    onSuccess: () => {
      toast.success('Role updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`)
    },
  })

  const handleRoleChange = (roleName: string) => {
    if (!userId) {
      toast.error('Driver does not have a user account')
      return
    }

    setUserRole({
      userId,
      roleName,
    })
  }

  const isDisabled = !userId

  return (
    <Select onValueChange={handleRoleChange} disabled={isDisabled || isPending}>
      <SelectTrigger className="w-[200px] text-black">
        <SelectValue
          placeholder={isDisabled ? 'No user account' : 'Select role...'}
        />
      </SelectTrigger>
      <SelectContent>
        {USER_ROLES.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
