const infoBtn = document.getElementById("infoBtn");
const infoBox = document.getElementById("information");
const span = document.getElementById("hel")

async function downloadAudio() {
  const url = document.getElementById("urlInput").value;
  if (!url) return alert("Please enter a url");

  try {
    const data = await fetch(
      `http://localhost:3000/api/get-info?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        credentials: true,
      },{
        "Content-Type": "application/json"
      }
    );

    if (data.success == true) {
      infoBox.innerHTML(`
                    <div >
                    <img id="img"/>
                    </div>
                    `);
    }
  } catch (error) {
    console.log(error);
  }
}

infoBtn.addEventListener("click", downloadAudio);

span.innerHTML = "<div>hello</div>"


