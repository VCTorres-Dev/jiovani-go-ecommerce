const Order = require('../models/Order');
const Product = require('../models/Product');
const EmailService = require('../services/emailService');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, totalAmount } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No se han proporcionado artículos para la orden' });
  }

  try {
    // Mapeamos los items del carrito a la estructura de la orden
    const products = orderItems.map(item => ({
      product: item._id,
      quantity: item.quantity,
      price: item.price, // El precio ya viene calculado desde el frontend
      name: item.name, // Incluir el nombre del producto
      imageURL: item.imageURL, // Incluir la URL de la imagen
    }));

    // 2. Verificar stock y actualizar inventario
    for (const item of orderItems) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }
    }

    // Si hay stock suficiente, descontarlo
    for (const item of orderItems) {
      await Product.updateOne({ _id: item._id }, { $inc: { stock: -item.quantity } });
    }

    const order = new Order({
      user: req.user._id, // El ID del usuario viene del middleware de autenticación
      products,
      totalAmount,
      status: 'completed', // Marcamos la orden como completada inmediatamente
    });

    const createdOrder = await order.save();

    // Obtener información del usuario para el email
    const user = await User.findById(req.user._id);
    
    // Enviar email de confirmación
    try {
      const emailData = {
        customerName: user.name,
        orderNumber: createdOrder.buyOrder,
        orderDate: new Date(createdOrder.createdAt).toLocaleDateString('es-CL'),
        paymentStatus: 'Aprobado',
        transactionId: createdOrder.buyOrder,
        products: orderItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price.toLocaleString('es-CL'),
          subtotal: (item.price * item.quantity).toLocaleString('es-CL')
        })),
        total: totalAmount.toLocaleString('es-CL'),
        shippingInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone || 'No proporcionado',
          address: user.address || 'Por definir',
          city: user.city || 'Por definir',
          region: user.region || 'Por definir'
        }
      };

      await EmailService.sendOrderConfirmation(user.email, emailData);
      console.log(`✅ Email de confirmación enviado a: ${user.email}`);
    } catch (emailError) {
      console.error('⚠️ Error enviando email de confirmación:', emailError.message);
      // No detenemos el proceso si falla el email
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Error del servidor al crear la orden' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  const { status, trackingCode, carrier, estimatedDelivery } = req.body;
  
  try {
    const order = await Order.findById(req.params.id).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    // Actualizar el estado de la orden
    order.status = status;
    if (trackingCode) order.trackingCode = trackingCode;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    
    // Agregar fecha según el estado
    const currentDate = new Date();
    switch (status) {
      case 'preparing':
        order.preparingDate = currentDate;
        break;
      case 'shipped':
        order.shippedDate = currentDate;
        break;
      case 'delivered':
        order.deliveredDate = currentDate;
        break;
    }
    
    await order.save();
    
    // Enviar email de actualización
    try {
      const statusOrder = {
        'pending': 1,
        'preparing': 2,
        'shipped': 3,
        'delivered': 4,
        'cancelled': 0
      };
      
      const emailData = {
        customerName: order.user.name,
        orderNumber: order.buyOrder,
        orderDate: new Date(order.createdAt).toLocaleDateString('es-CL'),
        total: order.totalAmount.toLocaleString('es-CL'),
        status: status,
        statusOrder: statusOrder[status],
        preparingDate: order.preparingDate ? new Date(order.preparingDate).toLocaleDateString('es-CL') : null,
        shippedDate: order.shippedDate ? new Date(order.shippedDate).toLocaleDateString('es-CL') : null,
        deliveredDate: order.deliveredDate ? new Date(order.deliveredDate).toLocaleDateString('es-CL') : null,
        trackingCode: trackingCode,
        carrier: carrier || 'Correos de Chile',
        trackingUrl: trackingCode ? `https://www.correos.cl/seguimiento?codigo=${trackingCode}` : null,
        estimatedDelivery: estimatedDelivery
      };
      
      await EmailService.sendOrderStatusUpdate(order.user.email, emailData);
      console.log(`✅ Email de actualización enviado a: ${order.user.email}`);
    } catch (emailError) {
      console.error('⚠️ Error enviando email de actualización:', emailError.message);
    }
    
    res.json({
      success: true,
      message: 'Estado de orden actualizado correctamente',
      order
    });
    
  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo mis órdenes:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { 
  addOrderItems, 
  updateOrderStatus, 
  getAllOrders, 
  getMyOrders 
};
