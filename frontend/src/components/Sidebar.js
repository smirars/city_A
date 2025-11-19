import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebar = () => setIsOpen(false);

  const navItem = (page, icon, label) => (
    <button
      className={
        "sidebar__item" + (currentPage === page ? " sidebar__item--active" : "")
      }
      onClick={() => {
        setCurrentPage(page);
        closeSidebar();
      }}
    >
      <img className="sidebar__icon" src={icon} alt="icon"/>
      {isOpen && <span className="sidebar__label">{label}</span>}
    </button>
  );

  return (
    <>
      {isOpen && isMobile && (
        <div className="sidebar__overlay" onClick={closeSidebar}></div>
      )}

      {isMobile && !isOpen && (
        <button className="sidebar__burger" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div
        className={
          "sidebar" +
          (isOpen ? " sidebar--open" : "") +
          (isMobile ? " sidebar--mobile" : "")
        }
      >
        {isMobile && (
          <button className="sidebar__close" onClick={closeSidebar}>
            ✖
          </button>
        )}

        <nav className="sidebar__nav">
          {navItem("home", "/icons/home.svg", "Главная")}
          {navItem("stats", "/icons/stats.svg", "Статистика")}
          {navItem("create", "/icons/create.svg", "Создать жителя")}
          {navItem("feedback", "/icons/feedback.svg", "Обратная связь")}
        </nav>

        {!isMobile && (
          <button className="sidebar__item sidebar__collapse" onClick={toggleSidebar}>
            <span className="sidebar__icon sidebar__icon--open">{isOpen ? "«" : "»"}</span>
            {isOpen && <span className="sidebar__label">Свернуть</span>}
          </button>
        )}
      </div>
    </>
  );
}
