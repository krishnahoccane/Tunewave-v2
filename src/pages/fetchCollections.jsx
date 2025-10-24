const fetch = require("node-fetch");
const { GF_USER, GF_PASS, GF_URL } = require("./config");

const entryData = {
  form_id: 1,
  1: "ISRC12345678",
  3: "My Test Track",
  4: "Original",
  5: "John Doe, Jane Doe",
  6: "Composer Name",
  7: "Director Name",
  8: "Producer Name",
  9: "Lyricist Name",
  10: "https://example.com/audio.mp3",
  11: "English",
  12: "Clean",
  16: "00:03:30",
};

async function submitEntry() {
  try {
    const response = await fetch(GF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${GF_USER}:${GF_PASS}`).toString("base64"),
      },
      body: JSON.stringify(entryData),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

submitEntry();
