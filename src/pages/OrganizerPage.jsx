import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function OrganizerPage() {
  const api = useApi();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    location: "",
    startTime: "",
    endTime: "",
    saleStartDate: "",
    saleEndDate: "",
    description: "",
    files: null
  });

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.result || []));
  }, [api]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'files' && formData.files) {
          for (let i = 0; i < formData.files.length; i++) {
            data.append("files", formData.files[i]);
          }
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await api.post("/events", data);
      alert("Đã gửi yêu cầu tạo sự kiện! Vui lòng chờ Admin duyệt.");
      setFormData({
        name: "", categoryId: "", location: "",
        startTime: "", endTime: "", saleStartDate: "", saleEndDate: "",
        description: "", files: null
      });
    } catch (err) {
      alert("Lỗi khi tạo sự kiện. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">🏗️ Tạo sự kiện mới</h3>
              <button className="btn btn-light" onClick={() => navigate("/login")}>Thoát ↩</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label fw-bold small text-muted">Tên sự kiện</label>
                  <input type="text" name="name" className="form-control form-control-lg bg-light border-0" required value={formData.name} onChange={handleChange} placeholder="Tên sự kiện nổi bật..." />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Danh mục</label>
                  <select name="categoryId" className="form-select bg-light border-0" required value={formData.categoryId} onChange={handleChange}>
                    <option value="">Chọn loại sự kiện</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Địa điểm</label>
                  <input type="text" name="location" className="form-control bg-light border-0" required value={formData.location} onChange={handleChange} placeholder="Nơi diễn ra..." />
                </div>

                <div className="col-md-6">
                  <div className="card bg-primary-subtle border-0 p-3 h-100" style={{ borderRadius: '15px' }}>
                    <label className="form-label fw-bold text-primary small">🛒 Mở bán vé từ:</label>
                    <input type="datetime-local" name="saleStartDate" className="form-control border-0 shadow-sm" required value={formData.saleStartDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card bg-danger-subtle border-0 p-3 h-100" style={{ borderRadius: '15px' }}>
                    <label className="form-label fw-bold text-danger small">🛑 Kết thúc bán vé vào:</label>
                    <input type="datetime-local" name="saleEndDate" className="form-control border-0 shadow-sm" required value={formData.saleEndDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card bg-light border-0 p-3 h-100" style={{ borderRadius: '15px' }}>
                    <label className="form-label fw-bold text-secondary small">🎉 Thời gian diễn ra:</label>
                    <input type="datetime-local" name="startTime" className="form-control border-0 shadow-sm" required value={formData.startTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card bg-light border-0 p-3 h-100" style={{ borderRadius: '15px' }}>
                    <label className="form-label fw-bold text-secondary small">🏁 Thời gian kết thúc:</label>
                    <input type="datetime-local" name="endTime" className="form-control border-0 shadow-sm" required value={formData.endTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small text-muted">Hình ảnh minh họa</label>
                  <input type="file" name="files" multiple className="form-control border-0 bg-light" onChange={handleChange} accept="image/*" />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small text-muted">Mô tả chi tiết</label>
                  <textarea name="description" className="form-control border-0 bg-light" rows="4" value={formData.description} onChange={handleChange} placeholder="Nội dung sự kiện..."></textarea>
                </div>

                <div className="col-12 pt-3">
                  <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg" disabled={loading}>
                    {loading ? "Đang gửi yêu cầu..." : "GỬI YÊU CẦU DUYỆT SỰ KIỆN 🚀"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
