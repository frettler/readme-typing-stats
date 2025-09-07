class SVGGenerator {
  constructor() {
    this.defaultOptions = {
      width: 400,
      height: 50,
      fontSize: 14,
      fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      color: '#58a6ff',
      backgroundColor: 'transparent',
      cursor: true,
      repeat: true,
      speed: 50,
      theme: 'dark'
    };
  }

  generateTypingAnimation(text, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    
    // Calculate dimensions based on text length
    const textWidth = text.length * (opts.fontSize * 0.6);
    const width = Math.max(opts.width, textWidth + 40);
    const height = opts.height;
    
    // Theme colors
    const colors = this.getThemeColors(opts.theme);
    const textColor = opts.color || colors.text;
    const bgColor = opts.backgroundColor || colors.background;
    // Make cursor follow text color by default; allow explicit override via opts.cursorColor
    const cursorColor = opts.cursorColor || textColor;
    const cursorStroke = this.getContrastingStrokeColor(bgColor);

    // Animation timing
    const charDelay = opts.speed; // milliseconds per character
    const totalDuration = text.length * charDelay + 2000; // + 2 seconds pause

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .typing-text {
        font-family: ${opts.fontFamily};
        font-size: ${opts.fontSize}px;
        fill: ${textColor};
        dominant-baseline: middle;
      }
      .cursor {
        fill: ${cursorColor};
        opacity: 1;
        shape-rendering: crispEdges;
      }
      ${bgColor !== 'transparent' ? `
      .background {
        fill: ${bgColor};
      }
      ` : ''}
    </style>
  </defs>
  
  ${bgColor !== 'transparent' ? `<rect class="background" width="100%" height="100%" rx="6"/>` : ''}
  
  <text x="10" y="${height / 2}" class="typing-text">
    ${this.generateTextElements(text, charDelay, opts.repeat)}
  </text>
  
  ${opts.cursor ? this.generateCursorAnimation(text, opts.fontSize, height, charDelay, opts.repeat, cursorStroke) : ''}
</svg>`.trim();

    return svg;
  }

  generateTextElements(text, charDelay, repeat) {
    const characters = text.split('');
    let elements = '';
    
    characters.forEach((char, index) => {
      const delay = (index * charDelay) / 1000; // Convert to seconds
      const animationDuration = 0.1; // Quick fade-in for each character
      
      if (repeat) {
        const totalCycleDuration = ((text.length * charDelay + 2000) / 1000); // Convert to seconds
        elements += `<tspan opacity="0">${this.escapeXML(char)}<animate attributeName="opacity" values="0;1;1;1;0" dur="${totalCycleDuration}s" begin="${delay}s" repeatCount="indefinite"/></tspan>`;
      } else {
        elements += `<tspan opacity="0">${this.escapeXML(char)}<animate attributeName="opacity" values="0;1" dur="${animationDuration}s" begin="${delay}s" fill="freeze"/></tspan>`;
      }
    });
    
    return elements;
  }

  generateTextElementsWithOffset(text, charDelay, repeat, baseDelaySeconds) {
    const characters = Array.from(text);
    let elements = '';
    const animationDuration = 0.1;
    
    characters.forEach((char, index) => {
      const delaySeconds = baseDelaySeconds + (index * charDelay) / 1000;
      if (repeat) {
        const totalCycleDuration = ((characters.length * charDelay + 2000) / 1000);
        elements += `<tspan opacity="0">${this.escapeXML(char)}<animate attributeName="opacity" values="0;1;1;1;0" dur="${totalCycleDuration}s" begin="${delaySeconds}s" repeatCount="indefinite"/></tspan>`;
      } else {
        elements += `<tspan opacity="0">${this.escapeXML(char)}<animate attributeName="opacity" values="0;1" dur="${animationDuration}s" begin="${delaySeconds}s" fill="freeze"/></tspan>`;
      }
    });
    
    return elements;
  }

  escapeXML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  generateTypingValues(line) {
    // Build progressive values from empty to full string for textContent animation
    // Use Array.from to handle Unicode code points (e.g., emoji) correctly
    const glyphs = Array.from(line);
    const steps = [''];
    for (let i = 1; i <= glyphs.length; i++) {
      const slice = glyphs.slice(0, i).join('');
      steps.push(this.escapeXML(slice));
    }
    return steps.join(';');
  }

  generateCursorAnimation(text, fontSize, height, charDelay, repeat, cursorStroke) {
    const advance = fontSize * 0.6;
    const baseX = 10;
    const pauseMs = 2000;
    const totalDurationMs = text.length * charDelay + pauseMs;
    const cursorY = height / 2 - fontSize / 2;

    // Build keyTimes (normalized) and x values so the cursor jumps once per character
    const keyTimes = [];
    const values = [];
    for (let i = 0; i <= text.length; i++) {
      keyTimes.push((i * charDelay) / totalDurationMs);
      values.push(baseX + i * advance + 2); // +2 for small padding after last glyph
    }
    // Ensure we end exactly at 1 to account for the pause duration
    if (keyTimes[keyTimes.length - 1] < 1) {
      keyTimes.push(1);
      values.push(baseX + text.length * advance + 2);
    }

    const durSeconds = (totalDurationMs / 1000).toFixed(3);
    const keyTimesAttr = keyTimes.map(t => Math.min(1, Math.max(0, t)).toFixed(3)).join(';');
    const valuesAttr = values.map(v => v.toFixed(2)).join(';');
    const repeatAttr = repeat ? 'indefinite' : '1';
    const fillAttr = repeat ? '' : ' fill="freeze"';

    // Cursor width proportional to font size for visibility
    const cursorWidth = Math.max(2, Math.round(fontSize * 0.12));

    return `
      <rect x="${baseX}" y="${cursorY}" width="${cursorWidth}" height="${fontSize}" class="cursor" stroke="${cursorStroke}" stroke-width="0.5">
        <animate attributeName="x"
                 values="${valuesAttr}"
                 keyTimes="${keyTimesAttr}"
                 calcMode="discrete"
                 dur="${durSeconds}s"
                 repeatCount="${repeatAttr}"${fillAttr}/>
        <animate attributeName="opacity" 
                 values="1;0.25;1;0.25" 
                 dur="1s" 
                 repeatCount="indefinite"/>
      </rect>
    `;
  }

  getContrastingStrokeColor(bgColor) {
    // Basic luminance check for contrast; default to semi-transparent opposite
    if (!bgColor || bgColor === 'transparent') {
      return 'rgba(0,0,0,0.35)';
    }
    const hex = bgColor.replace('#', '');
    if (hex.length !== 6) return 'rgba(0,0,0,0.35)';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Relative luminance approximation
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 140 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)';
  }

  getThemeColors(theme) {
    const themes = {
      dark: {
        text: '#e6edf3',
        background: '#0d1117',
        cursor: '#58a6ff'
      },
      light: {
        text: '#24292f',
        background: '#ffffff',
        cursor: '#0969da'
      },
      ocean: {
        text: '#7dd3fc',
        background: '#0f172a',
        cursor: '#38bdf8'
      },
      forest: {
        text: '#86efac',
        background: '#14532d',
        cursor: '#4ade80'
      },
      sunset: {
        text: '#fbbf24',
        background: '#7c2d12',
        cursor: '#f59e0b'
      }
    };

    return themes[theme] || themes.dark;
  }

  // Multiline animation removed by request
}

module.exports = SVGGenerator;

