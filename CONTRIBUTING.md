# Contributing to SoLearn

Thank you for considering contributing to SoLearn! This document outlines the process for contributing to the project and provides guidelines to ensure a smooth collaboration.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/solearn-tech/SoLearn/issues)
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/solearn-tech/SoLearn/issues/new)
- Include a title and clear description
- Provide as much relevant information as possible
- If possible, include code samples and steps to reproduce the issue

### Suggesting Enhancements

- Open a new issue describing your enhancement suggestion
- Include a clear title and detailed description
- Explain why this enhancement would be useful to most SoLearn users
- Provide examples of how it would work if possible

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request to the `main` branch

## Development Setup

Follow these steps to set up the SoLearn development environment:

1. Install dependencies:
   - Node.js (v18+)
   - Rust (latest stable)
   - Solana CLI tools
   - Anchor Framework

2. Clone the repository:
   ```bash
   git clone https://github.com/solearn-tech/SoLearn.git
   cd SoLearn
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests when relevant
- Consider using the conventional commit format:
  ```
  feat: add user authentication
  ^    ^
  |    |
  |    +-> Summary in present tense
  |
  +-------> Type: feat, fix, docs, style, refactor, test, or chore
  ```

### JavaScript Style Guide

- Follow ESLint configuration provided in the project
- Use ES6+ features when appropriate
- Use meaningful variable and function names
- Document functions with JSDoc comments

### Rust Style Guide

- Follow Rust API guidelines
- Use `rustfmt` for code formatting
- Document public functions with doc comments
- Use meaningful type and function names

### CSS Style Guide

- Follow the project's CSS naming conventions
- Use component-scoped styles where appropriate
- Keep styles modular and reusable

## Documentation

- Document all public APIs, components, and functions
- Update documentation when making changes to the codebase
- Ensure documentation is clear and concise

## Testing

- Write tests for all new features and bug fixes
- Maintain existing tests when changing code
- Ensure all tests pass before submitting a pull request

## Additional Notes

### Issue and Pull Request Labels

- `bug`: Bug reports
- `enhancement`: Feature requests
- `documentation`: Documentation improvements
- `good-first-issue`: Good for newcomers
- `help-wanted`: Extra attention is needed

Thank you for contributing to SoLearn! 