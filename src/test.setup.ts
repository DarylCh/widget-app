import "@testing-library/jest-dom";

// mock resize observer for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
