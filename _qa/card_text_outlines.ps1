param([string]$Manifest, [string]$Output)
Add-Type -AssemblyName System.Drawing
$items = Get-Content -LiteralPath $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json
$fontCollection = New-Object System.Drawing.Text.PrivateFontCollection
$fontCollection.AddFontFile((Join-Path $PSScriptRoot '..\Fonts\Font.otf'))
$fontCollection.AddFontFile((Join-Path $PSScriptRoot '..\Fonts\Font2.otf'))
$boldFamily = $fontCollection.Families | Where-Object Name -EQ 'thmanyah sans' | Select-Object -First 1
$lightFamily = $fontCollection.Families | Where-Object Name -EQ 'thmanyah sans Light' | Select-Object -First 1
$paths = @()
foreach ($item in $items) {
  $family = if ($item.light) { $lightFamily } else { $boldFamily }
  $format = [System.Drawing.StringFormat]::GenericTypographic.Clone()
  $format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::NoWrap
  if ($item.rtl) { $format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::DirectionRightToLeft }
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $style = if ($item.bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
  $path.AddString([string]$item.text, $family, [int]$style, [single]$item.size, [System.Drawing.PointF]::new(0,0), $format)
  $bounds = $path.GetBounds()
  $dx = switch ($item.anchor) { 'right' { [single]$item.x-$bounds.Right } 'center' { [single]$item.x-($bounds.Left+$bounds.Right)/2 } default { [single]$item.x-$bounds.Left } }
  $dy = [single]$item.y + 3 - $bounds.Bottom
  $matrix = New-Object System.Drawing.Drawing2D.Matrix
  $matrix.Translate($dx,$dy)
  $path.Transform($matrix)
  $points = $path.PathPoints
  $types = $path.PathTypes
  $commands = New-Object System.Collections.Generic.List[string]
  $i = 0
  while ($i -lt $points.Length) {
    $type = $types[$i] -band 7
    $p = $points[$i]
    $coords = '{0:0.###},{1:0.###}' -f $p.X,$p.Y
    if ($type -eq 0) { $commands.Add('M'+$coords) }
    elseif ($type -eq 1) { $commands.Add('L'+$coords) }
    elseif ($type -eq 3) {
      $p2=$points[$i+1]; $p3=$points[$i+2]
      $commands.Add(('C{0:0.###},{1:0.###} {2:0.###},{3:0.###} {4:0.###},{5:0.###}' -f $p.X,$p.Y,$p2.X,$p2.Y,$p3.X,$p3.Y))
      $i += 2
    }
    if (($types[$i] -band 128) -ne 0) { $commands.Add('Z') }
    $i++
  }
  $paths += [pscustomobject]@{ id=$item.id; d=($commands -join ''); width=$bounds.Width; height=$bounds.Height; text=$item.text }
  $path.Dispose(); $matrix.Dispose(); $format.Dispose()
}
$json = ConvertTo-Json -Depth 4 -InputObject $paths
[System.IO.File]::WriteAllText($Output,$json,[System.Text.UTF8Encoding]::new($false))
$fontCollection.Dispose()
