import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';

describe('Accessibility & WCAG 2.1 AA Standards', () => {
  it('renders a skip-to-content link for keyboard users', () => {
    render(<App />);
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('renders a semantic <main> landmark region with tabIndex', () => {
    render(<App />);
    const mainRegion = screen.getByRole('main');
    expect(mainRegion).toBeInTheDocument();
    expect(mainRegion.getAttribute('id')).toBe('main-content');
  });

  it('renders accessible progress bars with ARIA values', () => {
    render(
      <ProgressBar
        value={65}
        max={100}
        label="Budget Spent"
        showPercent={true}
      />
    );

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar.getAttribute('aria-valuenow')).toBe('65');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar.getAttribute('aria-label')).toBe('Budget Spent');
  });

  it('renders accessible modal dialogs with proper ARIA attributes', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test Modal Title"
        description="Test modal description"
      >
        <div>Modal Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
    expect(dialog.getAttribute('aria-describedby')).toBe('modal-description');
  });
});
