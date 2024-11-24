// static/js/scripts.js

// Function to fetch and display messages
async function loadMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const tableBody = document.getElementById("messages-table").querySelector("tbody");
    tableBody.innerHTML = "";  // Clear existing rows

    messages.forEach(msg => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${msg.topic}</td>
            <td>${msg.message}</td>
            <td class="timestamp">${new Date(msg.timestamp).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initial load
loadMessages();

// Polling for new messages every 5 seconds
setInterval(loadMessages, 5000);
