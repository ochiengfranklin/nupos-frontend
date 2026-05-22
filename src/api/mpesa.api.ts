import api from './axios'

export const mpesaApi = {
    initiateStkPush: (data: {
        phone:       string
        amount:      number
        reference:   string
        description: string
    }) => api.post('/mpesa/stk-push', data),

    getStatus: (checkoutRequestId: string) =>
        api.get(`/mpesa/status/${checkoutRequestId}`),
}