import { User, UserDto } from '../../model'

export const mapUser = (rawUser: UserDto): User => {
  return {
    id: rawUser.id,
    companyId: rawUser.companyId,
    email: rawUser.email,
    userName: rawUser.userName,
    roles: rawUser.roles,
  }
}

