Write-Host "🧪 TESTING BUYORDER GENERATION" -ForegroundColor Cyan
Write-Host "=" -Repeat 40 -ForegroundColor Cyan

$userId = "684e72208d209416487ec6db"

for ($i = 1; $i -le 5; $i++) {
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds().ToString().Substring(5)
    $userHash = $userId.Substring($userId.Length - 6)
    $random = -join ((1..6) | ForEach { [char]((97..122) + (48..57) | Get-Random) })
    
    $buyOrder = "ORD$timestamp$userHash$random".ToUpper()
    
    Write-Host "Test $i" -ForegroundColor Yellow
    Write-Host "  BuyOrder: $buyOrder" -ForegroundColor White
    Write-Host "  Length: $($buyOrder.Length) caracteres" -ForegroundColor White
    if ($buyOrder.Length -le 26) {
        Write-Host "  Valid: ✅" -ForegroundColor Green
    } else {
        Write-Host "  Valid: ❌" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "📋 RESUMEN:" -ForegroundColor Cyan
Write-Host "- Formato: ORD + 8 dígitos timestamp + 6 chars userId + 6 chars random" -ForegroundColor White
Write-Host "- Longitud esperada: 3 + 8 + 6 + 6 = 23 caracteres" -ForegroundColor White
Write-Host "- Límite Transbank: 26 caracteres" -ForegroundColor White
