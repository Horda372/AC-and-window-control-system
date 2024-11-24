// static/js/scripts.js

async function loadMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const tableBody = document.getElementById("messages-table").querySelector("tbody");
    tableBody.innerHTML = "";  

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

loadMessages();

setInterval(loadMessages, 5000);
