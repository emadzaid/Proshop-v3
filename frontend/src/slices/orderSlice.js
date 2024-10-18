import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addOrderItem: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: {...order},
            })
        })
    })
});

export const {useAddOrderItemMutation} = orderSlice;
