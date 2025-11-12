import { z } from 'zod'
import { UserDtoSchema } from '../../api/contracts/user.dto.contract'

export type UserDto = z.infer<typeof UserDtoSchema>

