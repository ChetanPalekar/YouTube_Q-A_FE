/**
 * Reveals text word-by-word with randomized delays between words,
 * to mimic natural, slightly uneven streaming.
 *
 * @param {string} fullText
 * @param {(partial: string) => void} onUpdate
 * @param {object} options
 * @param {number} options.minDelay - minimum ms between words
 * @param {number} options.maxDelay - maximum ms between words
 */
export function typeOutText(fullText, onUpdate, options = {}) {
    const { minDelay = 60, maxDelay = 220 } = options;
  
    return new Promise((resolve) => {
      const words = fullText.split(' ');
      let revealed = '';
      let index = 0;
  
      function revealNext() {
        if (index >= words.length) {
          resolve();
          return;
        }
  
        revealed += (index === 0 ? '' : ' ') + words[index];
        onUpdate(revealed);
        index++;
  
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        setTimeout(revealNext, randomDelay);
      }
  
      revealNext();
    });
  }