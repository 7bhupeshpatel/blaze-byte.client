import React, { useEffect, useRef } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from '../../styles/pages/workspace/AdminAnalytics.module.css';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  FileSpreadsheet,
  FileText,
  Download
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminAnalytics = () => {
  const { adminData, fetchAdminAnalytics } = useAnalytics();
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdminAnalytics();
    const interval = setInterval(() => fetchAdminAnalytics(), 30000);
    return () => clearInterval(interval);
  }, [fetchAdminAnalytics]);

  if (!adminData) return <div className={styles.loading}>Loading Analytics Engine...</div>;

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(adminData.staffRanking);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Performance");
    XLSX.writeFile(wb, "Business_Report.xlsx");
  };

  const exportPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2, backgroundColor: '#0f172a' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save("Executive_Summary.pdf");
  };

  return (
    <div className={styles.container} ref={pdfRef}>
      <header className={styles.header}>
        <div>
          <h1>Enterprise Analytics</h1>
          <p>Real-time business performance tracking</p>
        </div>
        <div className={styles.actions}>
          <button onClick={exportExcel} className={styles.excelBtn}>
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button onClick={exportPDF} className={styles.pdfBtn}>
            <FileText size={18} /> PDF Report
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.blue}`}><DollarSign /></div>
          <div>
            <label>Monthly Revenue</label>
            <h3>${adminData.monthly.toLocaleString()}</h3>
            <span className={styles.discountText}>Discounts: -${adminData.totalDiscountMonth}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.green}`}><TrendingUp /></div>
          <div>
            <label>Monthly Growth</label>
            <h3>{adminData.monthlyGrowthPercent.toFixed(1)}%</h3>
            <span className={styles.trendUp}>↑ vs last month</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.orange}`}><CreditCard /></div>
          <div>
            <label>Daily Cash Flow</label>
            <h3>${(adminData.dailyCash + adminData.dailyOnline).toLocaleString()}</h3>
            <div className={styles.subSplit}>
              <span>Cash: ${adminData.dailyCash}</span>
              <span>Online: ${adminData.dailyOnline}</span>
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.iconBox} ${styles.purple}`}><Users /></div>
          <div>
            <label>Orders (MTD)</label>
            <h3>{adminData.totalOrdersMonth}</h3>
            <span>Total transactions</span>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        {/* Revenue Velocity */}
        <div className={styles.chartCard}>
          <h3>7-Day Revenue Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={adminData.last7Days}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className={styles.chartCard}>
          <h3>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={adminData.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
              <Bar dataKey="quantity" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Ranking Table */}
      <div className={styles.tableCard}>
        <h3>Top Performing Staff</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Status</th>
              <th className={styles.textRight}>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {adminData.staffRanking.map((staff, index) => (
              <tr key={index}>
                <td className={styles.staffName}>{staff.name}</td>
                <td><span className={styles.activeBadge}>Active</span></td>
                <td className={`${styles.textRight} ${styles.revenueVal}`}>
                  ${staff.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnalytics;