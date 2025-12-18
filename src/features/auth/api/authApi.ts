import { baseApi } from "@/app/api/baseApi"
import type { LoginArgs, LoginResponse, MeResponse } from "./authApi.types"
import { AUTH_KEYS } from "@/common/constants"

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      providesTags: ["Auth"],
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: payload => ({
        method: "post",
        url: "auth/login",
        body: { ...payload, accessToken: "3m" },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        debugger
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
        // инвалидация после КАЖДОГО сохранения токенов
        dispatch(authApi.util.invalidateTags(["Auth"]))
      },
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return {
          method: "post",
          url: "auth/logout",
          body: { refreshToken },
        }
      },
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        // инвалидация после КАЖДОГО удаления токенов
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi
