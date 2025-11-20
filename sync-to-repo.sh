#!/bin/bash
# Auto sync script - Синхронизира промени от Spark към airis1.0 repo

set -e

echo "🔄 Starting sync to airis1.0..."

# Configure git if not already configured
git config --global user.email "radilov.k@gmail.com" 2>/dev/null || true
git config --global user.name "Radilov K" 2>/dev/null || true

# Check if there are changes
if [[ -z $(git status -s) ]]; then
  echo "✓ No changes to sync"
  exit 0
fi

# Stage all changes
echo "📦 Staging changes..."
git add -A

# Get commit message from last Spark iteration or use default
LAST_COMMIT=$(git log -1 --pretty=%B 2>/dev/null || echo "Spark update")
COMMIT_MSG="${LAST_COMMIT}"

# Commit changes
echo "💾 Committing: ${COMMIT_MSG}"
git commit -m "${COMMIT_MSG}" || echo "Nothing to commit"

# Ensure remote exists (use GITHUB_TOKEN env var if available)
if [[ -n "${GITHUB_TOKEN}" ]]; then
  git remote remove airis1.0 2>/dev/null || true
  git remote add airis1.0 "https://${GITHUB_TOKEN}@github.com/Radilovk/airis1.0.git"
else
  echo "⚠️  GITHUB_TOKEN not set, using existing remote configuration"
  git remote get-url airis1.0 >/dev/null 2>&1 || {
    echo "❌ No airis1.0 remote configured and no GITHUB_TOKEN provided"
    exit 1
  }
fi

echo "🚀 Pushing to airis1.0..."
git push airis1.0 main 2>&1 || {
  echo "⚠️  Push failed, trying force push..."
  git push airis1.0 main --force
}

echo "✅ Sync completed successfully!"
echo "📍 View changes at: https://github.com/Radilovk/airis1.0"
echo "📍 Deployment status: https://github.com/Radilovk/airis1.0/actions"
