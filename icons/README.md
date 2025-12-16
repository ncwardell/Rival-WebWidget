# Extension Icons

This directory should contain PNG icon files for the Chrome extension.

## Required Files

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## How to Create Icons

### Option 1: Use the provided SVG

1. Open `icon.svg` in an image editor like GIMP, Inkscape, or Adobe Illustrator
2. Export as PNG at the required sizes (16x16, 48x48, 128x128)
3. Save the files as `icon16.png`, `icon48.png`, and `icon128.png` in this directory

### Option 2: Use an online converter

1. Visit a site like https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Convert to PNG at each required size
4. Download and rename the files appropriately

### Option 3: Use ImageMagick (command line)

```bash
# Install ImageMagick if not already installed
# brew install imagemagick  # macOS
# sudo apt-get install imagemagick  # Linux

# Convert SVG to PNG at different sizes
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Option 4: Create your own icons

Feel free to create custom icons that match your branding. Just ensure they are PNG files at the required dimensions.

## Temporary Workaround

If you want to test the extension without icons, you can remove the `icons` and `action.default_icon` sections from `manifest.json`. However, the extension will show a default gray icon.
