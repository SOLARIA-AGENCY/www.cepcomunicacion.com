#!/bin/bash

# MCP Secrets Loader - Loads GitHub PAT from macOS Keychain
# Auto-generated: 2025-10-30

set -e

# Load GitHub PAT from Keychain
GITHUB_PAT=$(security find-generic-password -s "mcp-github-pat" -w 2>/dev/null)

if [ -n "$GITHUB_PAT" ]; then
    export GITHUB_PAT
    echo "✅ Loaded GITHUB_PAT from Keychain"
else
    echo "⚠️  Warning: GITHUB_PAT not found in Keychain"
    echo "   Run: security add-generic-password -a \"\${USER}\" -s \"mcp-github-pat\" -w \"YOUR_TOKEN\" -U"
    return 1 2>/dev/null || exit 1
fi
