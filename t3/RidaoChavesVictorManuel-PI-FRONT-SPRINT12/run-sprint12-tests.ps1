$ErrorActionPreference = "Stop"

Write-Host "== Sprint 12: Backend (unitarias/integracion) =="
Push-Location "backend"
try {
    npm.cmd run test:ci
}
finally {
    Pop-Location
}

Write-Host "== Sprint 12: Frontend (E2E sistema) =="
Push-Location "frontend"
try {
    npm.cmd run test:e2e:install
    npm.cmd run test:e2e
}
finally {
    Pop-Location
}

Write-Host "Reportes generados:"
Write-Host " - backend/reports/backend/junit.xml"
Write-Host " - backend/reports/backend/results.json"
Write-Host " - backend/coverage/lcov-report/index.html"
Write-Host " - frontend/reports/e2e/html/index.html"
Write-Host " - frontend/reports/e2e/junit.xml"
Write-Host " - frontend/reports/e2e/results.json"
