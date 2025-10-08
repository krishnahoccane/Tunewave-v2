import {React, useEffect} from "react";
import DataTable from "./DataTable";
import "../styles/ReleasesTab.css";
import "../styles/TabComponents.css";
import "../styles/TableShared.css";
import GridView from "./GridView";


function ReleasesTab({ searchTerm, showMode, setTableData, onSelectionChange }) {

  // Sample data for releases
  const releasesData = [
    {
      id: 1,
      title: "Lucid Dreams",
      releaseId: "5055500",
      labelName: "India Connects Music",
      artistName: "Krishna Das",
      upc: "123456789234",
      creationDate: "Sep 03, 2025",
      tracks: 1,
      duration: "05:03",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 2,
      title: "Ocean Vibes",
      releaseId: "5055501",
      labelName: "Wave Records",
      artistName: "Aarav Mehta",
      upc: "987654321012",
      creationDate: "Aug 28, 2025",
      tracks: 8,
      duration: "32:45",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 3,
      title: "Soulful Nights",
      releaseId: "5055502",
      labelName: "Nightfall Music",
      artistName: "Priya Kapoor",
      upc: "564738291034",
      creationDate: "Jul 15, 2025",
      tracks: 10,
      duration: "42:17",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 4,
      title: "Mystic Beats",
      releaseId: "5055503",
      labelName: "Mystic Records",
      artistName: "Rohit Sharma",
      upc: "857392047382",
      creationDate: "Jun 01, 2025",
      tracks: 5,
      duration: "21:30",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 5,
      title: "Desert Dreams",
      releaseId: "5055504",
      labelName: "Sandstorm Music",
      artistName: "Fatima Ali",
      upc: "302948573920",
      creationDate: "May 20, 2025",
      tracks: 12,
      duration: "55:12",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 6,
      title: "Electric Pulse",
      releaseId: "5055505",
      labelName: "Voltage Records",
      artistName: "Kabir Khan",
      upc: "109283746523",
      creationDate: "Apr 11, 2025",
      tracks: 6,
      duration: "27:08",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 7,
      title: "Chasing Stars",
      releaseId: "5055506",
      labelName: "Galaxy Tunes",
      artistName: "Meera Nair",
      upc: "778899001122",
      creationDate: "Mar 07, 2025",
      tracks: 9,
      duration: "39:51",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 8,
      title: "Infinite Journey",
      releaseId: "5055507",
      labelName: "Skyline Records",
      artistName: "Arjun Verma",
      upc: "443322110098",
      creationDate: "Feb 22, 2025",
      tracks: 7,
      duration: "33:14",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 9,
      title: "Rhythm of Rain",
      releaseId: "5055508",
      labelName: "Rainfall Music",
      artistName: "Ananya Joshi",
      upc: "667788990011",
      creationDate: "Jan 18, 2025",
      tracks: 4,
      duration: "18:27",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 10,
      title: "Festival of Lights",
      releaseId: "5055509",
      labelName: "Harmony Records",
      artistName: "Siddharth Rao",
      upc: "556677889900",
      creationDate: "Dec 05, 2024",
      tracks: 11,
      duration: "48:09",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 11,
      title: "Ocean Vibes",
      releaseId: "5055501",
      labelName: "Wave Records",
      artistName: "Aarav Mehta",
      upc: "987654321012",
      creationDate: "Aug 28, 2025",
      tracks: 8,
      duration: "32:45",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 12,
      title: "Soulful Nights",
      releaseId: "5055502",
      labelName: "Nightfall Music",
      artistName: "Priya Kapoor",
      upc: "564738291034",
      creationDate: "Jul 15, 2025",
      tracks: 10,
      duration: "42:17",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 13,
      title: "Mystic Beats",
      releaseId: "5055503",
      labelName: "Mystic Records",
      artistName: "Rohit Sharma",
      upc: "857392047382",
      creationDate: "Jun 01, 2025",
      tracks: 5,
      duration: "21:30",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 14,
      title: "Desert Dreams",
      releaseId: "5055504",
      labelName: "Sandstorm Music",
      artistName: "Fatima Ali",
      upc: "302948573920",
      creationDate: "May 20, 2025",
      tracks: 12,
      duration: "55:12",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 15,
      title: "Electric Pulse",
      releaseId: "5055505",
      labelName: "Voltage Records",
      artistName: "Kabir Khan",
      upc: "109283746523",
      creationDate: "Apr 11, 2025",
      tracks: 6,
      duration: "27:08",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 16,
      title: "Chasing Stars",
      releaseId: "5055506",
      labelName: "Galaxy Tunes",
      artistName: "Meera Nair",
      upc: "778899001122",
      creationDate: "Mar 07, 2025",
      tracks: 9,
      duration: "39:51",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 17,
      title: "Infinite Journey",
      releaseId: "5055507",
      labelName: "Skyline Records",
      artistName: "Arjun Verma",
      upc: "443322110098",
      creationDate: "Feb 22, 2025",
      tracks: 7,
      duration: "33:14",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 18,
      title: "Rhythm of Rain",
      releaseId: "5055508",
      labelName: "Rainfall Music",
      artistName: "Ananya Joshi",
      upc: "667788990011",
      creationDate: "Jan 18, 2025",
      tracks: 4,
      duration: "18:27",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 19,
      title: "Festival of Lights",
      releaseId: "5055509",
      labelName: "Harmony Records",
      artistName: "Siddharth Rao",
      upc: "556677889900",
      creationDate: "Dec 05, 2024",
      tracks: 11,
      duration: "48:09",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 20,
      title: "Ocean Vibes",
      releaseId: "5055501",
      labelName: "Wave Records",
      artistName: "Aarav Mehta",
      upc: "987654321012",
      creationDate: "Aug 28, 2025",
      tracks: 8,
      duration: "32:45",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 21,
      title: "Soulful Nights",
      releaseId: "5055502",
      labelName: "Nightfall Music",
      artistName: "Priya Kapoor",
      upc: "564738291034",
      creationDate: "Jul 15, 2025",
      tracks: 10,
      duration: "42:17",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 22,
      title: "Mystic Beats",
      releaseId: "5055503",
      labelName: "Mystic Records",
      artistName: "Rohit Sharma",
      upc: "857392047382",
      creationDate: "Jun 01, 2025",
      tracks: 5,
      duration: "21:30",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 23,
      title: "Desert Dreams",
      releaseId: "5055504",
      labelName: "Sandstorm Music",
      artistName: "Fatima Ali",
      upc: "302948573920",
      creationDate: "May 20, 2025",
      tracks: 12,
      duration: "55:12",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 24,
      title: "Electric Pulse",
      releaseId: "5055505",
      labelName: "Voltage Records",
      artistName: "Kabir Khan",
      upc: "109283746523",
      creationDate: "Apr 11, 2025",
      tracks: 6,
      duration: "27:08",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 25,
      title: "Chasing Stars",
      releaseId: "5055506",
      labelName: "Galaxy Tunes",
      artistName: "Meera Nair",
      upc: "778899001122",
      creationDate: "Mar 07, 2025",
      tracks: 9,
      duration: "39:51",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 26,
      title: "Infinite Journey",
      releaseId: "5055507",
      labelName: "Skyline Records",
      artistName: "Arjun Verma",
      upc: "443322110098",
      creationDate: "Feb 22, 2025",
      tracks: 7,
      duration: "33:14",
      image: "/src/assets/samplIcon.png"
    },
    {
      id:  27,
      title: "Rhythm of Rain",
      releaseId: "5055508",
      labelName: "Rainfall Music",
      artistName: "Ananya Joshi",
      upc: "667788990011",
      creationDate: "Jan 18, 2025",
      tracks: 4,
      duration: "18:27",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 28,
      title: "Festival of Lights",
      releaseId: "5055509",
      labelName: "Harmony Records",
      artistName: "Siddharth Rao",
      upc: "556677889900",
      creationDate: "Dec 05, 2024",
      tracks: 11,
      duration: "48:09",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 29,
      title: "Ocean Vibes",
      releaseId: "5055501",
      labelName: "Wave Records",
      artistName: "Aarav Mehta",
      upc: "987654321012",
      creationDate: "Aug 28, 2025",
      tracks: 8,
      duration: "32:45",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 30,
      title: "Soulful Nights",
      releaseId: "5055502",
      labelName: "Nightfall Music",
      artistName: "Priya Kapoor",
      upc: "564738291034",
      creationDate: "Jul 15, 2025",
      tracks: 10,
      duration: "42:17",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 31,
      title: "Mystic Beats",
      releaseId: "5055503",
      labelName: "Mystic Records",
      artistName: "Rohit Sharma",
      upc: "857392047382",
      creationDate: "Jun 01, 2025",
      tracks: 5,
      duration: "21:30",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 32,
      title: "Desert Dreams",
      releaseId: "5055504",
      labelName: "Sandstorm Music",
      artistName: "Fatima Ali",
      upc: "302948573920",
      creationDate: "May 20, 2025",
      tracks: 12,
      duration: "55:12",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 33,
      title: "Electric Pulse",
      releaseId: "5055505",
      labelName: "Voltage Records",
      artistName: "Kabir Khan",
      upc: "109283746523",
      creationDate: "Apr 11, 2025",
      tracks: 6,
      duration: "27:08",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 34,
      title: "Chasing Stars",
      releaseId: "5055506",
      labelName: "Galaxy Tunes",
      artistName: "Meera Nair",
      upc: "778899001122",
      creationDate: "Mar 07, 2025",
      tracks: 9,
      duration: "39:51",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 35,
      title: "Infinite Journey",
      releaseId: "5055507",
      labelName: "Skyline Records",
      artistName: "Arjun Verma",
      upc: "443322110098",
      creationDate: "Feb 22, 2025",
      tracks: 7,
      duration: "33:14",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 36,
      title: "Rhythm of Rain",
      releaseId: "5055508",
      labelName: "Rainfall Music",
      artistName: "Ananya Joshi",
      upc: "667788990011",
      creationDate: "Jan 18, 2025",
      tracks: 4,
      duration: "18:27",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 37,
      title: "Festival of Lights",
      releaseId: "5055509",
      labelName: "Harmony Records",
      artistName: "Siddharth Rao",
      upc: "556677889900",
      creationDate: "Dec 05, 2024",
      tracks: 11,
      duration: "48:09",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 38,
      title: "Ocean Vibes",
      releaseId: "5055501",
      labelName: "Wave Records",
      artistName: "Aarav Mehta",
      upc: "987654321012",
      creationDate: "Aug 28, 2025",
      tracks: 8,
      duration: "32:45",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 39,
      title: "Soulful Nights",
      releaseId: "5055502",
      labelName: "Nightfall Music",
      artistName: "Priya Kapoor",
      upc: "564738291034",
      creationDate: "Jul 15, 2025",
      tracks: 10,
      duration: "42:17",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 40,
      title: "Mystic Beats",
      releaseId: "5055503",
      labelName: "Mystic Records",
      artistName: "Rohit Sharma",
      upc: "857392047382",
      creationDate: "Jun 01, 2025",
      tracks: 5,
      duration: "21:30",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 41,
      title: "Desert Dreams",
      releaseId: "5055504",
      labelName: "Sandstorm Music",
      artistName: "Fatima Ali",
      upc: "302948573920",
      creationDate: "May 20, 2025",
      tracks: 12,
      duration: "55:12",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 42,
      title: "Electric Pulse",
      releaseId: "5055505",
      labelName: "Voltage Records",
      artistName: "Kabir Khan",
      upc: "109283746523",
      creationDate: "Apr 11, 2025",
      tracks: 6,
      duration: "27:08",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 43,
      title: "Chasing Stars",
      releaseId: "5055506",
      labelName: "Galaxy Tunes",
      artistName: "Meera Nair",
      upc: "778899001122",
      creationDate: "Mar 07, 2025",
      tracks: 9,
      duration: "39:51",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 44,
      title: "Infinite Journey",
      releaseId: "5055507",
      labelName: "Skyline Records",
      artistName: "Arjun Verma",
      upc: "443322110098",
      creationDate: "Feb 22, 2025",
      tracks: 7,
      duration: "33:14",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 45,
      title: "Rhythm of Rain",
      releaseId: "5055508",
      labelName: "Rainfall Music",
      artistName: "Ananya Joshi",
      upc: "667788990011",
      creationDate: "Jan 18, 2025",
      tracks: 4,
      duration: "18:27",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 46,
      title: "Festival of Lights",
      releaseId: "5055509",
      labelName: "Harmony Records",
      artistName: "Siddharth Rao",
      upc: "556677889900",
      creationDate: "Dec 05, 2024",
      tracks: 11,
      duration: "48:09",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 47,
      title: "Ocean Vibes",
      releaseId: "5055501",
      labelName: "Wave Records",
      artistName: "Aarav Mehta",
      upc: "987654321012",
      creationDate: "Aug 28, 2025",
      tracks: 8,
      duration: "32:45",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 48,
      title: "Soulful Nights",
      releaseId: "5055502",
      labelName: "Nightfall Music",
      artistName: "Priya Kapoor",
      upc: "564738291034",
      creationDate: "Jul 15, 2025",
      tracks: 10,
      duration: "42:17",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 49,
      title: "Mystic Beats",
      releaseId: "5055503",
      labelName: "Mystic Records",
      artistName: "Rohit Sharma",
      upc: "857392047382",
      creationDate: "Jun 01, 2025",
      tracks: 5,
      duration: "21:30",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 50,
      title: "Desert Dreams",
      releaseId: "5055504",
      labelName: "Sandstorm Music",
      artistName: "Fatima Ali",
      upc: "302948573920",
      creationDate: "May 20, 2025",
      tracks: 12,
      duration: "55:12",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 51,
      title: "Electric Pulse",
      releaseId: "5055505",
      labelName: "Voltage Records",
      artistName: "Kabir Khan",
      upc: "109283746523",
      creationDate: "Apr 11, 2025",
      tracks: 6,
      duration: "27:08",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 52,
      title: "Chasing Stars",
      releaseId: "5055506",
      labelName: "Galaxy Tunes",
      artistName: "Meera Nair",
      upc: "778899001122",
      creationDate: "Mar 07, 2025",
      tracks: 9,
      duration: "39:51",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 53,
      title: "Infinite Journey",
      releaseId: "5055507",
      labelName: "Skyline Records",
      artistName: "Arjun Verma",
      upc: "443322110098",
      creationDate: "Feb 22, 2025",
      tracks: 7,
      duration: "33:14",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 54,
      title: "Rhythm of Rain",
      releaseId: "5055508",
      labelName: "Rainfall Music",
      artistName: "Ananya Joshi",
      upc: "667788990011",
      creationDate: "Jan 18, 2025",
      tracks: 4,
      duration: "18:27",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 55,
      title: "Festival of Lights",
      releaseId: "5055509",
      labelName: "Harmony Records",
      artistName: "Siddharth Rao",
      upc: "556677889900",
      creationDate: "Dec 05, 2024",
      tracks: 11,
      duration: "48:09",
      image: "/src/assets/samplIcon.png"
    }
  ];

  const columns = [
    {
      key: "title",
      label: "TITLE",
      sortable: true,
      render: (item) => (
        <div className="title-cell">
          <img src={item.image} alt={item.title} className="release-image" />
          <span>{item.title}</span>
        </div>
      )
    },
    { key: "releaseId", label: "RELEASE ID", sortable: true },
    {
      key: "labelName",
      label: "LABEL NAME",
      sortable: true,
      render: (item) => <span className="label-badge">{item.labelName}</span>
    },
    { key: "artistName", label: "ARTIST NAME", sortable: true },
    { key: "upc", label: "UPC", sortable: true },
    { key: "creationDate", label: "CREATION DATE", sortable: true },
    { key: "tracks", label: "TRACKS", sortable: true },
    { key: "duration", label: "DURATION", sortable: true }
  ];

  useEffect(() => {
  const filtered = releasesData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setTableData(filtered);
}, [searchTerm, setTableData]);

  const filteredData = releasesData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
 



  
  return (
    <div className="releases-tab">
      {
       showMode==="grid" ? <GridView data={filteredData} /> :  <DataTable data={filteredData} columns={columns} onSelectionChange={onSelectionChange} />
      } 
    </div>
  );
}

export default ReleasesTab;
