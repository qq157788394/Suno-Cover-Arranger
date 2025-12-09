import React from 'react';
import { createRoot } from 'react-dom/client';
import SunoCover from './index';

describe('SunoCover Component - Simple Test', () => {
  it('should render without crashing', () => {
    // Simple test to check if the component can be rendered without errors
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<SunoCover />);
    root.unmount();
  });
});
