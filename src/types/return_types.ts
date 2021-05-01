
export type ApiResponse<T> = {
  isSuccess: boolean
  data?: T
  errorMessage?: {}
}

export type DbRequest<T> = {
  isSuccess: boolean
  data?: [T]
  error?: {}
}

export type SMSResult = {
  isSuccess: boolean
  validationCode?: string
  errorMessage?: {}
}