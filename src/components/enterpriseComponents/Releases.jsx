import React, { useEffect, useState, useMemo } from "react";
import { getReleases } from "../../services/releases";
import DataTable from "../DataTable";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

const getApiBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (base && String(base).trim() !== "") return String(base).trim();
  return "https://spacestation.tunewave.in";
};

const PLACEHOLDER_IMAGE = "/src/assets/samplIcon.png";

const STATUS_BADGE_CLASS = {
  Draft: "status-gray",
  Pending: "status-yellow",
  Live: "status-green",
  TakenDown: "status-red",
  Rejected: "status-red",
};

function formatDate(value) {
  if (value === null || value === undefined) return "N/A";
  if (typeof value !== "string") return String(value);
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

function Releases({ searchItem, showMode, setTable, onSelectionChange, selectedFilter }) {
  const [releasesData, setReleasesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // Fetch releases once on mount
  useEffect(() => {
    if (fetchedOnce) return;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getReleases()
      .then((raw) => {
        if (cancelled) return;
        const list = Array.isArray(raw) ? raw : [];
        setReleasesData(list);
        setFetchedOnce(true);
      })
      .catch(() => {
        if (!cancelled) setReleasesData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchedOnce]);

  // Map API rows to table shape and filter by selectedFilter (client-side only)
  const filteredData = useMemo(() => {
    const list = releasesData.map((r) => ({
      id: r.releaseId ?? r.id,
      releaseId: r.releaseId ?? r.id,
      title: r.title ?? "",
      primaryGenre: r.primaryGenre ?? "",
      digitalReleaseDate: r.digitalReleaseDate ?? "",
      status: r.status ?? "",
      createdAt: r.createdAt ?? "",
      coverArtUrl: r.coverArtUrl ?? r.coverArt ?? r.artworkUrl ?? null,
    }));

    const filter = (selectedFilter || "").toLowerCase();
    if (!filter || filter === "all-releases") return list;

    if (filter === "drafts") return list.filter((row) => row.status === "Draft");
    if (filter === "pending") return list.filter((row) => row.status === "Pending");
    if (filter === "live") return list.filter((row) => row.status === "Live");
    if (filter === "taken-down") return list.filter((row) => row.status === "TakenDown");
    if (filter === "rejected") return list.filter((row) => row.status === "Rejected");

    return list;
  }, [releasesData, selectedFilter]);

  // Optional search filter by title/genre
  const tableData = useMemo(() => {
    if (!searchItem?.trim()) return filteredData;
    const q = searchItem.trim().toLowerCase();
    return filteredData.filter(
      (row) =>
        (row.title && row.title.toLowerCase().includes(q)) ||
        (row.primaryGenre && row.primaryGenre.toLowerCase().includes(q))
    );
  }, [filteredData, searchItem]);

  useEffect(() => {
    if (setTable) setTable(tableData);
  }, [tableData, setTable]);

  const columns = [
    {
      key: "coverArt",
      label: "Cover Art",
      render: (item) => {
        const coverArtUrl = item.coverArtUrl;
        const src =
          coverArtUrl && String(coverArtUrl).trim() !== ""
            ? `${getApiBaseUrl()}${coverArtUrl}`
            : PLACEHOLDER_IMAGE;
        return (
          <div className="title-cell">
            <img
              src={src}
              alt={item.title || "Release"}
              className="release-cover-thumb"
              loading="lazy"
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
            <span>{item.title || "—"}</span>
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Release Title",
      render: (item) => <span>{item.title || "—"}</span>,
    },
    { key: "primaryGenre", label: "Primary Genre", render: (item) => <span>{item.primaryGenre || "—"}</span> },
    {
      key: "digitalReleaseDate",
      label: "Digital Release Date",
      render: (item) => <span>{formatDate(item.digitalReleaseDate)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const status = item.status || "";
        const badgeClass = STATUS_BADGE_CLASS[status] || "status-gray";
        return (
          <span className={`status-pill ${badgeClass}`}>{status || "—"}</span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (item) => <span>{formatDate(item.createdAt)}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-container">Loading releases...</div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {tableData.length === 0 ? (
        <div className="empty-state">No releases found.</div>
      ) : (
        <DataTable
          data={tableData}
          columns={columns}
          onSelectionChange={onSelectionChange}
        />
      )}
    </div>
  );
}

export default Releases;
