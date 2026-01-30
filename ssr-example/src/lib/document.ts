/**
 * HTML Document template for SSR
 */
export interface DocumentOptions {
  title: string;
  description?: string;
  body: string;
  hydrationScript: string;
  styles?: string;
  clientScript?: string;
}

/**
 * Create a complete HTML document for SSR
 */
export function createDocument(options: DocumentOptions): string {
  const { 
    title, 
    description, 
    body, 
    hydrationScript, 
    styles = '/styles.css',
    clientScript = '/assets/client.js'  // Will be overridden by server
  } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    ${description ? `<meta name="description" content="${escapeHtml(description)}" />` : ''}
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>">
    <link rel="stylesheet" href="${styles}" />
</head>
<body>
    ${body}
    ${hydrationScript}
    <script src="${clientScript}" type="module"></script>
</body>
</html>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}
