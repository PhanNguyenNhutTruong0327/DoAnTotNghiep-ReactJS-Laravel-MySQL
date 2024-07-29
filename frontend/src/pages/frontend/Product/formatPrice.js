// Trong một file utils.js hoặc helpers.js
export const formatPrice = (price) => {
    const roundedPrice = Math.round(price);
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
    return formattedPrice.replace(/,/g, '.') + '.000';
  };
  