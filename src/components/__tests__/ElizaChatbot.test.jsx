import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ElizaChatbot from '../ElizaChatbot.jsx';

const respondMock = vi.fn();
const elizaInstance = {
  greeting: () => 'Greetings from ELIZA',
  respond: respondMock,
};

vi.mock('../../utils/elizaEngine', () => ({
  createEliza: () => elizaInstance,
}));

describe('ElizaChatbot', () => {
  let timeoutSpy;

  beforeEach(() => {
    timeoutSpy = vi
      .spyOn(globalThis, 'setTimeout')
      .mockImplementation((callback) => {
        if (typeof callback === 'function') {
          callback();
        }
        return 0;
      });
    respondMock.mockReturnValue('Mocked reflection');
    respondMock.mockClear();
  });

  afterEach(() => {
    timeoutSpy.mockRestore();
  });

  it('shows the canonical greeting on first render', () => {
    render(<ElizaChatbot />);
    expect(screen.getByText('Greetings from ELIZA')).toBeInTheDocument();
  });

  it('sends user input and renders ELIZA response', async () => {
    render(<ElizaChatbot />);

    const input = screen.getByPlaceholderText('Share a thought or feeling to continue');
    fireEvent.change(input, { target: { value: 'Hello there' } });
    const sendButtons = screen.getAllByRole('button', { name: /send/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    expect(screen.getByText('Hello there')).toBeInTheDocument();

    expect(respondMock).toHaveBeenCalledWith('Hello there');
    expect(screen.getByText('Mocked reflection')).toBeInTheDocument();
  });

  it('handles quit commands without calling ELIZA respond', () => {
    render(<ElizaChatbot />);

    const input = screen.getByPlaceholderText('Share a thought or feeling to continue');
    fireEvent.change(input, { target: { value: 'quit' } });
    const sendButtons = screen.getAllByRole('button', { name: /send/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    expect(respondMock).not.toHaveBeenCalled();
    expect(screen.getByText('Goodbye. It was nice talking to you.')).toBeInTheDocument();
  });
});
