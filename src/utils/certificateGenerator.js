import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import { STORY_AENEID_CONFIG } from '../config/constants';

/**
 * Generate IP Registration Certificate
 */
export async function generateIPRegistrationCertificate(ipAsset) {
  const doc = new jsPDF();

  // Add border
  doc.setDrawColor(16, 185, 129); // Emerald-500
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // Logo/Header
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('IP REGISTRATION CERTIFICATE', 105, 40, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Story Protocol Blockchain', 105, 50, { align: 'center' });

  // Horizontal line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(30, 60, 180, 60);

  // Content
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);

  let y = 80;
  const leftMargin = 30;
  const lineHeight = 10;

  // IP Asset Details
  doc.setFont('helvetica', 'bold');
  doc.text('IP Asset Title:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(ipAsset.title || 'N/A', leftMargin + 35, y);
  y += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Asset ID:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(ipAsset.id || 'N/A', leftMargin, y + 5);
  y += lineHeight * 1.5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Creator:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(ipAsset.creator || 'N/A', leftMargin, y + 5);
  y += lineHeight * 1.5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Registration Date:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  const regDate = ipAsset.timestamp 
    ? new Date(ipAsset.timestamp).toLocaleString() 
    : new Date().toLocaleString();
  doc.text(regDate, leftMargin + 45, y);
  y += lineHeight * 1.5;

  // Blockchain Proof Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Blockchain Verification', leftMargin, y);
  y += lineHeight;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Hash:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(ipAsset.txHash || 'Pending', leftMargin, y + 5);
  y += lineHeight * 1.5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Network:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(STORY_AENEID_CONFIG.chainName, leftMargin + 25, y);
  y += lineHeight;

  if (ipAsset.ipfsHash) {
    doc.setFont('helvetica', 'bold');
    doc.text('IPFS Hash:', leftMargin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(ipAsset.ipfsHash, leftMargin, y + 5);
    y += lineHeight * 2;
  }

  // QR Code for verification
  try {
    const qrCodeUrl = `${STORY_AENEID_CONFIG.explorerUrl}/ip/${ipAsset.id}`;
    const qrCode = await QRCode.toDataURL(qrCodeUrl, { width: 120 });
    doc.addImage(qrCode, 'PNG', 140, y, 40, 40);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Scan to verify on', 145, y + 45, { align: 'left' });
    doc.text('Story Protocol', 145, y + 50, { align: 'left' });
  } catch (error) {
    console.error('QR Code generation failed:', error);
  }

  // License Terms (if any)
  if (ipAsset.licenseTerms) {
    y += lineHeight * 6;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('License Terms', leftMargin, y);
    y += lineHeight;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const terms = [
      `Commercial Use: ${ipAsset.licenseTerms.commercial ? 'Allowed' : 'Not Allowed'}`,
      `Attribution: ${ipAsset.licenseTerms.attribution ? 'Required' : 'Not Required'}`,
      `Modifications: ${ipAsset.licenseTerms.modifications ? 'Allowed' : 'Not Allowed'}`
    ];

    terms.forEach((term) => {
      doc.text(`• ${term}`, leftMargin + 5, y);
      y += lineHeight * 0.8;
    });
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This certificate is cryptographically verifiable on the Story Protocol blockchain.',
    105,
    270,
    { align: 'center' }
  );
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 275, {
    align: 'center'
  });

  return doc;
}

/**
 * Generate Project Completion Certificate
 */
export async function generateProjectCompletionCertificate(project, user) {
  const doc = new jsPDF();

  // Decorative border
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(3);
  doc.rect(15, 15, 180, 267);
  doc.setLineWidth(1);
  doc.rect(18, 18, 174, 261);

  // Title
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATE OF COMPLETION', 105, 50, { align: 'center' });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text('This is to certify that', 105, 70, { align: 'center' });

  // User Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  const userName = user.name || `${user.wallet?.slice(0, 6)}...${user.wallet?.slice(-4)}`;
  doc.text(userName, 105, 90, { align: 'center' });

  // Body text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('has successfully completed the project', 105, 110, { align: 'center' });

  // Project Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(`"${project.title}"`, 160);
  doc.text(titleLines, 105, 130, { align: 'center' });

  // Project Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  let y = 160;

  const details = [
    `Project Value: ${project.budget} ETH`,
    `Milestones Completed: ${project.milestones?.length || 0}`,
    `Completion Date: ${new Date(project.completed_at || Date.now()).toLocaleDateString()}`,
  ];

  if (project.contract_address) {
    details.push(`Contract: ${project.contract_address.slice(0, 10)}...${project.contract_address.slice(-8)}`);
  }

  details.forEach((detail) => {
    doc.text(detail, 105, y, { align: 'center' });
    y += 10;
  });

  // QR Code
  try {
    const qrCode = await QRCode.toDataURL(
      `https://ipescrow.app/projects/${project.id}`,
      { width: 100 }
    );
    doc.addImage(qrCode, 'PNG', 80, y + 10, 50, 50);
  } catch (error) {
    console.error('QR Code generation failed:', error);
  }

  // Signature line
  y += 70;
  doc.setDrawColor(100, 116, 139);
  doc.line(40, y, 90, y);
  doc.line(110, y, 160, y);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Creator Signature', 65, y + 7, { align: 'center' });
  doc.text('Platform Verification', 135, y + 7, { align: 'center' });

  return doc;
}

/**
 * Generate Revenue Report
 */
export async function generateRevenueReport(user, transactions, startDate, endDate) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('REVENUE REPORT', 105, 20, { align: 'center' });

  // Date Range
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
    105,
    30,
    { align: 'center' }
  );

  // User Info
  doc.setFontSize(11);
  doc.text(`Name: ${user.name || 'N/A'}`, 20, 45);
  doc.text(`Wallet: ${user.wallet}`, 20, 52);

  // Calculate summary
  const totalRevenue = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
  const projectEarnings = transactions
    .filter((tx) => tx.type === 'milestone_payment')
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
  const royaltyIncome = transactions
    .filter((tx) => tx.type === 'royalty')
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  // Summary Table
  const summaryData = [
    ['Total Revenue', `${totalRevenue.toFixed(4)} ETH`],
    ['Project Earnings', `${projectEarnings.toFixed(4)} ETH`],
    ['Royalty Income', `${royaltyIncome.toFixed(4)} ETH`],
    ['Transaction Count', transactions.length.toString()],
  ];

  doc.autoTable({
    startY: 65,
    head: [['Category', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 11 }
  });

  // Transactions Table
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction History', 20, finalY);

  const transactionData = transactions.slice(0, 20).map((tx) => [
    new Date(tx.date || Date.now()).toLocaleDateString(),
    tx.project || 'N/A',
    tx.type || 'N/A',
    `${parseFloat(tx.amount || 0).toFixed(4)} ETH`,
    tx.txHash ? `${tx.txHash.slice(0, 10)}...` : 'N/A'
  ]);

  doc.autoTable({
    startY: finalY + 5,
    head: [['Date', 'Project', 'Type', 'Amount', 'Tx Hash']],
    body: transactionData,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 9 }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This report is for informational purposes only. Please consult a tax professional for tax filing.',
    105,
    280,
    { align: 'center' }
  );

  return doc;
}

/**
 * Download helper functions
 */
export async function downloadIPCertificate(ipAsset) {
  const doc = await generateIPRegistrationCertificate(ipAsset);
  doc.save(`IP_Certificate_${ipAsset.id?.slice(0, 8) || Date.now()}.pdf`);
}

export async function downloadCompletionCertificate(project, user) {
  const doc = await generateProjectCompletionCertificate(project, user);
  doc.save(`Completion_Certificate_${project.id || Date.now()}.pdf`);
}

export async function downloadRevenueReport(user, transactions, startDate, endDate) {
  const doc = await generateRevenueReport(user, transactions, startDate, endDate);
  doc.save(`Revenue_Report_${Date.now()}.pdf`);
}
