<#
.SYNOPSIS
    Creates multiple PR branches from current changes for Intervyo project
.DESCRIPTION
    This script splits your current changes into 9 separate branches,
    each containing related changes for individual PRs
#>

Write-Host "Intervyo Multi-PR Branch Creator" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not in a git repository!" -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "Error: No changes to commit!" -ForegroundColor Red
    exit 1
}

Write-Host "`nCurrent changes detected:" -ForegroundColor Yellow
git status --short

Write-Host "`nThis script will:" -ForegroundColor Yellow
Write-Host "  1. Create a backup branch with all changes" -ForegroundColor Gray
Write-Host "  2. Create 9 separate feature branches from main" -ForegroundColor Gray
Write-Host "  3. Push all branches to origin" -ForegroundColor Gray
Write-Host "`nMake sure you've pulled the latest changes from main!" -ForegroundColor Yellow

$confirm = Read-Host "`nDo you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted by user" -ForegroundColor Red
    exit 0
}

# Get current branch
$currentBranch = git branch --show-current
Write-Host "`nCurrent branch: $currentBranch" -ForegroundColor Cyan

# Stage all changes
Write-Host "`nStaging all changes..." -ForegroundColor Cyan
git add .

# Create backup branch
$backupBranch = "backup-all-improvements-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
Write-Host "`nCreating backup branch: $backupBranch" -ForegroundColor Green
git stash push -m "All improvements for multi-PR split"
git branch $backupBranch
git stash pop

Write-Host "Backup branch created" -ForegroundColor Green

# Function to create a PR branch
function New-PRBranch {
    param(
        [string]$BranchName,
        [string]$CommitMessage,
        [string[]]$Files,
        [int]$PRNumber
    )
    
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "PR #$PRNumber - Creating branch: $BranchName" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    # Go back to main
    Write-Host "  Switching to main..." -ForegroundColor Gray
    git checkout main 2>$null
    
    # Create new branch
    Write-Host "  Creating branch: $BranchName" -ForegroundColor Gray
    git checkout -b $BranchName 2>$null
    
    # Copy files from backup branch
    Write-Host "  Adding files:" -ForegroundColor Gray
    foreach ($file in $Files) {
        Write-Host "     - $file" -ForegroundColor DarkGray
        
        # Check if file exists in backup branch
        $fileExists = git ls-tree -r $backupBranch --name-only | Select-String -Pattern "^$file$" -Quiet
        
        if ($fileExists) {
            # File exists, checkout from backup
            git checkout $backupBranch -- $file 2>$null
        } else {
            # New file, checkout from current stash/staging
            if (Test-Path $file) {
                git add $file 2>$null
            } else {
                Write-Host "     Warning: File not found: $file" -ForegroundColor Yellow
            }
        }
    }
    
    # Check if there are changes to commit
    $hasChanges = git diff --cached --quiet; $LASTEXITCODE -ne 0
    
    if ($hasChanges) {
        # Commit
        Write-Host "  Committing..." -ForegroundColor Gray
        git commit -m $CommitMessage 2>$null
        
        # Push
        Write-Host "  Pushing to origin..." -ForegroundColor Gray
        git push -u origin $BranchName 2>$null
        
        Write-Host "  Branch created and pushed successfully!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  No changes to commit, skipping..." -ForegroundColor Yellow
        git checkout main 2>$null
        git branch -D $BranchName 2>$null
        return $false
    }
}

# Create all PR branches
$successCount = 0

# PR #1 - Fix duplicate socket initialization
# Note: This requires manual editing of index.js, so we'll skip auto-creation
Write-Host "`nPR #1, #2, #3 require manual editing of Backend/index.js" -ForegroundColor Yellow
Write-Host "   These will need to be created manually to isolate changes" -ForegroundColor Gray

# PR #4 - Environment validation
if (New-PRBranch -BranchName "feat/env-validation" `
                  -CommitMessage "feat: Add environment variable validation system" `
                  -Files @("Backend/config/env.validation.js") `
                  -PRNumber 4) {
    $successCount++
}

# PR #5 - Security middleware
if (New-PRBranch -BranchName "feat/security-middleware" `
                  -CommitMessage "feat: Add comprehensive security middleware suite" `
                  -Files @("Backend/middlewares/security.middleware.js") `
                  -PRNumber 5) {
    $successCount++
}

# PR #6 - Admin authorization
if (New-PRBranch -BranchName "feat/admin-authorization" `
                  -CommitMessage "feat: Implement admin authorization middleware and role check" `
                  -Files @(
                      "Backend/middlewares/admin.middleware.js",
                      "Backend/routes/questionDatabase.routes.js",
                      "Backend/controllers/QuestionDatabase.controller.js"
                  ) `
                  -PRNumber 6) {
    $successCount++
}

# PR #7 - Performance monitoring
if (New-PRBranch -BranchName "feat/performance-monitoring" `
                  -CommitMessage "feat: Add real-time performance monitoring system" `
                  -Files @("Backend/utils/performance.monitor.js") `
                  -PRNumber 7) {
    $successCount++
}

# PR #8 - Enhanced .env.example
if (New-PRBranch -BranchName "docs/enhance-env-example" `
                  -CommitMessage "docs: Enhance .env.example with comprehensive documentation" `
                  -Files @("Backend/.env.example") `
                  -PRNumber 8) {
    $successCount++
}

# PR #9 - Comprehensive documentation
if (New-PRBranch -BranchName "docs/comprehensive-guides" `
                  -CommitMessage "docs: Add comprehensive API, deployment, and development documentation" `
                  -Files @(
                      "Backend/docs/API.md",
                      "Backend/docs/DEPLOYMENT.md",
                      "Backend/docs/FEATURE_DEVELOPMENT.md",
                      "CHANGELOG.md",
                      "README.md"
                  ) `
                  -PRNumber 9) {
    $successCount++
}

# Return to main branch
Write-Host "`nReturning to main branch..." -ForegroundColor Cyan
git checkout main 2>$null

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Green
Write-Host "Branch Creation Complete!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Green

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Successfully created: $successCount branches" -ForegroundColor Green
Write-Host "  Manual creation needed: 3 branches (index.js changes)" -ForegroundColor Yellow
Write-Host "  Backup branch: $backupBranch" -ForegroundColor Gray

Write-Host "`nCreated Branches:" -ForegroundColor Cyan
git branch -r | Select-String "feat/|docs/" | ForEach-Object {
    Write-Host "  - $($_.ToString().Trim())" -ForegroundColor Gray
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Go to GitHub and create PRs from each pushed branch" -ForegroundColor Gray
Write-Host "  2. Manually create PR #1, #2, #3 for Backend/index.js changes:" -ForegroundColor Gray
Write-Host "     - fix/duplicate-socket-init" -ForegroundColor DarkGray
Write-Host "     - feat/graceful-shutdown" -ForegroundColor DarkGray
Write-Host "     - feat/enhanced-health-check" -ForegroundColor DarkGray

Write-Host "`nTip: Use the backup branch ($backupBranch) if you need to reference all changes" -ForegroundColor Yellow

Write-Host "`nHappy contributing!" -ForegroundColor Green
