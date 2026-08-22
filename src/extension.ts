import * as vscode from 'vscode';

let reminderTimer: NodeJS.Timeout | undefined;
let messageIndex = 0;

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

    // 🌟 Show welcome message
    vscode.window.showInformationMessage(
        '✨ CodeCare is active! You are not alone, coder ❤️'
    );

    // ▶️ Start reminders using the user's settings
    startReminderTimer(context.extensionUri);

    // ⚙️ Restart reminders when CodeCare settings change
    const configurationListener = vscode.workspace.onDidChangeConfiguration((event) => {
        if (
            event.affectsConfiguration('codecare.enableReminders') ||
            event.affectsConfiguration('codecare.reminderInterval')
        ) {
            console.log('⚙️ CodeCare settings changed.');
            startReminderTimer(context.extensionUri);
        }
    });

    context.subscriptions.push(configurationListener);
}

// ▶️ Start or restart the reminder timer
function startReminderTimer(extensionUri: vscode.Uri) {
    // Stop the existing timer first
    if (reminderTimer) {
        clearInterval(reminderTimer);
        reminderTimer = undefined;
    }

    const config = vscode.workspace.getConfiguration('codecare');

    const enableReminders = config.get<boolean>('enableReminders', true);
    const reminderIntervalMinutes = config.get<number>(
        'reminderInterval',
        60
    );

    // 🚫 Reminders are disabled
    if (!enableReminders) {
        console.log('⏸️ CodeCare reminders are disabled.');
        return;
    }

    // 🛡️ Prevent invalid intervals
    const safeIntervalMinutes = Math.max(1, reminderIntervalMinutes);
    const intervalMillis = safeIntervalMinutes * 60 * 1000;

    console.log(
        `⏰ CodeCare reminders enabled. Interval: ${safeIntervalMinutes} minute(s).`
    );

    reminderTimer = setInterval(() => {
        const message = reminderMessages[messageIndex];

        showReminderWebview(message.title, message.body, extensionUri);

        messageIndex =
            (messageIndex + 1) % reminderMessages.length;

        console.log('🔔 Reminder triggered');
    }, intervalMillis);
}

// 💬 Create a visual popup using Webview
function showReminderWebview(title: string, body: string, extensionUri: vscode.Uri) {
    const panel = vscode.window.createWebviewPanel(
        'codecareReminder',
        'CodeCare Reminder',
        { viewColumn: vscode.ViewColumn.Active, preserveFocus: true },
        { enableScripts: false }
    );

    // 🍃 Use CodeCare's own icon for the tab, instead of the default placeholder
    panel.iconPath = vscode.Uri.joinPath(extensionUri, 'icon.png');

    panel.webview.html = getWebviewContent(title, body);

    // ⏳ Close popup automatically after 10 seconds, regardless of visibility
    setTimeout(() => {
        panel.dispose();
    }, 10000);
}

// 📄 HTML content of popup
function getWebviewContent(title: string, body: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
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
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
        reminderTimer = undefined;
        console.log('🛑 CodeCare reminder stopped.');
    }
}