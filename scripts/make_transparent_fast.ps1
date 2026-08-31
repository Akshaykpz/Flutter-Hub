Add-Type -AssemblyName System.Drawing

# Source logo image
$srcPath = "C:\Users\aksha\.gemini\antigravity-ide\brain\58ed09e9-a758-4905-9e96-baba22a1533c\media__1788160515244.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

# Create 32-bit ARGB bitmap with alpha channel
$w = $img.Width
$h = $img.Height
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Create circular clip path with tight margin to clip out any outer white box
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$margin = 15
$path.AddEllipse($margin, $margin, ($w - 2 * $margin), ($h - 2 * $margin))

$g.SetClip($path)
$g.DrawImage($img, 0, 0, $w, $h)

$g.Dispose()
$img.Dispose()

$outPath = "c:\Users\aksha\Downloads\Flutter_Tech_Fixed\assets\images\flutterhub-logo.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Circular transparent PNG logo created successfully!"
