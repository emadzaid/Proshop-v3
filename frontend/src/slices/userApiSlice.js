import { apiSlice } from "./apiSlice"
import { USERS_URL } from "../constants"

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url:`${USERS_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            })
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            })
        }),

        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}`,
                method: 'GET',
            }), providesTags: ['User']
        }) ,  

        getUserbyID: builder.query({
            query: (userID) => ({
                url: `${USERS_URL}/${userID}`,
                method: 'GET',
            })
        }),

        editUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userID}`,
                method: 'PUT',
                body: data,
            }), invalidatesTags: ['User'],
        }),

        deleteUser: builder.mutation({
            query: (userID) => ({
                url: `${USERS_URL}/${userID}`,
                method: 'DELETE',
            })
        })

    })
});

export const {useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation, useGetAllUsersQuery, useGetUserbyIDQuery, useEditUserMutation, useDeleteUserMutation} = userApiSlice;