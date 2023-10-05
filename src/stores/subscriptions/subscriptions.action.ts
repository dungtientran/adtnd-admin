import { Dispatch } from "@reduxjs/toolkit"
import { setSubscriptions } from "../subscriptions.store"
import { axiosInstance } from "@/api/request"

export const getSubscriptions = () => {
    return async (dispatch: Dispatch) => {
        try {
            const data = await axiosInstance.get('/subscription/admin/subscription_product')
            console.log('subscriptions', data)
            dispatch(setSubscriptions({
                subscriptions: data.data
            }))
        } catch (error) {
            dispatch(setSubscriptions({
                subscriptions: []
            }))
        }
    }
}