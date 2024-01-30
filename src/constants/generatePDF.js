const generatePDF = ({ data }) => {
    console.log(data.BatchNumber)
    const doc = new jsPDF();

    const logoWidth = 50;
    const centerX = (doc.internal.pageSize.width - logoWidth) / 2;

    const backgroundHeight = 20;
    doc.setFillColor(0, 0, 0);
    doc.rect(centerX, 10, logoWidth, backgroundHeight, 'F');


    const logoImage = Logo;
    doc.addImage(logoImage, 'PNG', centerX, 10, logoWidth, 20);


    doc.setFontSize(18);
    doc.text('Invoice Details', 80, 40);


    doc.setFontSize(12);
    doc.text(`Invoice Date: ${data.InvoiceDate}`, 20, 70);
    doc.text(`Invoice Number: ${data.InvoiceNumber}`, 20, 80);


    doc.text('Student Details', 20, 100);
    doc.text('-----------------------', 20, 110);
    doc.text(`Name: ${data.InvoiceName}`, 20, 120);
    doc.text(`Batch Code: ${data.BatchNumber.toString()}`, 20, 130);


    doc.text('Invoice Amount', 20, 150);
    doc.text('-----------------------', 20, 160);
    doc.text(`Amount: ${data.InvoiceAmount}`, 20, 170);


    const paidMarkX = 100;
    const paidMarkY = 170;
    doc.text('Paid', paidMarkX, paidMarkY);


    const balanceX = 20;
    const balanceY = 190;
    doc.text('Balance Remaining', balanceX, balanceY);
    doc.text('-----------------------', balanceX, balanceY + 10);
    doc.text(`Amount: ${data.InvoiceBalanceAmount}`, balanceX, balanceY + 20);
    doc.setDrawColor(255, 0, 0);
    doc.rect(balanceX, balanceY + 20, 40, 10, 'S');

    doc.save('myPDF.pdf');
};

export default generatePDF;