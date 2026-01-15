# InfiniteScroll

## Overview

This project demonstrates an implementation of infinite scrolling in React using the IntersectionObserver API. Infinite scrolling allows users to load more content dynamically as they scroll down the page, improving user experience by avoiding pagination.

## Features

- Efficient detection of scroll position using IntersectionObserver.
- Dynamic loading of additional items.
- Simple and customizable React components.
- Comprehensive unit tests with Vitest.
- Error handling and loading states.
- Race condition prevention using AbortController.

## Technologies Used

### Core Technologies
- **React 19.2.0** - Modern React library for building user interfaces
- **Vite 7.2.4** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features

### Development Tools
- **ESLint 9.39.1** - Code linting and quality assurance
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Testing utilities for React components
- **jsdom** - DOM implementation for Node.js testing environment

### APIs & Browser Features
- **IntersectionObserver API** - Native browser API for detecting element visibility
- **Fetch API** - Modern API for making HTTP requests
- **AbortController** - API for canceling fetch requests

### Build & Configuration
- **@vitejs/plugin-react** - Vite plugin for React support
- **babel-plugin-react-compiler** - React compiler plugin for optimization

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/gmaxsoft/InfiniteScroll.git
   ```
2. Navigate to the project directory:
   ```
   cd InfiniteScroll
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

### Development

Start the development server:
```
npm run dev
```

### Building

Build the project for production:
```
npm run build
```

Preview the production build:
```
npm run preview
```

### Testing

Run unit tests:
```
npm test
```

Run tests in watch mode:
```
npm test
```

Run tests with UI:
```
npm test -- --ui
```

Run tests with coverage:
```
npm test -- --coverage
```

### Linting

Check code quality:
```
npm run lint
```

## Testing

The project includes comprehensive unit tests covering:

- **Hook Tests** (`useInfiniteScroll.test.js`):
  - Initial state verification
  - API data loading
  - Error handling (network errors, invalid responses)
  - Pagination logic (hasMore state)
  - Request cancellation with AbortController

- **Component Tests** (`PostList.test.jsx`):
  - Component rendering
  - Loading states display
  - Error messages display
  - Post list rendering
  - End of list indicators

- **App Component Tests** (`App.test.jsx`):
  - Main container rendering
  - Footer display
  - Component integration

All tests are written using Vitest and React Testing Library, ensuring reliable and maintainable test coverage.

## Project Structure

```
InfiniteScroll/
├── src/
│   ├── components/
│   │   ├── PostList.jsx
│   │   └── PostList.test.jsx
│   ├── hooks/
│   │   ├── useInfiniteScroll.js
│   │   └── useInfiniteScroll.test.js
│   ├── test/
│   │   └── setup.js
│   ├── App.jsx
│   ├── App.test.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## Dependencies

### Production Dependencies
- `react` ^19.2.0
- `react-dom` ^19.2.0

### Development Dependencies
- `@eslint/js` ^9.39.1
- `@types/react` ^19.2.5
- `@types/react-dom` ^19.2.3
- `@vitejs/plugin-react` ^5.1.1
- `babel-plugin-react-compiler` ^1.0.0
- `eslint` ^9.39.1
- `eslint-plugin-react-hooks` ^7.0.1
- `eslint-plugin-react-refresh` ^0.4.24
- `globals` ^16.5.0
- `vite` ^7.2.4
- `vitest` - Unit testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for testing

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.