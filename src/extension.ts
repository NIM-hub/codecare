import * as vscode from 'vscode';

// 🔁 Change this to set how often reminders should appear (in minutes)
// 🔁 Change this to set how often reminders should appear (in minutes)
let reminderIntervalMinutes = 2;
let messageIndex = 0;

// 🕒 Store the reminder timer so it can be stopped later
let reminderTimer: NodeJS.Timeout | undefined;
// 🧘‍♀️ Reminder messages shown one by one
const reminderMessages = [
  {
    title: "💧 Time to Hydrate!",
    body: "Stretch your body, relax your eyes. You’re doing great! 😊"
  },
  {
    title: "🧘‍♀️ Breathe & Relax",
    body: "Take a deep breath. You’re more than just your code."
  },
  {
    title: "☕ Take a Mini Break",
    body: "Refuel with a sip of coffee or tea. You deserve it!"
  },
  {
    title: "📣 Straighten Your Spine!",
    body: "Posture check! Sit up with pride, coder 💪"
  },
  {
    title: "🌿 You Matter",
    body: "Even if the code fails, your health shouldn’t. Rest for a moment."
  }
];

export function activate(context: vscode.ExtensionContext) {
  console.log('✨ CodeCare extension is activated');

  // 🌟 Show a warm welcome message once
  vscode.window.showInformationMessage('✨ CodeCare is active! You are not alone, coder ❤️');

  const intervalMillis = reminderIntervalMinutes * 60 * 1000;

  // 🕒 Start showing motivational popups
  // 🕒 Start showing motivational popups
reminderTimer = setInterval(() => {
    const message = reminderMessages[messageIndex];
    showReminderWebview(message.title, message.body);
    messageIndex = (messageIndex + 1) % reminderMessages.length;
    console.log('🔔 Reminder triggered');
  }, intervalMillis);
}

// 💬 Create a visual popup using Webview
function showReminderWebview(title: string, body: string) {
  const panel = vscode.window.createWebviewPanel(
    'codecareReminder',
    '🌼 CodeCare Reminder',
    vscode.ViewColumn.Active, // Show in second column (non-intrusive)
    { enableScripts: true }
  );

  panel.webview.html = getWebviewContent(title, body);

  // ⏳ Close the popup automatically after 10 seconds
setTimeout(() => {
  panel.dispose(); // always dispose after 10 seconds
}, 10000);

}

// 📄 HTML content of popup
function getWebviewContent(title: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          background-color: #1e1e1e;
          color: white;
          font-family: sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        
        }
        .popup {
          background: #2c2c2c;
          padding: 18px 28px;
          margin: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          max-width: 350px;
        }
        h3 {
          color: #4dd0e1;
          margin: 0 0 10px 0;
        }
        p {
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="popup">
        <h3>${title}</h3>
        <p>${body}</p>
      </div>
    </body>
    </html>
  `;
}

export function deactivate() {
  if (reminderTimer) {
    clearInterval(reminderTimer);
    console.log('🛑 CodeCare reminder stopped.');
  }
}