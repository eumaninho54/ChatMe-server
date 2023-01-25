export type JwtVerify = {
  id: string
  iat: number
}

export type VerifyTokenDTO = {
  accessToken: string
  refreshToken: string
}
