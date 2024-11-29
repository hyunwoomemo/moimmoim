import React from 'react';
import {Text as BasicText} from 'react-native';

const Text = ({children, bold, size, color, style}) => {
  return (
    <BasicText
      style={{
        fontWeight: bold ? 'bold' : undefined,
        fontSize: size,
        color: color,
        ...style,
      }}>
      {children}
    </BasicText>
  );
};

export default Text;
