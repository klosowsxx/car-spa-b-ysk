<#
  Lokalny podgląd strony (bez Node i Pythona).
  Uruchomienie: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 5940]

  Obsługuje żądania zakresowe (HTTP Range). Bez tego przeglądarka nie
  przewinie filmu ani o sekundę — `video.currentTime` po prostu wraca do zera.
#>
param(
  [int]$Port = 5940
)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

$mime = @{
  ".html"  = "text/html; charset=utf-8"
  ".css"   = "text/css; charset=utf-8"
  ".js"    = "application/javascript; charset=utf-8"
  ".svg"   = "image/svg+xml"
  ".png"   = "image/png"
  ".jpg"   = "image/jpeg"
  ".jpeg"  = "image/jpeg"
  ".webp"  = "image/webp"
  ".avif"  = "image/avif"
  ".ico"   = "image/x-icon"
  ".json"  = "application/json"
  ".pdf"   = "application/pdf"
  ".xml"   = "application/xml; charset=utf-8"
  ".txt"   = "text/plain; charset=utf-8"
  ".woff"  = "font/woff"
  ".woff2" = "font/woff2"
  ".ttf"   = "font/ttf"
  ".mp4"   = "video/mp4"
  ".m4v"   = "video/mp4"
  ".webm"  = "video/webm"
  ".mov"   = "video/quicktime"
  ".mp3"   = "audio/mpeg"
}

Write-Host "Podglad: http://localhost:$Port/  (Ctrl+C konczy)"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  try {
    $path = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
    if ($path -eq "/") { $path = "/index.html" }
    $filePath = Join-Path $root ($path.TrimStart("/"))

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = $mime[$ext]
      if (-not $contentType) { $contentType = "application/octet-stream" }

      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentType = $contentType
      # Bez tego przeglądarka sama decyduje, jak długo trzymać plik, i po
      # zmianie w kodzie potrafi serwować starą wersję strony. Przy podglądzie
      # zawsze chcemy widzieć to, co jest na dysku.
      $response.Headers.Add("Cache-Control", "no-store, must-revalidate")
      $response.Headers.Add("Accept-Ranges", "bytes")

      $start = 0
      $end = $bytes.Length - 1
      $czesciowo = $false

      $naglowekZakresu = $request.Headers["Range"]
      if ($naglowekZakresu -and $naglowekZakresu -match "bytes=(\d*)-(\d*)") {
        $od = $matches[1]
        $do = $matches[2]

        if ($od -eq "" -and $do -ne "") {
          # postać "bytes=-500", czyli ostatnie 500 bajtów
          $start = $bytes.Length - [int]$do
          if ($start -lt 0) { $start = 0 }
        }
        else {
          if ($od -ne "") { $start = [int]$od }
          if ($do -ne "") { $end = [int]$do }
        }

        if ($end -gt ($bytes.Length - 1)) { $end = $bytes.Length - 1 }
        if ($start -le $end) { $czesciowo = $true }
      }

      if ($czesciowo) {
        $dlugosc = $end - $start + 1
        $response.StatusCode = 206
        $response.Headers.Add("Content-Range", "bytes $start-$end/$($bytes.Length)")
        $response.ContentLength64 = $dlugosc
        $response.OutputStream.Write($bytes, $start, $dlugosc)
      }
      else {
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    }
    else {
      $response.StatusCode = 404
      $notFound = [System.Text.Encoding]::UTF8.GetBytes("404: $path")
      $response.ContentType = "text/plain; charset=utf-8"
      $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
  }
  catch {
    # Przeglądarka rutynowo przerywa pobieranie fragmentów filmu w połowie.
    # Bez tego każde takie zerwanie kładłoby serwer podglądu.
  }
  finally {
    try { $response.OutputStream.Close() } catch { }
  }
}
