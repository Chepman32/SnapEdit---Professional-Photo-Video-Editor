/**
 * Button Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const {getByText} = render(<Button label="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(<Button label="Press Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <Button label="Disabled Button" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Disabled Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should render with primary variant', () => {
    const {getByText} = render(
      <Button label="Primary" onPress={() => {}} variant="primary" />
    );
    expect(getByText('Primary')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const {getByText} = render(
      <Button label="Secondary" onPress={() => {}} variant="secondary" />
    );
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render loading state', () => {
    const {queryByText, UNSAFE_getByType} = render(
      <Button label="Loading" onPress={() => {}} loading />
    );

    expect(queryByText('Loading')).toBeNull();
    expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
  });

  it('should render with icon', () => {
    const {UNSAFE_getByType} = render(
      <Button label="With Icon" onPress={() => {}} icon="add" />
    );

    expect(UNSAFE_getByType('Icon')).toBeTruthy();
  });
});
