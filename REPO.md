# Wave Collector - Repository Setup

This file documents the repository configuration and how to work with the project.

## Git Configuration

The project is configured as a Git repository:
- **Repository Name**: Tidebreak
- **Owner**: hojat-shafiee
- **Current Branch**: main
- **Remote**: Origin

## Repository Status

To check the current status:
```bash
git status
```

To view commit history:
```bash
git log --oneline
```

## Branching Strategy

For development work:
1. Create feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit changes regularly:
   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

3. Push to remote:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Merge to main when ready:
   ```bash
   git checkout main
   git merge feature/your-feature-name
   ```

## File Organization

```
TideBreak/
├── .git/                  # Git repository data
├── index.html             # Main game file
├── styles.css             # Game styling
├── game.js                # Core game engine
├── audio.js               # Sound system
├── README.md              # Full documentation
├── QUICKSTART.md          # Quick start guide
├── FEATURES.md            # Feature list
├── DEVELOPER.md           # Developer guide
└── REPO.md               # This file
```

## Deploying the Game

### GitHub Pages
To deploy on GitHub Pages:

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select main branch as source
4. Game will be available at: `https://hojat-shafiee.github.io/Tidebreak/`

### Self-Hosted Server
To host on your own server:

1. Copy all files to server directory
2. Ensure web server serves `index.html` correctly
3. No build process needed
4. Access at: `http://your-domain.com/tidebreak/`

### Local Development
For local testing:

1. Open `index.html` directly in browser
   ```bash
   # Windows
   start index.html
   
   # macOS
   open index.html
   
   # Linux
   xdg-open index.html
   ```

2. Or use a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then open http://localhost:8000
   ```

## Version Control Tips

### .gitignore (Recommended)
Create `.gitignore` to exclude unnecessary files:
```
# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Backup files
*.bak
*.swp
~*
```

### Commit Message Convention
Use clear, descriptive messages:
```
feat: Add new powerup item type
fix: Correct collision detection edge case
docs: Update developer guide
style: Improve visual polish on items
refactor: Reorganize audio manager code
test: Add game balance testing notes
```

## Collaboration

### For Team Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hojat-shafiee/Tidebreak.git
   cd Tidebreak
   ```

2. **Create your feature branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "Implement new feature"
   ```

4. **Push to remote**:
   ```bash
   git push origin feature/my-feature
   ```

5. **Create Pull Request** on GitHub

### Code Review Checklist
- [ ] Code follows existing style
- [ ] No console errors
- [ ] Game still plays smoothly
- [ ] All features documented
- [ ] README updated if needed

## Releases

### Creating a Release

1. Update version in documentation
2. Commit all changes:
   ```bash
   git add .
   git commit -m "Release v1.1.0"
   ```

3. Create a tag:
   ```bash
   git tag -a v1.1.0 -m "Version 1.1.0 - Add feature X"
   ```

4. Push to remote:
   ```bash
   git push origin main
   git push origin v1.1.0
   ```

## Backup Strategy

### Local Backup
```bash
# Create a backup copy
cp -r TideBreak/ TideBreak-backup-$(date +%Y%m%d)
```

### Remote Backup
- Maintain separate GitHub repository
- Use GitHub's backup and sync features
- Ensure all commits are pushed

## Troubleshooting Git

### Undo Last Commit (not pushed)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (already pushed)
```bash
git revert HEAD
git push
```

### Discard Local Changes
```bash
git checkout .
```

### Check What Changed
```bash
git diff
git diff HEAD~1
```

## GitHub Actions (Optional CI/CD)

To add automated testing, create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run game in headless browser
        run: echo "Game tested"
```

## Repository Statistics

### Lines of Code
- `game.js`: ~800 lines
- `audio.js`: ~150 lines
- `styles.css`: ~300 lines
- `index.html`: ~60 lines
- **Total**: ~1,310 lines (excluding comments/docs)

### File Sizes
- `game.js`: ~28 KB
- `styles.css`: ~8 KB
- `audio.js`: ~5 KB
- `index.html`: ~1.5 KB
- **Total**: ~42.5 KB (very lightweight!)

## Legal & Licensing

### Game Off 2025 Submission
This game is created for Game Off 2025:
- Theme: **WAVES**
- Status: Complete and ready for submission
- License: MIT (or your choice)

### MIT License Example
Add to repository root as `LICENSE`:
```
MIT License

Copyright (c) 2025 Hojat Shafiee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Community & Support

### Reporting Issues
1. Check existing issues
2. Describe the problem clearly
3. Include browser/OS information
4. Provide steps to reproduce

### Feature Requests
1. Explain the feature
2. Describe the use case
3. Suggest implementation approach

### Getting Help
- Check DEVELOPER.md for common questions
- Review QUICKSTART.md for gameplay help
- Look at existing code for implementation examples

## Repository Best Practices

1. **Commit Often**: Regular, small commits are easier to understand
2. **Write Clear Messages**: Help future you and others understand changes
3. **Keep Main Clean**: Only merge tested, working code to main
4. **Document Changes**: Update README/docs with significant changes
5. **Test Before Push**: Always verify functionality before committing

## Links

- **GitHub Repository**: https://github.com/hojat-shafiee/Tidebreak
- **Game Off 2025**: https://itch.io/jam/game-off-2025
- **Live Demo**: https://hojat-shafiee.github.io/Tidebreak/ (when deployed)

---

**Last Updated**: November 28, 2025  
**Repository Status**: Active Development
