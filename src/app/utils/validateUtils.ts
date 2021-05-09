import { JwtPayload } from "../../core/jwt/jwt.payload"
import { AuthFailureError, BadRequestError } from "../../core/responses/response.Error"
import UserDTO from "../../interfaces/interface.DTO.user"

export const validationErrorMessage = (error: Error) => {

}

export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError('AccessToken needed')
    if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Access Token')
    return authorization.split(' ')[1]
}

export const getRefreshToken = (refreshToken?: string) => {
    if (!refreshToken) throw new AuthFailureError('RefreshToken needed')
    return refreshToken
}

export const validateTokenData = (payload?: JwtPayload) => {
    if (
        !payload ||
        !payload.phone ||
        !payload.accountId ||
        !payload.exp ||
        !payload.iat ||
        !payload.iss ||
        payload.iss !== 'pandaSaza'
    ) throw new AuthFailureError('Invalid Access Token')
    return true
}

export const validateUserDTO = (userDTO?: UserDTO) => {
    if (
        !userDTO ||
        !userDTO.phone ||
        !userDTO.profileName ||
        !userDTO.profileImg ||
        !userDTO.nationality ||
        !userDTO.school 
        // User DTO validations for each data
        ) throw new BadRequestError('Invalid Register Info')
    return true
}