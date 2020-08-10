// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock Service Worker for mocking the api calls of the app
// https://mswjs.io/docs/
import { server } from './test/server/test-server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we add during tests
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after tests finish
afterAll(() => server.close());
