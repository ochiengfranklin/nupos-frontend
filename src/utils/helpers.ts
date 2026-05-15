// Format number as KES currency
export const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return 'KES 0.00'
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

// Time greeting
export const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}


// WhatsApp Receipt Formatters


interface ReceiptItem {
    product?: { name: string };
    name?: string;
    quantity: number;
    subtotal: number | string;
}

interface WhatsAppReceiptData {
    shopName: string;
    receiptNumber: string;
    items: ReceiptItem[];
    subtotal: number | string;
    discountAmount?: number | string;
    totalAmount: number | string;
    paymentMethod: string;
    createdAt: string;
}

// Formats the raw data into a clean WhatsApp text message
export const formatWhatsAppReceipt = (data: WhatsAppReceiptData): string => {
    let message = `*${data.shopName}*\n`;
    message += `Receipt: ${data.receiptNumber}\n`;

    // Format date nicely
    const date = new Date(data.createdAt);
    message += `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}\n\n`;

    message += `*Items:*\n`;
    data.items.forEach(item => {
        const name = item.product?.name || item.name || 'Item';
        const price = parseFloat(String(item.subtotal)).toFixed(2);
        message += `${item.quantity}x ${name} - KES ${price}\n`;
    });

    message += `\nSubtotal: KES ${parseFloat(String(data.subtotal)).toFixed(2)}\n`;

    if (parseFloat(String(data.discountAmount || '0')) > 0) {
        message += `Discount: -KES ${parseFloat(String(data.discountAmount)).toFixed(2)}\n`;
    }

    message += `*Total: KES ${parseFloat(String(data.totalAmount)).toFixed(2)}*\n`;
    message += `Paid via: ${data.paymentMethod}\n\n`;
    message += `Thank you for shopping with us!`;

    return message;
};

// Cleans the phone number and opens the WhatsApp window
export const openWhatsAppReceipt = (phone: string, message: string): void => {
    // Clean phone number: remove spaces, dashes, etc.
    let cleanPhone = phone.replace(/[\s-]/g, '');

    // Handle Kenyan phone numbers (convert 07... or 01... to 254...)
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '254' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.slice(1);
    }

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(url, '_blank');
};