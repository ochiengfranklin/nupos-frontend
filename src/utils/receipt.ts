interface ReceiptData {
    receiptNumber:  string
    shopName:       string
    items:          any[] // Updated to accept both item structures
    subtotal:       number | string
    discountAmount: number | string
    totalAmount:    number | string
    paymentMethod:  string
    createdAt:      string
}

export const formatWhatsAppReceipt = (data: ReceiptData): string => {
    const line  = '─────────────────────'

    // Updated formatter to handle both flat name and nested product.name
    const items = data.items.map((item: any) =>
        `${item.name || item.product?.name || 'Product'}\n  ${item.quantity} × KES ${parseFloat(item.unitPrice).toFixed(2)} = KES ${parseFloat(item.subtotal).toFixed(2)}`
    ).join('\n')

    const discount = parseFloat(String(data.discountAmount))
    const total    = parseFloat(String(data.totalAmount))
    const subtotal = parseFloat(String(data.subtotal))

    const paymentLabels: Record<string, string> = {
        CASH:          'Cash',
        MPESA:         'M-Pesa',
        CARD:          'Card',
        BANK_TRANSFER: 'Bank Transfer',
    }

    const date = new Date(data.createdAt).toLocaleString('en-KE', {
        year:   'numeric',
        month:  'short',
        day:    'numeric',
        hour:   '2-digit',
        minute: '2-digit',
    })

    return [
        `🧾 *RECEIPT*`,
        `*${data.shopName}*`,
        line,
        `📋 *${data.receiptNumber}*`,
        `📅 ${date}`,
        line,
        `*ITEMS*`,
        items,
        line,
        `Subtotal:  KES ${subtotal.toFixed(2)}`,
        discount > 0 ? `Discount:  -KES ${discount.toFixed(2)}` : null,
        `*TOTAL:    KES ${total.toFixed(2)}*`,
        line,
        `💳 Payment: ${paymentLabels[data.paymentMethod] || data.paymentMethod}`,
        line,
        `Thank you for shopping with us! 🙏`,
        `_Powered by NuPOS_`,
    ].filter(Boolean).join('\n')
}

export const openWhatsAppReceipt = (phone: string, receipt: string) => {
    // Clean phone number — remove spaces, dashes, leading 0
    let cleaned = phone.replace(/[\s\-\(\)]/g, '')

    // Convert Kenyan 07XX to 2547XX
    if (cleaned.startsWith('0')) {
        cleaned = '254' + cleaned.slice(1)
    }

    // Add 254 if no country code
    if (!cleaned.startsWith('254') && !cleaned.startsWith('+')) {
        cleaned = '254' + cleaned
    }

    // Remove + if present
    cleaned = cleaned.replace('+', '')

    const encoded = encodeURIComponent(receipt)
    window.open(`https://wa.me/${cleaned}?text=${encoded}`, '_blank')
}