import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL, UPLOADS_URL } from "../constants";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({pageNumber, keyword}) => ({
                url: PRODUCTS_URL,
                params: {
                    pageNumber,
                    keyword
                }
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),

        getProductDetails: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`
            }),
            keepUnusedDataFor: 5,
        }),

        createProduct: builder.mutation({
            query: () => ({
                url: `${PRODUCTS_URL}`,
                method: 'POST',
            }), invalidatesTags: ['Product'] 
        }),

        editProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productID}`,
                method: 'PUT',
                body: data
            }), invalidatesTags: ['Products']
        }),
        uploadFile: builder.mutation({
            query: (data) => ({
                url: `${UPLOADS_URL}`,
                method: 'POST',
                body: data,
            })
        }),

        deleteProduct: builder.mutation({
            query: (productID) => ({
                url: `${PRODUCTS_URL}/${productID}`,
                method: 'DELETE',
            })
        }), 

        createProductReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}/review`,
                method: 'POST',
                body: data,
            })
        }),

        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
                method: 'GET',
            }), keepUnusedDataFor: 5,
        })
    })
})

export const {useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useEditProductMutation, useUploadFileMutation, useDeleteProductMutation, useCreateProductReviewMutation, useGetTopProductsQuery} = productsApiSlice;