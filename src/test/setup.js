import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Rozszerz expect o matchers z jest-dom
expect.extend(matchers);

// Czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});
