import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { subDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { getSummary, getSalesOverTime, getTopProducts } from '../../services/analyticsService';
import { FaDollarSign, FaShoppingCart, FaUsers, FaBoxOpen, FaCalendarAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        const [summaryRes, salesRes, topProductsRes] = await Promise.all([
          getSummary(params),
          getSalesOverTime(params),
          getTopProducts(params),
        ]);

        setSummary(summaryRes);
        setSalesData(salesRes);
        setTopProducts(topProductsRes);

      } catch (err) {
        setError('No se pudieron cargar los datos de analíticas para el período seleccionado.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchAllAnalytics();
    }
  }, [startDate, endDate]);

  const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onClick} ref={ref}>
      <FaCalendarAlt className="text-gray-500" />
      {value}
    </button>
  ));

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Analíticas</h1>
        <div className="flex items-center gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            customInput={<CustomDatePickerInput />}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            customInput={<CustomDatePickerInput />}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando analíticas...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<FaDollarSign />} title="Ingresos Totales" value={new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(summary?.totalRevenue || 0)} color="border-green-500" />
            <StatCard icon={<FaShoppingCart />} title="Ventas Totales" value={summary?.totalSales || 0} color="border-blue-500" />
            <StatCard icon={<FaUsers />} title="Clientes Totales" value={summary?.totalUsers || 0} color="border-purple-500" />
            <StatCard icon={<FaBoxOpen />} title="Productos Totales" value={summary?.totalProducts || 0} color="border-yellow-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rendimiento de Ventas</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => name === 'Ingresos' ? `$${value.toFixed(2)}` : value} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="totalSales" stroke="#8884d8" name="Ingresos" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="orderCount" stroke="#82ca9d" name="Pedidos" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 Productos Más Vendidos</h2>
              <ul className="space-y-4">
                {topProducts.length > 0 ? topProducts.map((product, index) => (
                  <li key={product.productId} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{index + 1}. {product.name}</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{product.totalQuantitySold}</span>
                  </li>
                )) : <p className="text-gray-500">No hay datos de ventas para este período.</p>}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
