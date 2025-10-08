// // import React, { useState, useMemo, useRef, useEffect } from "react";
// // import "../styles/DataTable.css";

// // function DataTable({
// //   data,
// //   columns,
// //   itemsPerPage = 6, // default 5 items per page
// //   showPagination = true,
// //   showCheckboxes = true,
// // }) {
  
// //   const topCheckboxRef = useRef(null);

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [sortColumn, setSortColumn] = useState(null);
// //   const [sortDirection, setSortDirection] = useState("asc");
// //   const [selectedItems, setSelectedItems] = useState(new Set());
// //   const [hoveredRow, setHoveredRow] = useState(null); 

// //   const sampleData = [
// //     { id: 1, title: "Lucid Dreams", releaseId: "5055500", labelName: "India Connects Music", artist: "Krishna Das", upc: "1234567891234", created: "Sep 03, 2025", tracks: 1, duration: "05:03", image: "/api/placeholder/40/40" },
// //     { id: 2, title: "Sunset Boulevard", releaseId: "5055501", labelName: "Melody Makers", artist: "Anita Sharma", upc: "1234567891235", created: "Sep 05, 2025", tracks: 1, duration: "04:21", image: "/api/placeholder/40/40" },
// //     { id: 3, title: "Midnight Serenade", releaseId: "5055502", labelName: "Harmony Records", artist: "Raj Patel", upc: "1234567891236", created: "Sep 07, 2025", tracks: 1, duration: "03:45", image: "/api/placeholder/40/40" },
// //     { id: 4, title: "Ocean Waves", releaseId: "5055503", labelName: "Blue Note Music", artist: "Priya Singh", upc: "1234567891237", created: "Sep 10, 2025", tracks: 1, duration: "04:12", image: "/api/placeholder/40/40" },
// //     { id: 5, title: "Desert Storm", releaseId: "5055504", labelName: "India Connects Music", artist: "Vikram Kumar", upc: "1234567891238", created: "Sep 12, 2025", tracks: 1, duration: "05:30", image: "/api/placeholder/40/40" },
// //     ...Array.from({ length: 15 }, (_, i) => ({
// //       id: i + 6,
// //       title: `Track ${i + 6}`,
// //       releaseId: `505550${i + 5}`,
// //       labelName: ["India Connects Music", "Melody Makers", "Harmony Records", "Blue Note Music"][i % 4],
// //       artist: `Artist ${i + 6}`,
// //       upc: `123456789123${i + 9}`,
// //       created: "Sep 15, 2025",
// //       tracks: 1,
// //       duration: `0${Math.floor(Math.random() * 6) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
// //       image: "/api/placeholder/40/40"
// //     }))
// //   ];

// //   const tableData = data || sampleData;

// //   const defaultColumns = [
// //     { key: "title", label: "Title", sortable: true, render: (item) => (<div className="title-cell"><img src={item.image} alt={item.title} className="track-image" /><span>{item.title}</span></div>) },
// //     { key: "releaseId", label: "Release ID", sortable: true },
// //     { key: "labelName", label: "Label Name", sortable: true, render: (item) => (<span className="label-badge">{item.labelName}</span>) },
// //     { key: "artist", label: "Artist", sortable: true },
// //     { key: "upc", label: "UPC", sortable: true },
// //     { key: "created", label: "Created", sortable: true },
// //     { key: "tracks", label: "Tracks", sortable: true },
// //     { key: "duration", label: "Duration", sortable: true }
// //   ];

// //   const tableColumns = columns || defaultColumns;

// //   // Sorting
// //   const sortedData = useMemo(() => {
// //     if (!sortColumn) return tableData;
// //     return [...tableData].sort((a, b) => {
// //       const aValue = a[sortColumn];
// //       const bValue = b[sortColumn];
// //       if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
// //       if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
// //       return 0;
// //     });
// //   }, [tableData, sortColumn, sortDirection]);

// //   // Pagination
// //   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
// //   const startIndex = (currentPage - 1) * itemsPerPage;
// //   const paginatedData = showPagination ? sortedData.slice(startIndex, startIndex + itemsPerPage) : sortedData;




// //   const handleSort = (columnKey) => {
// //     if (sortColumn === columnKey) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
// //     else { setSortColumn(columnKey); setSortDirection("asc"); }
// //   };

// //   const handlePageChange = (page) => setCurrentPage(page);

// //   // Selection
// //   const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedItems.has(item.id));

// // //         for unSelecting the rows at  Top
// //    useEffect(() => {
// //   if (topCheckboxRef.current) {
// //     topCheckboxRef.current.indeterminate =
// //       selectedItems.size > 0 && !isAllSelected;
// //   }
// // }, [selectedItems, isAllSelected]); 

// //   const handleSelectToggle = () => {
// //     if (selectedItems.size === 0) {
// //       const allIds = new Set(paginatedData.map(item => item.id));
// //       setSelectedItems(allIds);
// //     } else {
// //       setSelectedItems(new Set());
// //     }
// //   };

// //   const handleItemSelect = (id) => {
// //     const newSelected = new Set(selectedItems);
// //     if (newSelected.has(id)) newSelected.delete(id);
// //     else newSelected.add(id);
// //     setSelectedItems(newSelected);
// //   };

// //   const renderPaginationButtons = () => {
// //   if (!showPagination || totalPages <= 1) return null;

// //   const buttons = [];
// //   const maxVisiblePages = 3; // only 3 numbers visible
// //   let startPage = Math.max(1, currentPage - 1);
// //   let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

// //   if (endPage - startPage + 1 < maxVisiblePages) {
// //     startPage = Math.max(1, endPage - maxVisiblePages + 1);
// //   }

// //   // Prev arrow
// //   if (currentPage > 1) {
// //     buttons.push(
// //       <button
// //         key="prev"
// //         onClick={() => handlePageChange(currentPage - 1)}
// //         className="pagination-btn pagination-arrow"
// //       >
// //         ‹
// //       </button>
// //     );
// //   }

// //   // Page numbers
// //   for (let i = startPage; i <= endPage; i++) {
// //     buttons.push(
// //       <button
// //         key={i}
// //         onClick={() => handlePageChange(i)}
// //         className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
// //       >
// //         {i}
// //       </button>
// //     );
// //   }

// //   // Next arrow
// //   if (currentPage < totalPages) {
// //     buttons.push(
// //       <button
// //         key="next"
// //         onClick={() => handlePageChange(currentPage + 1)}
// //         className="pagination-btn pagination-arrow"
// //       >
// //         ›
// //       </button>
// //     );
// //   }

// //   return buttons;
// // };


// //   return (
// //     <div className="data-table-container">
// //       <div className="table-wrapper">
// //         <table className="data-table">
// //           <thead>
// //             <tr>

// //               {showCheckboxes && (
// //                 <th className="checkbox-col">
// //                   <input type="checkbox" ref={topCheckboxRef}   checked={isAllSelected} onChange={handleSelectToggle} />
// //                 </th>
// //               )}
// //               {tableColumns.map(column => (
// //                 <th key={column.key} className={column.sortable ? "sortable" : ""} onClick={() => column.sortable && handleSort(column.key)}>
// //                   <div className="th-content">
// //                     <span>{column.label}</span>
// //                     {column.sortable && (
// //                       <div className="sort-indicators">
// //                         <span className={`sort-arrow ${sortColumn === column.key && sortDirection === "asc" ? "active" : ""}`}>▲</span>
// //                         <span className={`sort-arrow ${sortColumn === column.key && sortDirection === "desc" ? "active" : ""}`}>▼</span>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </th>
// //               ))}
// //             </tr>
// //           </thead>
// //           {/* <tbody>
// //             {paginatedData.map((item) => (
// //               <tr key={item.id} className={selectedItems.has(item.id) ? 'selected' : ''}>
// //                 {showCheckboxes && (
// //                   <td className="checkbox-col">
// //                     <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => handleItemSelect(item.id)}  />
// //                   </td>
// //                 )}
// //                 {tableColumns.map(column => (
// //                   <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
// //                 ))}
// //               </tr>
// //             ))}
// //           </tbody> */}


// // <tbody>
// //   {paginatedData.map((item) => (
// //     <tr
// //       key={item.id}
// //       className={`${selectedItems.has(item.id) ? 'selected' : ''} ${hoveredRow === item.id ? 'hovered' : ''}`}
// //       onMouseEnter={() => setHoveredRow(item.id)}
// //       onMouseLeave={() => setHoveredRow(null)}
// //       onClick={() => handleItemSelect(item.id)} // optional: toggle selection on click
// //     >
// //       {showCheckboxes && (
// //         <td className="checkbox-col">
// //           <input
// //             type="checkbox"
// //             checked={selectedItems.has(item.id)}
// //             onChange={() => handleItemSelect(item.id)}
// //           />
// //         </td>
// //       )}
// //       {tableColumns.map(column => (
// //         <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
// //       ))}
// //     </tr>
// //   ))}
// // </tbody>
// //         </table>
// //       </div>

      

// //       {showPagination && totalPages > 0 && (
// //         <div className="pagination-container">
// //           <div className="pagination-info">
// //             Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} items
// //             {selectedItems.size > 0 && <span className="selected-count-footer"> • {selectedItems.size} selected</span>}
// //           </div>
// //           <div className="pagination-buttons">{renderPaginationButtons()}</div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default DataTable;
// // src/components/DataTable.jsx
// import React, { useState, useMemo, useRef, useEffect } from "react";
// import "../styles/DataTable.css";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// function DataTable({
//   data,
//   columns,
//   itemsPerPage = 6,
//   showPagination = true,
//   showCheckboxes = true,
//   onSelectionChange,
// }) {
//   const topCheckboxRef = useRef(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [selectedItems, setSelectedItems] = useState(new Set());
//   const [hoveredRow, setHoveredRow] = useState(null);
//   const [openRow, setOpenRow] = useState(null); // which row's menu is open

//   // sampleData fallback (keeps your previous sample)
//   const sampleData = [
//     { id: 1, title: "Lucid Dreams", releaseId: "5055500", labelName: "India Connects Music", artist: "Krishna Das", upc: "1234567891234", created: "Sep 03, 2025", tracks: 1, duration: "05:03", image: "/api/placeholder/40/40" },
//     { id: 2, title: "Sunset Boulevard", releaseId: "5055501", labelName: "Melody Makers", artist: "Anita Sharma", upc: "1234567891235", created: "Sep 05, 2025", tracks: 1, duration: "04:21", image: "/api/placeholder/40/40" },
//     { id: 3, title: "Midnight Serenade", releaseId: "5055502", labelName: "Harmony Records", artist: "Raj Patel", upc: "1234567891236", created: "Sep 07, 2025", tracks: 1, duration: "03:45", image: "/api/placeholder/40/40" },
//     { id: 4, title: "Ocean Waves", releaseId: "5055503", labelName: "Blue Note Music", artist: "Priya Singh", upc: "1234567891237", created: "Sep 10, 2025", tracks: 1, duration: "04:12", image: "/api/placeholder/40/40" },
//     { id: 5, title: "Desert Storm", releaseId: "5055504", labelName: "India Connects Music", artist: "Vikram Kumar", upc: "1234567891238", created: "Sep 12, 2025", tracks: 1, duration: "05:30", image: "/api/placeholder/40/40" },
//     ...Array.from({ length: 15 }, (_, i) => ({
//       id: i + 6,
//       title: `Track ${i + 6}`,
//       releaseId: `505550${i + 5}`,
//       labelName: ["India Connects Music", "Melody Makers", "Harmony Records", "Blue Note Music"][i % 4],
//       artist: `Artist ${i + 6}`,
//       upc: `123456789123${i + 9}`,
//       created: "Sep 15, 2025",
//       tracks: 1,
//       duration: `0${Math.floor(Math.random() * 6) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
//       image: "/api/placeholder/40/40"
//     }))
//   ];

//   const tableData = data && data.length ? data : sampleData;

//   const defaultColumns = [
//     { key: "title", label: "Title", sortable: true, render: (item) => (<div className="title-cell"><img src={item.image} alt={item.title} className="track-image" /><span>{item.title}</span></div>) },
//     { key: "releaseId", label: "Release ID", sortable: true },
//     { key: "labelName", label: "Label Name", sortable: true, render: (item) => (<span className="label-badge">{item.labelName}</span>) },
//     { key: "artist", label: "Artist", sortable: true },
//     { key: "upc", label: "UPC", sortable: true },
//     { key: "created", label: "Created", sortable: true },
//     { key: "tracks", label: "Tracks", sortable: true },
//     { key: "duration", label: "Duration", sortable: true }
//   ];

//   const tableColumns = columns || defaultColumns;

//   // Sorting
//   const sortedData = useMemo(() => {
//     if (!sortColumn) return tableData;
//     return [...tableData].sort((a, b) => {
//       const aValue = a[sortColumn];
//       const bValue = b[sortColumn];
//       if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [tableData, sortColumn, sortDirection]);

//   // Pagination
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = showPagination ? sortedData.slice(startIndex, startIndex + itemsPerPage) : sortedData;

//   // Top checkbox indeterminate
//   const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedItems.has(item.id));
//   useEffect(() => {
//     if (topCheckboxRef.current) {
//       topCheckboxRef.current.indeterminate = selectedItems.size > 0 && !isAllSelected;
//     }
//   }, [selectedItems, isAllSelected]);

//   // Sorting handler
//   const handleSort = (columnKey) => {
//     if (sortColumn === columnKey) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     else { setSortColumn(columnKey); setSortDirection("asc"); }
//   };

//   const handlePageChange = (page) => setCurrentPage(page);

//   // Selection handlers
//   // const handleSelectToggle = () => {
//   //   if (selectedItems.size === 0) {
//   //     const allIds = new Set(paginatedData.map(item => item.id));
//   //     setSelectedItems(allIds);
//   //   } else {
//   //     setSelectedItems(new Set());
//   //   }
//   // };

//   // const handleItemSelect = (id) => {
//   //   const newSelected = new Set(selectedItems);
//   //   if (newSelected.has(id)) newSelected.delete(id);
//   //   else newSelected.add(id);
//   //   setSelectedItems(newSelected);
//   // };




//   const handleItemSelect = (id) => {
//   const newSelected = new Set(selectedItems);
//   if (newSelected.has(id)) newSelected.delete(id);
//   else newSelected.add(id);
//   setSelectedItems(newSelected);
//   if (onSelectionChange) {
//     const selectedRows = paginatedData.filter((row) => newSelected.has(row.id));
//     onSelectionChange(selectedRows);   // ✅ send rows to parent
//   }
// };

// const handleSelectToggle = () => {
//   let newSelected;
//   if (selectedItems.size === 0) {
//     newSelected = new Set(paginatedData.map(item => item.id));
//   } else {
//     newSelected = new Set();
//   }
//   setSelectedItems(newSelected);
//   if (onSelectionChange) {
//     const selectedRows = paginatedData.filter((row) => newSelected.has(row.id));
//     onSelectionChange(selectedRows);   // ✅ send rows to parent
//   }
// };

//   // CSV escaping utility
//   const escapeCSV = (val) => {
//     if (val === null || val === undefined) return '""';
//     const s = String(val).replace(/"/g, '""');
//     return `"${s}"`;
//   };

//   // Row download logic (single row)
//   const handleRowDownload = (row, type) => {
//     // Create a sanitized row object (remove images and render-only fields)
//     const exportRow = { ...row };
//     // remove fields we don't want in excel/csv
//     delete exportRow.image;
//     // If any functions or react nodes were present, remove them
//     Object.keys(exportRow).forEach((k) => {
//       if (typeof exportRow[k] === "function") delete exportRow[k];
//     });

//     if (type === "csv") {
//       const header = Object.keys(exportRow);
//       const headerLine = header.join(",");
//       const valueLine = header.map((h) => escapeCSV(exportRow[h])).join(",");
//       const csvContent = headerLine + "\n" + valueLine;
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       saveAs(blob, `${exportRow.title || exportRow.id || "row"}.csv`);
//     } else if (type === "xls") {
//       const ws = XLSX.utils.json_to_sheet([exportRow]);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Row");
//       const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${exportRow.title || exportRow.id || "row"}.xlsx`);
//     }
//   };

//   // Close open menu if clicking outside
//   useEffect(() => {
//     const onDocClick = () => setOpenRow(null);
//     document.addEventListener("click", onDocClick);
//     return () => document.removeEventListener("click", onDocClick);
//   }, []);

//   const renderPaginationButtons = () => {
//     if (!showPagination || totalPages <= 1) return null;
//     const buttons = [];
//     const maxVisiblePages = 3;
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }
//     if (currentPage > 1) {
//       buttons.push(
//         <button key="prev" onClick={() => handlePageChange(currentPage - 1)} className="pagination-btn pagination-arrow">‹</button>
//       );
//     }
//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <button key={i} onClick={() => handlePageChange(i)} className={`pagination-btn ${currentPage === i ? 'active' : ''}`}>{i}</button>
//       );
//     }
//     if (currentPage < totalPages) {
//       buttons.push(
//         <button key="next" onClick={() => handlePageChange(currentPage + 1)} className="pagination-btn pagination-arrow">›</button>
//       );
//     }
//     return buttons;
//   };

//   return (
//     <div className="data-table-container">
//       <div className="table-wrapper">
//         <table className="data-table">
//           <thead>
//             <tr>
//               {showCheckboxes && (
//                 <th className="checkbox-col">
//                   <input type="checkbox" ref={topCheckboxRef} checked={isAllSelected} onChange={handleSelectToggle} />
//                 </th>
//               )}
//               {tableColumns.map(column => (
//                 <th key={column.key} className={column.sortable ? "sortable" : ""} onClick={() => column.sortable && handleSort(column.key)}>
//                   <div className="th-content">
//                     <span>{column.label}</span>
//                     {column.sortable && (
//                       <div className="sort-indicators">
//                         <span className={`sort-arrow ${sortColumn === column.key && sortDirection === "asc" ? "active" : ""}`}>▲</span>
//                         <span className={`sort-arrow ${sortColumn === column.key && sortDirection === "desc" ? "active" : ""}`}>▼</span>
//                       </div>
//                     )}
//                   </div>
//                 </th>
//               ))}
//               {/* actions column (sticky right) */}
//               <th className="actions-col" />
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedData.map((item) => (
//               <tr
//                 key={item.id}
//                 className={`${selectedItems.has(item.id) ? 'selected' : ''} ${hoveredRow === item.id ? 'hovered' : ''}`}
//                 onMouseEnter={() => setHoveredRow(item.id)}
//                 onMouseLeave={() => setHoveredRow(null)}
//                 onClick={() => handleItemSelect(item.id)}
//               >
//                 {showCheckboxes && (
//                   <td className="checkbox-col">
//                     <input
//                       type="checkbox"
//                       checked={selectedItems.has(item.id)}
//                       onChange={() => handleItemSelect(item.id)}
//                     />
//                   </td>
//                 )}
//                 {tableColumns.map(column => (
//                   <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
//                 ))}

//                 {/* Row actions: 3-dots menu */}
//                 <td className="row-actions">
//                   <div className="action-menu">
//                     <button
//                       className="dots-btn"
//                       onClick={(e) => {
//                         e.stopPropagation(); // prevent row click selection toggle
//                         setOpenRow(prev => (prev === item.id ? null : item.id));
//                       }}
//                       aria-label="Open actions"
//                     >
//                       ⋮
//                     </button>

//                     {openRow === item.id && (
//                       <div className="dropdown" onClick={(e) => e.stopPropagation()}>
//                         <button onClick={(e) => { e.stopPropagation(); handleRowDownload(item, "csv"); setOpenRow(null); }}>
//                           Download CSV
//                         </button>
//                         <button onClick={(e) => { e.stopPropagation(); handleRowDownload(item, "xls"); setOpenRow(null); }}>
//                           Download XLS
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showPagination && totalPages > 0 && (
//         <div className="pagination-container">
//           <div className="pagination-info">
//             Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} items
//             {selectedItems.size > 0 && <span className="selected-count-footer"> • {selectedItems.size} selected</span>}
//           </div>
//           <div className="pagination-buttons">{renderPaginationButtons()}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataTable;
















































// import React, { useState, useMemo, useRef, useEffect } from "react";
// import "../styles/DataTable.css";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// function DataTable({
//   data,
//   columns,
//   itemsPerPage = 6,
//   showPagination = true,
//   showCheckboxes = true,
//   onSelectionChange,
// }) {
//   const topCheckboxRef = useRef(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [selectedItems, setSelectedItems] = useState(new Set());
//   const [hoveredRow, setHoveredRow] = useState(null);
//   const [openRow, setOpenRow] = useState(null); // which row's menu is open

//   // sampleData fallback
//   const sampleData = [
//     {
//       id: 1,
//       title: "Lucid Dreams",
//       releaseId: "5055500",
//       labelName: "India Connects Music",
//       artist: "Krishna Das",
//       upc: "1234567891234",
//       created: "Sep 03, 2025",
//       tracks: 1,
//       duration: "05:03",
//       image: "/api/placeholder/40/40",
//     },
//     {
//       id: 2,
//       title: "Sunset Boulevard",
//       releaseId: "5055501",
//       labelName: "Melody Makers",
//       artist: "Anita Sharma",
//       upc: "1234567891235",
//       created: "Sep 05, 2025",
//       tracks: 1,
//       duration: "04:21",
//       image: "/api/placeholder/40/40",
//     },
//   ];

//   const tableData = data && data.length ? data : sampleData;

//   const defaultColumns = [
//     {
//       key: "title",
//       label: "Title",
//       sortable: true,
//       render: (item) => (
//         <div className="title-cell">
//           <img src={item.image} alt={item.title} className="track-image" />
//           <span>{item.title}</span>
//         </div>
//       ),
//     },
//     { key: "releaseId", label: "Release ID", sortable: true },
//     {
//       key: "labelName",
//       label: "Label Name",
//       sortable: true,
//       render: (item) => <span className="label-badge">{item.labelName}</span>,
//     },
//     { key: "artist", label: "Artist", sortable: true },
//     { key: "upc", label: "UPC", sortable: true },
//     { key: "created", label: "Created", sortable: true },
//     { key: "tracks", label: "Tracks", sortable: true },
//     { key: "duration", label: "Duration", sortable: true },
//   ];

//   const tableColumns = columns || defaultColumns;

//   // Sorting
//   const sortedData = useMemo(() => {
//     if (!sortColumn) return tableData;
//     return [...tableData].sort((a, b) => {
//       const aValue = a[sortColumn];
//       const bValue = b[sortColumn];
//       if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [tableData, sortColumn, sortDirection]);

//   // Pagination
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = showPagination
//     ? sortedData.slice(startIndex, startIndex + itemsPerPage)
//     : sortedData;

//   // Top checkbox indeterminate state
//   const isAllSelected =
//     sortedData.length > 0 &&
//     sortedData.every((item) => selectedItems.has(item.id));
//   useEffect(() => {
//     if (topCheckboxRef.current) {
//       topCheckboxRef.current.indeterminate =
//         selectedItems.size > 0 && !isAllSelected;
//     }
//   }, [selectedItems, isAllSelected]);

//   // Sorting handler
//   const handleSort = (columnKey) => {
//     if (sortColumn === columnKey)
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     else {
//       setSortColumn(columnKey);
//       setSortDirection("asc");
//     }
//   };

//   const handlePageChange = (page) => setCurrentPage(page);

//   // Selection handlers
//   const handleItemSelect = (id) => {
//     const newSelected = new Set(selectedItems);
//     if (newSelected.has(id)) newSelected.delete(id);
//     else newSelected.add(id);
//     setSelectedItems(newSelected);

//     if (onSelectionChange) {
//       const selectedRows = sortedData.filter((row) =>
//         newSelected.has(row.id)
//       );
//       onSelectionChange(selectedRows);
//     }
//   };

//   const handleSelectToggle = () => {
//     let newSelected;
//     if (selectedItems.size === sortedData.length) {
//       newSelected = new Set();
//     } else {
//       newSelected = new Set(sortedData.map((item) => item.id));
//     }
//     setSelectedItems(newSelected);

//     if (onSelectionChange) {
//       const selectedRows = sortedData.filter((row) =>
//         newSelected.has(row.id)
//       );
//       onSelectionChange(selectedRows);
//     }
//   };

//   // CSV escaping utility
//   const escapeCSV = (val) => {
//     if (val === null || val === undefined) return '""';
//     const s = String(val).replace(/"/g, '""');
//     return `"${s}"`;
//   };

//   // Row download logic (single row)
//   const handleRowDownload = (row, type) => {
//     const exportRow = { ...row };
//     delete exportRow.image; // remove unwanted fields

//     Object.keys(exportRow).forEach((k) => {
//       if (typeof exportRow[k] === "function") delete exportRow[k];
//     });

//     if (type === "csv") {
//       const header = Object.keys(exportRow);
//       const headerLine = header.join(",");
//       const valueLine = header.map((h) => escapeCSV(exportRow[h])).join(",");
//       const csvContent = headerLine + "\n" + valueLine;
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       saveAs(blob, `${exportRow.title || exportRow.id || "row"}.csv`);
//     } else if (type === "xls") {
//       const ws = XLSX.utils.json_to_sheet([exportRow]);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Row");
//       const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       saveAs(
//         new Blob([wbout], { type: "application/octet-stream" }),
//         `${exportRow.title || exportRow.id || "row"}.xlsx`
//       );
//     }
//   };

//   // Close open menu if clicking outside
//   useEffect(() => {
//     const onDocClick = () => setOpenRow(null);
//     document.addEventListener("click", onDocClick);
//     return () => document.removeEventListener("click", onDocClick);
//   }, []);

//   const renderPaginationButtons = () => {
//     if (!showPagination || totalPages <= 1) return null;
//     const buttons = [];
//     const maxVisiblePages = 3;
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }
//     if (currentPage > 1) {
//       buttons.push(
//         <button
//           key="prev"
//           onClick={() => handlePageChange(currentPage - 1)}
//           className="pagination-btn pagination-arrow"
//         >
//           ‹
//         </button>
//       );
//     }
//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`pagination-btn ${currentPage === i ? "active" : ""}`}
//         >
//           {i}
//         </button>
//       );
//     }
//     if (currentPage < totalPages) {
//       buttons.push(
//         <button
//           key="next"
//           onClick={() => handlePageChange(currentPage + 1)}
//           className="pagination-btn pagination-arrow"
//         >
//           ›
//         </button>
//       );
//     }
//     return buttons;
//   };

//   return (
//     <div className="data-table-container">
//       <div className="table-wrapper">
//         <table className="data-table">
//           <thead>
//             <tr>
//               {showCheckboxes && (
//                 <th className="checkbox-col">
//                   <input
//                     type="checkbox"
//                     ref={topCheckboxRef}
//                     checked={isAllSelected}
//                     onChange={handleSelectToggle}
//                   />
//                 </th>
//               )}
//               {tableColumns.map((column) => (
//                 <th
//                   key={column.key}
//                   className={column.sortable ? "sortable" : ""}
//                   onClick={() =>
//                     column.sortable && handleSort(column.key)
//                   }
//                 >
//                   <div className="th-content">
//                     <span>{column.label}</span>
//                     {column.sortable && (
//                       <div className="sort-indicators">
//                         <span
//                           className={`sort-arrow ${
//                             sortColumn === column.key &&
//                             sortDirection === "asc"
//                               ? "active"
//                               : ""
//                           }`}
//                         >
//                           ▲
//                         </span>
//                         <span
//                           className={`sort-arrow ${
//                             sortColumn === column.key &&
//                             sortDirection === "desc"
//                               ? "active"
//                               : ""
//                           }`}
//                         >
//                           ▼
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </th>
//               ))}
//               <th className="actions-col" />
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedData.map((item) => (
//               <tr
//                 key={item.id}
//                 className={`${selectedItems.has(item.id) ? "selected" : ""} ${
//                   hoveredRow === item.id ? "hovered" : ""
//                 }`}
//                 onMouseEnter={() => setHoveredRow(item.id)}
//                 onMouseLeave={() => setHoveredRow(null)}
//               >
//                 {showCheckboxes && (
//                   <td className="checkbox-col">
//                     <input
//                       type="checkbox"
//                       checked={selectedItems.has(item.id)}
//                       onChange={() => handleItemSelect(item.id)}
//                     />
//                   </td>
//                 )}
//                 {tableColumns.map((column) => (
//                   <td key={column.key}>
//                     {column.render ? column.render(item) : item[column.key]}
//                   </td>
//                 ))}

//                 <td className="row-actions">
//                   <div className="action-menu">
//                     <button
//                       className="dots-btn"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenRow((prev) =>
//                           prev === item.id ? null : item.id
//                         );
//                       }}
//                       aria-label="Open actions"
//                     >
//                       ⋮
//                     </button>

//                     {openRow === item.id && (
//                       <div
//                         className="dropdown"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRowDownload(item, "csv");
//                             setOpenRow(null);
//                           }}
//                         >
//                           Download CSV
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRowDownload(item, "xls");
//                             setOpenRow(null);
//                           }}
//                         >
//                           Download XLS
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showPagination && totalPages > 0 && (
//         <div className="pagination-container">
//           <div className="pagination-info">
//             Showing {startIndex + 1}-
//             {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
//             {sortedData.length} items
//             {selectedItems.size > 0 && (
//               <span className="selected-count-footer">
//                 • {selectedItems.size} selected
//               </span>
//             )}
//           </div>
//           <div className="pagination-buttons">
//             {renderPaginationButtons()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DataTable;







import React, { useState, useMemo, useRef, useEffect } from "react";
import "../styles/DataTable.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function DataTable({
  data,
  columns,
  itemsPerPage = 6,
  showPagination = true,
  showCheckboxes = true,
  onSelectionChange,
}) {
  const topCheckboxRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [hoveredRow, setHoveredRow] = useState(null);
  const [openRow, setOpenRow] = useState(null);

  const sampleData = [
    {
      id: 1,
      title: "Lucid Dreams",
      releaseId: "5055500",
      labelName: "India Connects Music",
      artist: "Krishna Das",
      upc: "1234567891234",
      created: "Sep 03, 2025",
      tracks: 1,
      duration: "05:03",
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      title: "Sunset Boulevard",
      releaseId: "5055501",
      labelName: "Melody Makers",
      artist: "Anita Sharma",
      upc: "1234567891235",
      created: "Sep 05, 2025",
      tracks: 1,
      duration: "04:21",
      image: "/api/placeholder/40/40",
    },
  ];

  const tableData = data && data.length ? data : sampleData;

  const defaultColumns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (item) => (
        <div className="title-cell">
          <img src={item.image} alt={item.title} className="track-image" />
          <span>{item.title}</span>
        </div>
      ),
    },
    { key: "releaseId", label: "Release ID", sortable: true },
    {
      key: "labelName",
      label: "Label Name",
      sortable: true,
      render: (item) => <span className="label-badge">{item.labelName}</span>,
    },
    { key: "artist", label: "Artist", sortable: true },
    { key: "upc", label: "UPC", sortable: true },
    { key: "created", label: "Created", sortable: true },
    { key: "tracks", label: "Tracks", sortable: true },
    { key: "duration", label: "Duration", sortable: true },
  ];

  const tableColumns = columns || defaultColumns;

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return tableData;
    return [...tableData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [tableData, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = showPagination
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData;

  // Checkbox indeterminate
  const isAllSelected =
    sortedData.length > 0 &&
    sortedData.every((item) => selectedItems.has(item.id));
  useEffect(() => {
    if (topCheckboxRef.current) {
      topCheckboxRef.current.indeterminate =
        selectedItems.size > 0 && !isAllSelected;
    }
  }, [selectedItems, isAllSelected]);

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemSelect = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedItems(newSelected);

    if (onSelectionChange) {
      const selectedRows = sortedData.filter((row) =>
        newSelected.has(row.id)
      );
      onSelectionChange(selectedRows);
    }
  };

  const handleSelectToggle = () => {
    let newSelected;
    if (selectedItems.size === sortedData.length) {
      newSelected = new Set();
    } else {
      newSelected = new Set(sortedData.map((item) => item.id));
    }
    setSelectedItems(newSelected);
    if (onSelectionChange) {
      const selectedRows = sortedData.filter((row) =>
        newSelected.has(row.id)
      );
      onSelectionChange(selectedRows);
    }
  };

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const handleRowDownload = (row, type) => {
    const exportRow = { ...row };
    delete exportRow.image;
    Object.keys(exportRow).forEach((k) => {
      if (typeof exportRow[k] === "function") delete exportRow[k];
    });

    if (type === "csv") {
      const header = Object.keys(exportRow);
      const csvContent =
        header.join(",") +
        "\n" +
        header.map((h) => escapeCSV(exportRow[h])).join(",");
      saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), `${exportRow.title || exportRow.id}.csv`);
    } else if (type === "xls") {
      const ws = XLSX.utils.json_to_sheet([exportRow]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Row");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${exportRow.title || exportRow.id}.xlsx`);
    }
  };

  useEffect(() => {
    const onDocClick = () => setOpenRow(null);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)} className="pagination-btn pagination-arrow">
          ‹
        </button>
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`pagination-btn ${currentPage === i ? "active" : ""}`}>
          {i}
        </button>
      );
    }
    if (currentPage < totalPages) {
      buttons.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)} className="pagination-btn pagination-arrow">
          ›
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {showCheckboxes && (
                <th>
                  <input type="checkbox" ref={topCheckboxRef} checked={isAllSelected} onChange={handleSelectToggle} />
                </th>
              )}
              {tableColumns.map((column) => (
                <th key={column.key} className={column.sortable ? "sortable" : ""} onClick={() => column.sortable && handleSort(column.key)}>
                  <span>{column.label}</span>
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className={`${selectedItems.has(item.id) ? "selected" : ""} ${hoveredRow === item.id ? "hovered" : ""}`}
                onChange={() => handleItemSelect(item.id) }
              >
                {showCheckboxes && (
                  <td>
                    <input type="checkbox" checked={selectedItems.has(item.id)}  />
                  </td>
                )}
                {tableColumns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(item) : item[col.key]}</td>
                ))}
                <td className="row-actions">
                  <div className="action-menu" onMouseEnter={(e) => e.stopPropagation()}>
                    <button className="dots-btn" onClick={(e) => { e.stopPropagation(); setOpenRow(openRow === item.id ? null : item.id); }}>⋮</button>
                    {openRow === item.id && (
                      <div className="dropdown" onMouseEnter={(e) => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); handleRowDownload(item, "csv"); setOpenRow(null); }}>Download CSV</button>
                        <button onClick={(e) => { e.stopPropagation(); handleRowDownload(item, "xls"); setOpenRow(null); }}>Download XLS</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && totalPages > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} items
            {selectedItems.size > 0 && <span> • {selectedItems.size} selected</span>}
          </div>
          <div className="pagination-buttons">{renderPaginationButtons()}</div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
