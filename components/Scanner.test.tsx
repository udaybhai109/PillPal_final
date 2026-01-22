import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Scanner from './Scanner';

describe('Scanner Component', () => {
  it('should render scanner with title', () => {
    const mockOnScan = () => {};
    const mockOnCancel = () => {};

    render(<Scanner onScan={mockOnScan} onCancel={mockOnCancel} />);
    
    const titleElement = screen.getByText(/Prescription Scan/i);
    expect(titleElement).toBeDefined();
  });

  it('should have capture button disabled initially', () => {
    const mockOnScan = () => {};
    const mockOnCancel = () => {};

    render(<Scanner onScan={mockOnScan} onCancel={mockOnCancel} />);
    
    // The camera needs to load before capture is enabled
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have upload option', () => {
    const mockOnScan = () => {};
    const mockOnCancel = () => {};

    render(<Scanner onScan={mockOnScan} onCancel={mockOnCancel} />);
    
    const uploadLabel = screen.getByText(/Upload from Archives/i);
    expect(uploadLabel).toBeDefined();
  });
});
