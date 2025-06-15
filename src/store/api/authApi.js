import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getUserProfile: builder.query({
      query: (userId) => ({
        url: '/users',
        method: 'GET',
        headers: {
          'user-id': userId,
        },
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useSignupMutation, 
  useLogoutMutation,
  useGetUserProfileQuery
} = authApi;