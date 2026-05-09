// Format number as KES currency
export const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-KE', {
        style:    'currency',
        currency: 'KES',
    }).format(num)
}

// Format date to readable string
export const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-KE', {
        year:   'numeric',
        month:  'short',
        day:    'numeric',
        hour:   '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

// Format date to short string
export const formatDateShort = (date: string): string => {
    return new Intl.DateTimeFormat('en-KE', {
        year:  'numeric',
        month: 'short',
        day:   'numeric',
    }).format(new Date(date))
}

// Get error message from API response
export const getErrorMessage = (error: any): string => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong'
    )
}