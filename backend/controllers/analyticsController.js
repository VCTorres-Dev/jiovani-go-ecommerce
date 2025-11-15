const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getAnalyticsSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const matchFilter = { status: 'completed', ...dateFilter };

    const totalRevenue = await Order.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalSales = await Order.countDocuments(matchFilter);
    const totalUsers = await User.countDocuments(); // Total users is not date-filtered
    const totalProducts = await Product.countDocuments(); // Total products is not date-filtered

    res.json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalSales,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ message: 'Error del servidor al obtener el resumen de analíticas' });
  }
};

// @desc    Get sales over time for charts
// @route   GET /api/analytics/sales-over-time
// @access  Private/Admin
const getSalesOverTime = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const matchFilter = { status: 'completed', ...dateFilter };

    const salesData = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesData.map(d => ({ date: d._id, totalSales: d.totalSales, orders: d.orderCount })));
  } catch (error) {
    console.error('Error fetching sales over time:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los datos de ventas' });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const matchFilter = { status: 'completed', ...dateFilter };

    const topProducts = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantitySold: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$productDetails.name',
          totalQuantitySold: '$totalQuantitySold',
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los productos más vendidos' });
  }
};

module.exports = { getAnalyticsSummary, getSalesOverTime, getTopProducts };
