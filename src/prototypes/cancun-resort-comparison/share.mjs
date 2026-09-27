export const comparisonUrl = "https://familytripwise.com/where-to-stay/cancun-family-resorts.html#quick-comparison";

export function setupSharing({ root, clipboard }) {
  const controls = root.querySelector("#comparison-actions");
  const copy = root.querySelector("#copy-comparison");
  const fallback = root.querySelector("#comparison-link-fallback");
  const input = root.querySelector("#comparison-link");
  const status = root.querySelector("#share-status");
  input.value = comparisonUrl;
  controls.hidden = false;
  copy.addEventListener("click", async () => {
    copy.disabled = true;
    try {
      if (!clipboard?.writeText) throw new Error("Clipboard unavailable");
      await clipboard.writeText(comparisonUrl);
      fallback.hidden = true;
      status.textContent = "Comparison link copied.";
    } catch {
      fallback.hidden = false;
      status.textContent = "Automatic copy unavailable. Comparison link selected below.";
      input.focus();
      input.select();
    } finally {
      copy.disabled = false;
    }
  });
}
