generatePalette() {
    this.currentPalette = [];
    const paletteContainer = document.getElementById('paletteContainer');
    paletteContainer.innerHTML = '';

    // Generate 5 harmonious colors
    const baseHue = Math.floor(Math.random() * 360);
    const colors = this.generateHarmoniousColors(baseHue);

    colors.forEach((color, index) => {
        this.currentPalette.push(color);
        this.createColorCard(color, index);
    });
}

generateHarmoniousColors(baseHue) {
    const colors = [];
    const colorSchemes = [
        [0, 30, 60, 180, 210], // Split complementary
        [0, 60, 120, 180, 240], // Pentadic
        [0, 15, 30, 180, 195], // Analogous + complement
        [0, 90, 180, 270, 45], // Tetradic + accent
    ];

    const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    scheme.forEach(offset => {
        const hue = (baseHue + offset) % 360;
        const saturation = 65 + Math.random() * 30; // 65-95%
        const lightness = 45 + Math.random() * 35; // 45-80%
        const color = this.hslToHex(hue, saturation, lightness);
        colors.push(color);
    });

    return colors;
}

hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

createColorCard(color, index) {
    const paletteContainer = document.getElementById('paletteContainer');
    const colorCard = document.createElement('div');
    colorCard.className = 'color-card';
    colorCard.style.backgroundColor = color;
    colorCard.style.animationDelay = `${index * 0.1}s`;

    colorCard.innerHTML = `
        <div class="color-info">
            <div class="color-code">${color.toUpperCase()}</div>
            <div class="copy-text">Click to Copy</div>
        </div>
    `;

    colorCard.addEventListener('click', () => this.copyToClipboard(color));
    paletteContainer.appendChild(colorCard);
}

copyToClipboard(color) {
    navigator.clipboard.writeText(color).then(() => {
        this.showNotification(`Copied ${color} to clipboard! 🎉`);
    });
}

savePalette() {
    if (this.currentPalette.length === 0) return;
    
    const paletteId = Date.now();
    const palette = {
        id: paletteId,
        colors: [...this.currentPalette],
        timestamp: new Date().toISOString()
    };

    this.savedPalettes.unshift(palette);
    if (this.savedPalettes.length > 10) {
        this.savedPalettes = this.savedPalettes.slice(0, 10);
    }

    localStorage.setItem('colorPalettes', JSON.stringify(this.savedPalettes));
    this.displaySavedPalettes();
    this.showNotification('Palette saved successfully! 💾');
}

displaySavedPalettes() {
    const savedSection = document.getElementById('savedSection');
    const savedPalettes = document.getElementById('savedPalettes');
    
    if (this.savedPalettes.length === 0) {
        savedSection.style.display = 'none';
        return;
    }

    savedSection.style.display = 'flex';
    savedPalettes.innerHTML = '';

    this.savedPalettes.forEach(palette => {
        const paletteElement = document.createElement('div');
        paletteElement.className = 'saved-palette';
        paletteElement.onclick = () => this.loadPalette(palette.colors);

        palette.colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'saved-color';
            colorDiv.style.backgroundColor = color;
            paletteElement.appendChild(colorDiv);
        });

        savedPalettes.appendChild(paletteElement);
    });
}

loadPalette(colors) {
    this.currentPalette = colors;
    const paletteContainer = document.getElementById('paletteContainer');
    paletteContainer.innerHTML = '';

    colors.forEach((color, index) => {
        this.createColorCard(color, index);
    });

    this.showNotification('Palette loaded! 🎨');
}
