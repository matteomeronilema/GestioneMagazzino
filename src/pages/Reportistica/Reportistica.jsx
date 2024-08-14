import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Reportistica.css';

function Reportistica() {
  const { state } = useAppContext();
  const { products, reservations, recuperatedProducts, redazionaliProducts, soldProducts } = state;

  const contoVisioneCount = reservations.reduce((total, reservation) => total + reservation.reservedQuantity, 0);
  const recuperatiCount = recuperatedProducts.reduce((total, product) => total + product.reservedQuantity, 0);
  const vendutiCount = soldProducts.reduce((total, product) => total + product.reservedQuantity, 0);
  const valoreTotaleVenduti = soldProducts.reduce((total, product) => total + (product.salePrice * product.reservedQuantity), 0);

  const categorySales = getCategorySales(soldProducts);
  const productDistribution = getProductDistribution(products, recuperatedProducts, redazionaliProducts, soldProducts);

  return (
    <div className="reportistica-page">
      <h2>Dashboard di Business Intelligence</h2>
      
      <div className="kpi-container">
        <KPICard title="Prodotti in Conto Visione" value={contoVisioneCount} />
        <KPICard title="Prodotti Recuperati" value={recuperatiCount} />
        <KPICard title="Prodotti Venduti" value={vendutiCount} />
        <KPICard title="Valore Totale Prodotti Venduti" value={`€${valoreTotaleVenduti.toFixed(2)}`} />
      </div>

      <div className="chart-container">
        <h3>Valore dei Prodotti Venduti per Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categorySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Distribuzione dei Prodotti</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {productDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPICard({ title, value }) {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}

function getCategorySales(soldProducts) {
  const categorySales = {};
  soldProducts.forEach(product => {
    const category = product.category || 'Uncategorized';
    const saleValue = product.salePrice * product.reservedQuantity;
    categorySales[category] = (categorySales[category] || 0) + saleValue;
  });
  return Object.entries(categorySales).map(([name, value]) => ({ name, value }));
}

function getProductDistribution(products, recuperatedProducts, redazionaliProducts, soldProducts) {
  return [
    { name: 'Inventario', value: products.reduce((sum, p) => sum + p.quantity, 0) },
    { name: 'Recuperati', value: recuperatedProducts.reduce((sum, p) => sum + p.reservedQuantity, 0) },
    { name: 'Redazionali', value: redazionaliProducts.reduce((sum, p) => sum + p.reservedQuantity, 0) },
    { name: 'Venduti', value: soldProducts.reduce((sum, p) => sum + p.reservedQuantity, 0) }
  ];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default Reportistica;