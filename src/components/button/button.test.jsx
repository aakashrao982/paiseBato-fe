import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '.';
import { ButtonType, ButtonSize } from './button.types';

test('render Button when button type is not link ', () => {
  render(<Button testPrefixId="button" text="Button CTA" onClick={() => {}} />);

  const buttonElement = screen.getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
});

test('renders an anchor tag when type is ButtonType.Link', () => {
  const { getByTestId } = render(
    <Button
      testPrefixId="anchorTag"
      variant={ButtonType.Link}
      link="/some-link"
    />
  );
  const anchorTagElement = getByTestId('anchorTag-anchorTag');

  expect(anchorTagElement).toBeInTheDocument();
});

test('invoke onClick handler when button is pressed', () => {
  const onClickMock = jest.fn();
  render(
    <Button testPrefixId="button" text="Click me" onClick={onClickMock} />
  );

  const buttonElement = screen.getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  fireEvent.click(buttonElement);
  expect(onClickMock).toHaveBeenCalled();
});

test('renders a button with the correct  sm size style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" size={ButtonSize.Small} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('small');
});

test('renders a button with the correct  md size style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" size={ButtonSize.Medium} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('medium');
});

test('renders a button with the correct  lg size style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" size={ButtonSize.Large} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('large');
});

test('renders a button with the correct  xl size style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" size={ButtonSize.ExtraLarge} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('extraLarge');
});
test('renders a button with the correct xxl size  style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" size={ButtonSize.DoubleExtraLarge} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('doubleExtraLarge');
});

test('renders a button with the correct button type Primary style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" variant={ButtonType.Primary} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('primary');
});

test('renders a button with the correct button type Secondary style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" variant={ButtonType.Secondary} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('secondary');
});

test('renders a button with the correct button type Tertiary style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="button" variant={ButtonType.Tertiary} />
  );
  const buttonElement = getByTestId('button-button');

  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveClass('tertiary');
});

test('renders a button with the correct button type link style', () => {
  const { getByTestId } = render(
    <Button testPrefixId="anchorTag" variant={ButtonType.Link} />
  );
  const anchorElement = getByTestId('anchorTag-anchorTag');

  expect(anchorElement).toBeInTheDocument();
  expect(anchorElement).toHaveClass('link');
});

test('prevents default when link button is clicked and disabled', () => {
  const onClickMock = jest.fn();
  const preventDefaultMock = jest.fn();

  const { getByTestId } = render(
    <Button
      testPrefixId="anchorTag"
      variant={ButtonType.Link}
      text="Click me"
      link="/some-link"
      disabled={true}
      onClick={onClickMock}
    />
  );
  const linkElement = getByTestId('anchorTag-anchorTag');

  // Add event listener and replace preventDefault with the mock
  linkElement.addEventListener('click', (event) => {
    event.preventDefault = preventDefaultMock;
  });

  // Simulate a click on the anchor tag
  fireEvent.click(linkElement);

  // Assert that preventDefault was called
  expect(preventDefaultMock).toHaveBeenCalled();

  // Assert that onClickMock was not called because the button is disabled
  expect(onClickMock).not.toHaveBeenCalled();
});
