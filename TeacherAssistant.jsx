/* ============================================
   SIDEBAR STYLES (Shared Component)
   ============================================ */

.sidebar {
  width: 260px;
  background: rgba(15, 15, 35, 0.95);
  border-right: 1px solid rgba(99, 102, 241, 0.1);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 24px;
}

.sidebar-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(212, 175, 55, 0.4);
}

.sidebar-brand h3 {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.sidebar-brand span {
  font-size: 12px;
  color: #64748b;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
}

.nav-item.selected {
  background: rgba(99, 102, 241, 0.12);
  color: #818cf8;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  margin-bottom: 12px;
}

.admin-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.admin-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-role {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
}

.admin-email {
  font-size: 11px;
  color: #64748b;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 10px;
  color: #f87171;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Responsive */
@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
}
