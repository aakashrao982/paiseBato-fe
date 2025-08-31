export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Link = "link",
  Neutral = "neutral",
}

export enum ButtonSize {
  ExtraSmall = "extraSmall",
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extraLarge",
  DoubleExtraLarge = "doubleExtraLarge",
}

export interface ButtonProps {
  startIcon?: React.ReactNode;
  text?: string;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonType;
  link?: string;
  onClick: (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
  testPrefixId?: string;
  className?: string;
  textStyle?: string;
  stopThrottle?: boolean;
  isMobile?: boolean;
  isLink?: boolean;
}
