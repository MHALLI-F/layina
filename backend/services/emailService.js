const nodemailer = require('nodemailer');

// Configuration du transporteur email (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'mhalli.it@gmail.com',
    pass: process.env.EMAIL_PASSWORD // Mot de passe d'application Gmail
  }
});

// Template pour la confirmation de commande client
const createOrderConfirmationEmail = (order, user) => {
  const itemsList = order.items.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price}€</td>
    </tr>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de commande - Boutique Voilée</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
        .table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
        .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Boutique Voilée</h1>
          <p>Confirmation de votre commande</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${user.firstName} ${user.lastName},</h2>
          
          <p>Nous vous remercions pour votre commande ! Votre commande a été confirmée et sera traitée dans les plus brefs délais.</p>
          
          <div class="order-details">
            <h3>Détails de la commande</h3>
            <p><strong>Numéro de commande:</strong> #${order.orderNumber}</p>
            <p><strong>Date de commande:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Statut:</strong> <span style="color: #28a745; font-weight: bold;">${order.status}</span></p>
            
            <table class="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total">
              <p>Sous-total: ${order.subtotal}€</p>
              <p>Frais de livraison: ${order.shippingCost}€</p>
              <p>Réduction: -${order.discount}€</p>
              <p style="font-size: 20px; color: #667eea;">Total: ${order.total}€</p>
            </div>
          </div>
          
          <div style="margin: 30px 0;">
            <h3>Adresse de livraison</h3>
            <p>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <p>Nous vous tiendrons informés de l'avancement de votre commande par email.</p>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:contact@boutique-voilee.com">contact@boutique-voilee.com</a></p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/profile" class="btn">Voir mes commandes</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Boutique Voilée - Mode modeste et élégante</p>
          <p>© 2024 Boutique Voilée. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template pour la notification de nouvelle commande (admin)
const createNewOrderNotificationEmail = (order, user) => {
  const itemsList = order.items.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price}€</td>
    </tr>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle commande - Boutique Voilée</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
        .table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
        .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Nouvelle Commande</h1>
          <p>Boutique Voilée - Administration</p>
        </div>
        
        <div class="content">
          <h2>Une nouvelle commande a été passée !</h2>
          
          <div class="order-details">
            <h3>Détails de la commande</h3>
            <p><strong>Numéro de commande:</strong> #${order.orderNumber}</p>
            <p><strong>Date de commande:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Montant total:</strong> <span style="color: #dc3545; font-weight: bold; font-size: 18px;">${order.total}€</span></p>
            
            <h4>Informations client</h4>
            <p><strong>Nom:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Téléphone:</strong> ${user.phone || 'Non renseigné'}</p>
            
            <h4>Articles commandés</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total">
              <p>Sous-total: ${order.subtotal}€</p>
              <p>Frais de livraison: ${order.shippingCost}€</p>
              <p>Réduction: -${order.discount}€</p>
              <p style="font-size: 20px; color: #dc3545;">Total: ${order.total}€</p>
            </div>
            
            <h4>Adresse de livraison</h4>
            <p>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
            
            <h4>Méthode de paiement</h4>
            <p>${order.paymentMethod}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/admin" class="btn">Gérer la commande</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Cette notification a été envoyée automatiquement. 
            Veuillez traiter cette commande dans les plus brefs délais.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Fonction pour envoyer la confirmation de commande au client
const sendOrderConfirmation = async (order, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mhalli.it@gmail.com',
      to: user.email,
      subject: `Confirmation de commande #${order.orderNumber} - Boutique Voilée`,
      html: createOrderConfirmationEmail(order, user)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation envoyé au client:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', error);
    throw error;
  }
};

// Fonction pour envoyer la notification de nouvelle commande à l'admin
const sendNewOrderNotification = async (order, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mhalli.it@gmail.com',
      to: 'mhalli.it@gmail.com', // Votre email
      subject: `🚨 Nouvelle commande #${order.orderNumber} - ${order.total}€`,
      html: createNewOrderNotificationEmail(order, user)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Notification de nouvelle commande envoyée à l\'admin:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification admin:', error);
    throw error;
  }
};

// Fonction pour envoyer les deux emails lors d'une nouvelle commande
const sendOrderEmails = async (order, user) => {
  try {
    await Promise.all([
      sendOrderConfirmation(order, user),
      sendNewOrderNotification(order, user)
    ]);
    console.log('✅ Tous les emails de commande ont été envoyés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails de commande:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendNewOrderNotification,
  sendOrderEmails
}; 