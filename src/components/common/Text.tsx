import React, {StyleHTMLAttributes} from 'react';
import {Text as BasicText} from 'react-native';

interface ITextProps {
  children: React.ReactNode;
  bold?: string;
  size?: number;
  color?: string;
  style?: StyleHTMLAttributes<{}>;
}

const Text = ({
  children,
  bold = undefined,
  size,
  color = 'black',
  style = {},
}: ITextProps) => {
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
