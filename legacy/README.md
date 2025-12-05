# Legacy Archive

**Created**: 2025-11-23
**Purpose**: Archive temporary files, scripts, and debugging artifacts from development phases

## Directory Structure

### `/backups`
HTML backup files created during frontend development iterations

### `/docs`
Temporary markdown documentation:
- Session summaries
- Weekly reports
- Strategy documents
- Setup guides
- Credentials documentation

### `/env-files`
Environment configuration backups and test files

### `/frontend-html-prototypes`
Static HTML/CSS/JS prototypes used for design exploration

### `/scripts`
Temporary automation scripts:
- **Python**: Frontend fixes, color corrections, hero image updates
- **Shell**: Deployment scripts, setup automation
- **TypeScript**: Database seeding, user creation, testing utilities

## Why These Files Were Archived

1. **Temporary Nature**: Created for specific debugging/deployment tasks
2. **No Production Value**: Not part of core application functionality
3. **Historical Reference**: Preserved for learning and incident analysis
4. **Code Cleanup**: Removed from main codebase to reduce clutter

## Related Incidents

See `.memory/learning_log.jsonl` for:
- Next.js dev server module caching issue (2025-11-23)
- Pattern analysis and prevention strategies

## Restoration

If any script is needed:
```bash
# Example: Restore a specific script
cp legacy/scripts/[script-name] ./
```

**Note**: Most scripts are single-use and may require updates to work with current codebase structure.
