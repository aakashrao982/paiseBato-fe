import React from 'react';
import { render } from '@testing-library/react';
import Loader from '.';

test('renders Loader component', () => {
  const { getByText } = render(<Loader loaderText="I am happy" show={true} />);
  const loaderTextElement = getByText('I am happy');
  expect(loaderTextElement).toBeInTheDocument();
});

test('renders Loader with custom text', () => {
  const customText = 'Custom Loading Text';
  const { getByText } = render(<Loader loaderText={customText} show />);

  expect(getByText(customText)).toBeInTheDocument();
});

test('does not render Loader when show is false', () => {
  const { container } = render(<Loader show={false} />);

  expect(container.firstChild).toBeNull();
});
