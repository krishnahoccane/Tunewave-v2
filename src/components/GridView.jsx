

import React, { useState, useMemo, useRef, useEffect } from "react";
import "../styles/GridView.css";

function renderItemDetails(item, type) {
  switch (type) {
    case "releases":
      return (
        <>
          <h3 className="item-title">{item.title}</h3>
          <p className="item-artist">{item.name}</p>
          <div className="item-details">
            {item.created && <span className="created-date">{item.created}</span>}
          </div>
        </>
      );

    case "tracks":
      return (
        <>
          <h3 className="item-title">{item.title}</h3>
          <div className="item-details">
            {item.duration && <span className="duration">{item.duration}</span>}
          </div>
        </>
      );

    case "artists":
      return (
        <>
          <h3 className="item-title">{item.name}</h3>
          {item.releases && (
            <div className="item-details">
              <span className="release-count">{item.releases} releases</span>
            </div>
          )}
        </>
      );

    case "performers":
    case "producers":
    case "writers":
    case "publishers":
    case "labels":
      return (
        <>
          <h3 className="item-title">{item.name}</h3>
          {item.country && (
            <div className="item-details">
              <span className="country">{item.country}</span>
            </div>
          )}
        </>
      );

    default:
      return (
        <>
          <h3 className="item-title">{item.title || item.name}</h3>
        </>
      );
  }
}

function GridView({
  data,
  type = "releases",
  itemsPerPage = 12,
  showPagination = true,
  showCheckboxes = true,
}) {
  const topCheckboxRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState(new Set());

  const gridData = data || [];

  // 🔹 Sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return gridData;
    return [...gridData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [gridData, sortColumn, sortDirection]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = showPagination
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData;

  // 🔹 Selection
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedItems.has(item.id));

  useEffect(() => {
    if (topCheckboxRef.current) {
      topCheckboxRef.current.indeterminate =
        selectedItems.size > 0 && !isAllSelected;
    }
  }, [selectedItems, isAllSelected]);

  const handleSelectToggle = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedData.map((item) => item.id)));
    }
  };

  const handleItemSelect = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const renderPaginationButtons = () => {
    if (!showPagination || totalPages <= 1) return null;
    const buttons = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn pagination-arrow"
        >
          ‹
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-btn ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn pagination-arrow"
        >
          ›
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="grid-view-container">
      {/* Header with controls */}
      <div className="grid-header">
        <div className="grid-controls">
          {showCheckboxes && (
            <div className="select-all-control">
              <input
                type="checkbox"
                ref={topCheckboxRef}
                checked={isAllSelected}
                onChange={handleSelectToggle}
                className="select-all-checkbox"
              />
              <span className="select-all-label">Select All</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid Items */}
      <div className="grid-wrapper">
        <div className="grid-container">
          {paginatedData.map((item) => (
            <div
              key={item.id}
              className={`grid-item ${selectedItems.has(item.id) ? "selected" : ""}`}
            >
              {showCheckboxes && (
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                  className="grid-item-checkbox"
                />
              )}

              <div className="grid-item-image">
                <img src={item.image} alt={item.title || item.name} />
              </div>

              <div className="grid-item-content">
                {renderItemDetails(item, type)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length} items
            {selectedItems.size > 0 && (
              <span className="selected-count-footer">
                • {selectedItems.size} selected
              </span>
            )}
          </div>
          <div className="pagination-buttons">{renderPaginationButtons()}</div>
        </div>
      )}
    </div>
  );
}

export default GridView;
