import React, { useState } from "react";
import { VND, StatusBadge } from "../../utils/helpers";

export default function OrganizerDashboard({ stats, profile }) {
  if (!stats) return <div className="text-center py-5">Đang tải dữ liệu...</div>;

  return (
    <div className="animate__animated animate__fadeIn">
      <h4 className="fw-bold mb-4">xin chào, {profile?.fullName}!</h4>
      
      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-primary text-white" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <small className="fw-bold text-uppercase opacity-75">Tổng doanh thu</small>
                <span className="fs-3">💵</span>
            </div>
            <h2 className="fw-bold mt-2">{VND(stats.totalRevenue)}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-success text-white" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <small className="fw-bold text-uppercase opacity-75">Vé đã bán</small>
                <span className="fs-3">🎫</span>
            </div>
            <h2 className="fw-bold mt-2">{stats.totalTicketsSold} <small className="fs-6 opacity-75">vé</small></h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-dark text-white" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <small className="fw-bold text-uppercase opacity-75">Sự kiện đã tạo</small>
                <span className="fs-3">📅</span>
            </div>
            <h2 className="fw-bold mt-2">{stats.totalEvents}</h2>
          </div>
        </div>
      </div>

      {/* Event Performance Table */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Tổng quan các sự kiện</h5>
        {/* fake content */}
        <span className="badge bg-light text-dark border p-2 px-3 fw-normal"></span>
      </div>
      
      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle text-nowrap">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0">Tên sự kiện</th>
                <th className="py-3 border-0">Trạng thái</th>
                <th className="py-3 border-0">Vé đã bán / Tổng</th>
                <th className="py-3 border-0">Tỉ lệ vé bán</th>
                <th className="py-3 text-end px-4 border-0">Doanh thu dự kiến</th>
              </tr>
            </thead>
            <tbody>
              {stats.eventStats.map(ev => (
                <tr key={ev.eventId}>
                  <td className="px-4 py-3 fw-bold">{ev.eventName}</td>
                  <td className="py-3">
                    <StatusBadge status={ev.status} />
                  </td>
                  <td className="py-3 text-muted">{ev.ticketsSold} / {ev.totalTickets}</td>
                  <td className="py-3" style={{ minWidth: "150px" }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: 10, borderRadius: 5 }}>
                            <div 
                                className={`progress-bar ${ev.sellThroughRate > 80 ? 'bg-danger' : ev.sellThroughRate > 50 ? 'bg-warning' : 'bg-info'}`} 
                                style={{ width: `${ev.sellThroughRate}%` }}
                            ></div>
                        </div>
                        <small className="text-secondary fw-bold">{ev.sellThroughRate.toFixed(1)}%</small>
                    </div>
                  </td>
                  <td className="py-3 text-end px-4 fw-bold text-primary">{VND(ev.revenue)}</td>
                </tr>
              ))}
              {stats.eventStats.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">Chưa có dữ liệu thống kê nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
