async function analyze() {
  const textArea = document.getElementById("textInput");
  const fileInput = document.getElementById("imageInput");
  const resultDiv = document.getElementById("result");

  let message = textArea.value;

  // If no text but image selected, use OCR
  if (!message && fileInput.files.length > 0) {
    resultDiv.innerText = "Extracting text from image...";
    const file = fileInput.files[0];
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    message = text;
    textArea.value = text;
  }

  if (!message.trim()) {
    resultDiv.innerText = "Please paste a message or upload an image.";
    return;
  }

  resultDiv.innerText = "Analyzing...";

  try {
    const response = await fetch("https://is-this-a-scam-backend.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (data.result) {
      resultDiv.innerText = data.result;
    } else {
      resultDiv.innerText = "Error: " + (data.error || "Unexpected response.");
    }
  } catch (err) {
    resultDiv.innerText = "Failed to reach the server.";
  }
}