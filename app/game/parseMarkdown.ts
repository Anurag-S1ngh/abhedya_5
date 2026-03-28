/**
 * Minimal markdown → HTML parser.
 * Supports: **bold**, *italic*, `code`, [link](url), and newlines.
 */
export function parseMarkdown(text: string): string {
  return text
    // escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // inline code
    .replace(/`(.+?)`/g, '<code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#FF7500]">$1</code>')
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#FF7500] underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener">$1</a>')
    // newlines → <br>
    .replace(/\n/g, "<br />")
}
