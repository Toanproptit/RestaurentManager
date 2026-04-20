import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../../service/user";
import "../../styles/StaffDetail.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faUserTie, faEnvelope, faIdBadge } from '@fortawesome/free-solid-svg-icons';

export default function StaffDetail() {
  const { staffId } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getUserById(staffId);
        if (res?.status === 200) {
          setStaff(res.data.result);
        }
      } catch (error) {
        console.error("Failed to load staff details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [staffId]);

  if (loading) {
    return (
      <div className="staff-detail-container">
        <div className="staff-detail-loading">
          <div className="spinner"></div>
          <p>Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="staff-detail-container">
        <div className="staff-detail-not-found">
          <h2>Staff not found</h2>
          <button onClick={() => navigate("/admin/staffs")} className="btn-back">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Staffs
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
    if (!confirmDelete) return;

    try {
      await deleteUser(staffId);
      alert("Staff deleted successfully");
      navigate("/admin/staffs");
    } catch (error) {
      console.error("Failed to delete staff", error);
      alert("Failed to delete staff");
    }
  };

  return (
    <div className="staff-detail-container">
      <div className="staff-detail-header">
        <button className="btn-back" onClick={() => navigate("/admin/staffs")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h2>Staff Details</h2>
      </div>

      <div className="staff-detail-card">
        <div className="staff-detail-avatar">
            {/* Generate avatar using ui-avatars */}
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name || 'User')}&background=22c55e&color=fff&size=128&rounded=true`} 
              alt="Avatar" 
            />
        </div>
        
        <div className="staff-detail-info">
          <h3 className="staff-name">{staff.name}</h3>
          <span className={`staff-role badge-${staff.role?.toLowerCase() || 'staff'}`}>
            {staff.role || 'STAFF'}
          </span>
          
          <div className="staff-info-items">
            <div className="info-item">
              <div className="info-icon"><FontAwesomeIcon icon={faEnvelope} /></div>
              <div className="info-content">
                <label>Email Address</label>
                <p>{staff.email}</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon"><FontAwesomeIcon icon={faIdBadge} /></div>
              <div className="info-content">
                <label>Staff ID</label>
                <p>{staff.id}</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon"><FontAwesomeIcon icon={faUserTie} /></div>
              <div className="info-content">
                <label>Position</label>
                <p>{staff.role === 'ADMIN' ? 'Administrator' : 'Standard Staff'}</p>
              </div>
            </div>
          </div>
          
          <div className="staff-detail-actions">
            <button className="btn-delete" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}