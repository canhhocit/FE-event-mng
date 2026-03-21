import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import OrganizerSidebar from "../components/organizer/OrganizerSidebar";
import OrganizerDashboard from "../components/organizer/OrganizerDashboard";
import MyEventsList from "../components/organizer/MyEventsList";
import CreateEventForm from "../components/organizer/CreateEventForm";
import TicketManager from "../components/organizer/TicketManager";
import OrganizerProfile from "../components/organizer/OrganizerProfile";

export default function OrganizerPage() {
  const api = useApi();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTicketTypes, setEventTicketTypes] = useState([]);

  const [eventFormData, setEventFormData] = useState({
    name: "", categoryId: "", location: "", startTime: "", endTime: "",
    saleStartDate: "", saleEndDate: "", description: "", files: null
  });

  const [ticketFormData, setTicketFormData] = useState({
    name: "", price: "", totalQuantity: "", description: ""
  });

  useEffect(() => {
    fetchDashData();
    api.get("/categories").then(res => setCategories(res.result || []));
    api.get("/users/my-info").then(res => setProfile(res.result));
  }, []);

  const fetchDashData = async () => {
    try {
      const statsRes = await api.get("/events/organizer/stats");
      setStats(statsRes.result);
      const eventsRes = await api.get("/events/organizer/my-events");
      setMyEvents(eventsRes.result?.content || []);
    } catch (err) {}
  };

  const handleEventChange = (e) => {
    const { name, value, files } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: files ? files : value }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(eventFormData).forEach(key => {
        if (key === 'files' && eventFormData.files) {
          for (let i = 0; i < eventFormData.files.length; i++) data.append("files", eventFormData.files[i]);
        } else if (eventFormData[key]) {
          data.append(key, eventFormData[key]);
        }
      });
      await api.post("/events", data);
      alert("Đăng ký sự kiện thành công! Đang chờ Admin duyệt.");
      setEventFormData({
        name: "", categoryId: "", location: "", startTime: "", endTime: "",
        saleStartDate: "", saleEndDate: "", description: "", files: null
      });
      setActiveTab("events");
      fetchDashData();
    } catch (err) { 
      const msg = err.response?.data?.message || "Lỗi khi tạo sự kiện. Vui lòng kiểm tra lại dữ liệu.";
      alert(msg); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { username, ...updateData } = profile;
      await api.put(`/users/${username}`, updateData);
      alert("Cập nhật thành công!");
    } catch (err) { alert("Lỗi khi cập nhật hồ sơ."); }
  };

  const openTicketManager = async (event) => {
    setSelectedEvent(event);
    const res = await api.get(`/ticket-types/event/${event.id}`);
    setEventTicketTypes(res.result || []);
    setActiveTab("tickets");
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      await api.post("/ticket-types", { ...ticketFormData, eventId: selectedEvent.id });
      alert("Đã thêm hạng vé thành công!");
      setTicketFormData({ name: "", price: "", totalQuantity: "", description: "" });
      openTicketManager(selectedEvent);
    } catch (err) { alert("Thiết lập vé thất bại."); }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sidebar Navigation */}
      <OrganizerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel */}
      <div className="flex-grow-1 overflow-auto" style={{ height: "100vh" }}>
        <div className="p-3 p-md-5 mx-auto" style={{ maxWidth: "1200px" }}>
          
          {activeTab === "dashboard" && (
            <OrganizerDashboard stats={stats} profile={profile} />
          )}

          {activeTab === "events" && (
            <MyEventsList myEvents={myEvents} openTicketManager={openTicketManager} />
          )}

          {activeTab === "create" && (
            <CreateEventForm 
              formData={eventFormData} 
              handleChange={handleEventChange} 
              handleSubmit={handleEventSubmit} 
              categories={categories} 
              loading={loading} 
            />
          )}

          {activeTab === "tickets" && (
            <TicketManager 
              event={selectedEvent}
              ticketFormData={ticketFormData}
              setTicketFormData={setTicketFormData}
              handleAddTicket={handleAddTicket}
              eventTicketTypes={eventTicketTypes}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <OrganizerProfile 
              profile={profile} 
              setProfile={setProfile} 
              handleProfileUpdate={handleProfileUpdate} 
            />
          )}

        </div>
      </div>
    </div>
  );
}
