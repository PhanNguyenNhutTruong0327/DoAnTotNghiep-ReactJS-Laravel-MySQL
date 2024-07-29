import React from 'react';
import jsPDF from 'jspdf';

const ExportPDF = ({ items, total }) => {
    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        let y = 15;

        doc.setFontSize(20);
        doc.text("Hóa đơn mua hàng", 105, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Ngày: ${new Date().toLocaleDateString()}`, 15, y);
        y += 10;
        doc.text(`Tổng cộng: ${formatPrice(total)}`, 15, y);
        y += 10;

        items.forEach((item, index) => {
            // Xuất thông tin sản phẩm
            const itemText = `${index + 1}. ${item.product_name} - ${item.quantity} cái - ${formatPrice(item.price * item.quantity)}`;
            const textLines = doc.splitTextToSize(itemText, 180);
            doc.text(textLines, 15, y);

            // Điều chỉnh vị trí xuất để nằm ở góc phải dưới cùng
            const offsetY = (textLines.length + 1) * 10;
            const offsetYFooter = 15; // Điều chỉnh khoảng cách giữa các mục

            const xFooter = 190;
            const yFooter = doc.internal.pageSize.height - offsetYFooter;

            y += offsetY;
            if (y > yFooter) {
                doc.addPage();
                y = 15;
            }
        });

        doc.save("hoa-don.pdf");
    };

    return (
        <button className="btn btn-primary btn-sm" onClick={exportToPDF}>
            Xuất hóa đơn
        </button>
    );
};

export default ExportPDF;
