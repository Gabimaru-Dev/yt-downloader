document.getElementById("downloadForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const url = document.getElementById("youtubeUrl").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = '';
  resultDiv.classList.add('hidden');

  try {
    const response = await fetch("/api/download-mp3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (data.download?.url) {
      resultDiv.innerHTML = `
        <div class="result-card">
          <img src="${data.metadata.thumbnail}" alt="Thumbnail">
          <div class="info">
            <h3>${data.metadata.title}</h3>
            <a href="${data.download.url}" download>Download MP3 (${data.download.quality})</a>
          </div>
        </div>
      `;
      resultDiv.classList.remove('hidden');
    } else {
      resultDiv.innerHTML = "<p>Unable to fetch download link.</p>";
      resultDiv.classList.remove('hidden');
    }
  } catch (err) {
    resultDiv.innerHTML = "<p>Error fetching data. Try again later.</p>";
    resultDiv.classList.remove('hidden');
  }
});