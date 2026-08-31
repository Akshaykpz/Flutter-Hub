Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\aksha\Downloads\Flutter_Tech_Fixed\assets\images\flutterhub-logo.png"
$bmp = [System.Drawing.Bitmap]::new($srcPath)
$width = $bmp.Width
$height = $bmp.Height

$cx = $width / 2.0
$cy = $height / 2.0
$radius = ($width / 2.0) - 10.0

Write-Host "Processing image dimensions: $width x $height"

# Create a new Bitmap with Format32bppArgb for full alpha channel transparency
$newBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)

        # Check if white background or outside circle radius
        $isWhite = ($pixel.R -gt 210 -and $pixel.G -gt 210 -and $pixel.B -gt 210)

        if ($dist -ge $radius -or $isWhite) {
            # Make completely transparent
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Feather edge if close to radius
            if ($dist -gt ($radius - 4)) {
                $alpha = [int](255 * (($radius - $dist) / 4.0))
                if ($alpha -lt 0) { $alpha = 0 }
                if ($alpha -gt 255) { $alpha = 255 }
                $c = [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B)
                $newBmp.SetPixel($x, $y, $c)
            } else {
                $newBmp.SetPixel($x, $y, $pixel)
            }
        }
    }
}

$bmp.Dispose()

# Save transparent logo
$outPath = "c:\Users\aksha\Downloads\Flutter_Tech_Fixed\assets\images\flutterhub-logo.png"
$newBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Dispose()

Write-Host "Successfully removed white square background and saved transparent PNG logo!"
