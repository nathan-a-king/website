import { describe, it, expect, vi, beforeEach } from 'vitest';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));
const reportMock = vi.fn();

vi.mock('react-dom/client', () => ({
  default: { createRoot: createRootMock },
}));

vi.mock('../reportWebVitals', () => ({
  default: reportMock,
}));

vi.mock('../App.jsx', () => ({
  default: () => <div data-testid="app-root">App Component</div>,
}));

describe('index entrypoint', () => {
  beforeEach(() => {
    vi.resetModules();
    renderMock.mockClear();
    createRootMock.mockClear();
    reportMock.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('mounts the React app and wires up web vitals', async () => {
    await import('../index.jsx');

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(reportMock).toHaveBeenCalledTimes(1);
  });
});
