async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const userText = inputField.value.trim();
    if (!userText) return;

    // Display user message
    const userBubble = document.createElement("div");
    userBubble.className = "bg-blue-600 text-white self-end p-3 rounded-xl max-w-sm";
    userBubble.textContent = userText;
    chatBox.appendChild(userBubble);
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Bot typing indicator
    const typingBubble = document.createElement("div");
    typingBubble.className = "italic text-gray-400 self-start p-3 max-w-sm";
    typingBubble.textContent = "Tali is typing...";
    chatBox.appendChild(typingBubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://your-project-name.up.railway.app/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText }),
        });

        const data = await response.json();
        typingBubble.remove(); // remove typing indicator

        const botText = document.createElement("div");
        botText.className = "self-start p-3 rounded-xl max-w-sm";
        botText.style.color = "#d4a373";
        botText.textContent = "";
        chatBox.appendChild(botText);

        // Typing animation
        let i = 0;
        const typing = setInterval(() => {
            if (i < data.reply.length) {
                botText.textContent += data.reply.charAt(i);
                i++;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                clearInterval(typing);
            }
        }, 30);
    } catch (err) {
        console.error("Chat error:", err);
        typingBubble.remove();

        const errorText = document.createElement("div");
        errorText.className = "bg-red-100 text-red-800 self-start p-3 rounded-xl max-w-sm";
        errorText.textContent = "Something went wrong.";
        chatBox.appendChild(errorText);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
