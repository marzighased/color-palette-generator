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
