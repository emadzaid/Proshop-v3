import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addOrderItem: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: {...order},
            })
        }),

        getOrderById: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
                method: "GET",
            })
        }),

        getAllOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
                method: 'GET',
            })
        }),

        payOrder: builder.mutation({
            query: ({orderID, details}) => ({
                url: `${ORDERS_URL}/${orderID}/pay`,
                method: "PUT",
                body: {...details},
            }),

        }),

        getPayPalClientID: builder.query({
            query: () => ({
                url: `${PAYPAL_URL}`,
                method: 'GET',
            }), keepUnusedDataFor: 5,
        }),

        getOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}`,
                method: 'GET'
            }), keepUnusedDataFor: 5.
        }),

        updateOrderToDeliver: builder.mutation({
            query: (orderID) => ({
                url: `${ORDERS_URL}/${orderID}/deliver`,
                method: 'PUT',

            }),
        })

    }),

});

export const {useAddOrderItemMutation, useGetOrderByIdQuery, usePayOrderMutation, useGetPayPalClientIDQuery, useGetAllOrdersQuery, useGetOrdersQuery, useUpdateOrderToDeliverMutation} = orderSlice;
