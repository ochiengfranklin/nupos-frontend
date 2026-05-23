import api from './axios'

export const subscriptionApi = {
    get: () => api.get('/subscription'),
    checkout: (plan: 'STARTER' | 'BUSINESS') => api.post('/subscription/checkout', { plan }),
}