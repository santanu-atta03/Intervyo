# Console Log Removal Script
# Finds all console.log statements in Backend

Write-Host "Finding console.log statements in Backend..." -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

$BackendPath = "Backend"
$patterns = @("console.log", "console.error", "console.warn", "console.debug")

foreach ($pattern in $patterns) {
    Write-Host "`nSearching for: $pattern" -ForegroundColor Yellow
    
    $results = Get-ChildItem -Path $BackendPath -Filter "*.js" -Recurse | 
        Select-String -Pattern $pattern |
        Where-Object { 
            $_.Line -notmatch "^\s*//" -and  # Exclude commented lines
            $_.Path -notmatch "test" -and    # Exclude test files
            $_.Path -notmatch "logger.js"    # Exclude logger itself
        }
    
    if ($results) {
        $groupedResults = $results | Group-Object Path
        
        Write-Host "  Found in $($groupedResults.Count) files:" -ForegroundColor Red
        
        foreach ($group in $groupedResults) {
            $relativePath = $group.Name.Replace("$PWD\", "")
            Write-Host "    - $relativePath ($($group.Count) occurrences)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  None found!" -ForegroundColor Green
    }
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "Scan complete!" -ForegroundColor Green
