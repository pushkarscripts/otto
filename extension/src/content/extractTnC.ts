chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_TEXT') {
    const text = document.body.innerText.substring(0, 50000); 
    sendResponse({ text });
  }

  if (request.action === 'HIGHLIGHT_TEXT') {
    const quotes: string[] = request.quotes || [];
    let count = 0;

    // Simple robust highlighting
    // This finds text nodes containing the quote and wraps them.
    // Note: This assumes the quote is within a single text node or element.
    // For a hackathon, this is usually sufficient.
    
    quotes.forEach(quote => {
      if (!quote || quote.length < 10) return; // Skip too short

      // Clean quote for search (remove excess whitespace)
      const cleanQuote = quote.replace(/\s+/g, ' ').trim();

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent?.replace(/\s+/g, ' ') || '';
        if (text.includes(cleanQuote)) {
          const span = document.createElement('span');
          span.style.backgroundColor = '#ffeb3b'; // Yellow
          span.style.color = '#000';
          span.style.border = '2px solid red';
          span.style.padding = '2px';
          span.style.borderRadius = '4px';
          span.title = "Risky Clause Detected!";
          
          // We can't easily replace just the text inside the node without splitting it
          // So we replace the parent's content if it's a close match, 
          // or just wrap the parent if it's mostly that text.
          
          // Safer approach for specific text:
          const parent = node.parentElement;
          if (parent) {
             // Create a regex to replace the text with wrapped version
             // Escaping regex characters in quote
             const escaped = cleanQuote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
             // Try to highlight in the parent innerHTML
             // This re-parses HTML, which can be risky but works for visual demos
             try {
                const regex = new RegExp(escaped, 'i');
                if (regex.test(parent.innerText)) {
                   parent.innerHTML = parent.innerHTML.replace(
                     regex, 
                     `<mark style="background: #fee2e2; border-bottom: 2px solid #ef4444; color: #7f1d1d;">$&</mark>`
                   );
                   count++;
                   // Scroll to first match
                   if (count === 1) parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
             } catch (e) { console.error(e); }
          }
          break; // Move to next quote
        }
      }
    });

    sendResponse({ count });
  }
});
