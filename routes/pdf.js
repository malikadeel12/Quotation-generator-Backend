import express from 'express';
import PDFDocument from 'pdfkit';
import Quotation from '../models/Quotation.js';

const router = express.Router();

// Generate PDF (Public access - quotation ID is unique, but optional auth for access control)
router.get('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('items.service')
      .populate('items.addons')
      .populate('bundles')
      .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`);
    
    doc.pipe(res);

    // Header with gradient effect (simulated)
    doc.fillColor('#6B46C1')
      .fontSize(24)
      .text('NexLead', 50, 50)
      .fillColor('#000000')
      .fontSize(12)
      .text('Quotation', 50, 80);

    // Quotation details
    doc.fontSize(16)
      .text(`Quotation #${quotation.quotationNumber}`, 50, 120)
      .fontSize(12)
      .text(`Date: ${quotation.createdAt.toLocaleDateString()}`, 50, 150)
      .text(`Valid Until: ${quotation.validUntil.toLocaleDateString()}`, 50, 170);

    // Client info
    doc.fontSize(14)
      .text('Client Information', 50, 210)
      .fontSize(12)
      .text(`Name: ${quotation.clientName}`, 50, 235);
    
    if (quotation.clientEmail) {
      doc.text(`Email: ${quotation.clientEmail}`, 50, 255);
    }
    if (quotation.clientPhone) {
      doc.text(`Phone: ${quotation.clientPhone}`, 50, 275);
    }

    // Items
    let yPos = 320;
    doc.fontSize(14)
      .text('Services & Add-ons', 50, yPos);
    
    yPos += 30;
    quotation.items.forEach((item, index) => {
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
      }
      
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${item.service.name}`, 50, yPos)
        .font('Helvetica')
        .text(`   Price: $${item.service.basePrice.toFixed(2)}`, 70, yPos + 20);
      
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach((addon, idx) => {
          doc.text(`   + ${addon.name}: $${addon.price.toFixed(2)}`, 70, yPos + 40 + (idx * 20));
        });
        yPos += 40 + (item.addons.length * 20);
      } else {
        yPos += 40;
      }
    });

    // Totals
    yPos += 20;
    if (yPos > 700) {
      doc.addPage();
      yPos = 50;
    }
    
    doc.fontSize(12)
      .text(`Subtotal: $${quotation.subtotal.toFixed(2)}`, 400, yPos)
      .text(`Discount: -$${quotation.discount.toFixed(2)}`, 400, yPos + 20)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`Total: $${quotation.total.toFixed(2)}`, 400, yPos + 50);

    // Notes
    if (quotation.notes) {
      yPos += 100;
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
      }
      doc.fontSize(12)
        .font('Helvetica')
        .text('Notes:', 50, yPos)
        .text(quotation.notes, 50, yPos + 20);
    }

    // Footer
    doc.fontSize(10)
      .text('Thank you for considering NexLead services.', 50, doc.page.height - 50, {
        align: 'center'
      });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

