export interface ThermalReceiptData {
    receiptNumber:  string
    shopName:       string
    shopPhone?:     string
    shopAddress?:   string
    receiptFooter?: string
    items: {
        name:      string
        quantity:  number
        unitPrice: string | number
        subtotal:  string | number
    }[]
    subtotal:       number | string
    discountAmount: number | string
    totalAmount:    number | string
    paymentMethod:  string
    cashierName?:   string
    customerName?:  string
    createdAt:      string
    notes?:         string
    loyaltyPoints?: number
}

export const generateReceiptHTML = (data: ThermalReceiptData, paperWidth: '58mm' | '80mm' = '80mm'): string => {
    const pageWidth = paperWidth === '58mm' ? '58mm' : '80mm'

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

    const subtotal = parseFloat(String(data.subtotal))
    const discount = parseFloat(String(data.discountAmount || 0))
    const total    = parseFloat(String(data.totalAmount))

    const formatMoney = (n: number) =>
        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n)

    const itemsHTML = data.items.map(item => {
        const unitPrice = parseFloat(String(item.unitPrice))
        const itemTotal = parseFloat(String(item.subtotal))
        return `
      <div class="item-row">
        <span class="item-name bold">${item.name}</span>
      </div>
      <div class="item-row">
        <span class="item-name">&nbsp;&nbsp;${item.quantity} x ${formatMoney(unitPrice)}</span>
        <span class="item-price">${formatMoney(itemTotal)}</span>
      </div>
    `
    }).join('')

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Receipt ${data.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      width: ${pageWidth};
      max-width: ${pageWidth};
      padding: 4mm 2mm;
      background: #fff;
      color: #000;
      line-height: 1.4;
    }

    .center  { text-align: center; }
    .right   { text-align: right; }
    .bold    { font-weight: bold; }
    .large   { font-size: 16px; }

    .divider {
      border: none;
      border-top: 1px dashed #000;
      margin: 4px 0;
    }
    .solid-divider {
      border: none;
      border-top: 1px solid #000;
      margin: 4px 0;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .item-name {
      flex: 1;
      word-break: break-word;
      padding-right: 8px;
    }
    .item-price {
      white-space: nowrap;
      text-align: right;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
    }
    .grand-total {
      font-size: 16px;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      margin-top: 8px;
      font-size: 11px;
    }

    @media print {
      body {
        width: ${pageWidth};
        max-width: ${pageWidth};
      }
      @page {
        size: ${pageWidth};
        margin: 0;
      }
    }
  </style>
</head>
<body>

  <div class="center">
    <p class="bold large">${data.shopName.toUpperCase()}</p>
    ${data.shopAddress ? `<p>${data.shopAddress}</p>` : ''}
    ${data.shopPhone   ? `<p>Tel: ${data.shopPhone}</p>` : ''}
  </div>

  <hr class="solid-divider" />

  <div class="center">
    <p class="bold">RECEIPT</p>
    <p>${data.receiptNumber}</p>
    <p>${date}</p>
    ${data.cashierName  ? `<p>Cashier: ${data.cashierName}</p>`  : ''}
    ${data.customerName ? `<p>Customer: ${data.customerName}</p>` : ''}
  </div>

  <hr class="divider" />

  <div>${itemsHTML}</div>

  <hr class="divider" />

  <div>
    <div class="total-row">
      <span>Subtotal</span>
      <span>${formatMoney(subtotal)}</span>
    </div>
    ${discount > 0 ? `
    <div class="total-row">
      <span>Discount</span>
      <span>-${formatMoney(discount)}</span>
    </div>` : ''}
  </div>

  <hr class="solid-divider" />

  <div class="total-row">
    <span class="grand-total">TOTAL</span>
    <span class="grand-total">${formatMoney(total)}</span>
  </div>

  <hr class="divider" />

  <div class="total-row">
    <span>Payment</span>
    <span class="bold">${paymentLabels[data.paymentMethod] || data.paymentMethod}</span>
  </div>

  ${data.loyaltyPoints ? `
  <hr class="divider" />
  <div class="center">
    <p>Points earned: <strong>${data.loyaltyPoints}</strong></p>
  </div>` : ''}

  ${data.notes ? `
  <hr class="divider" />
  <p>Note: ${data.notes}</p>` : ''}

  ${data.receiptFooter ? `
  <hr class="divider" />
  <div class="center">
    <p>${data.receiptFooter}</p>
  </div>` : ''}

  <hr class="solid-divider" />

  <div class="footer">
    <p>Thank you for shopping with us!</p>
    <p>Please come again</p>
    <br/>
    <p style="font-size:10px">Powered by NuPOS</p>
  </div>

  <script>
    window.onload = function() {
      window.print()
      window.onfocus = function() {
        setTimeout(function() { window.close() }, 500)
      }
    }
  </script>

</body>
</html>`
}

export const printReceipt = (data: ThermalReceiptData, paperWidth: '58mm' | '80mm' = '80mm') => {
    const html = generateReceiptHTML(data, paperWidth)
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (!printWindow) {
        alert('Please allow popups to print receipts')
        return
    }
    printWindow.document.write(html)
    printWindow.document.close()
}