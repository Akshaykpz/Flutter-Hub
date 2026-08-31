Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\aksha\Downloads\Flutter_Tech_Fixed\assets\images\flutterhub-logo.png"
$destDir = "c:\Users\aksha\Downloads\Flutter_Tech_Fixed\assets\images"

function Resize-Image($src, $dest, $w, $h) {
    $img = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
}

Resize-Image $sourcePath "$destDir\favicon.png" 32 32
Resize-Image $sourcePath "$destDir\favicon-64.png" 64 64
Resize-Image $sourcePath "$destDir\icon-128.png" 128 128
Resize-Image $sourcePath "$destDir\icon-256.png" 256 256
Resize-Image $sourcePath "$destDir\icon-512.png" 512 512
Resize-Image $sourcePath "$destDir\apple-touch-icon.png" 180 180
Write-Host "Generated all icon sizes successfully!"
