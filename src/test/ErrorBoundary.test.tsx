import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const BombComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Simulated catastrophic UI error');
  }
  return <div>Healthy Component Content</div>;
};

describe('ErrorBoundary Enterprise Fallback', () => {
  it('renders children normally when no exception is thrown', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Healthy Component Content')).toBeInTheDocument();
  });

  it('renders accessible error UI with role="alert" when an exception is thrown', () => {
    // Suppress console.error in Vitest output for intentional error testing
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something unexpected occurred')).toBeInTheDocument();
    expect(screen.getByText(/Simulated catastrophic UI error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Application Safely/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
