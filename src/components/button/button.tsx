import React, { useEffect, useRef } from "react";
import styles from "./button.module.scss";

import { ButtonType, type ButtonProps, ButtonSize } from "./button.types";
import { classNames, throttle } from "@/utils";

const Button: React.FC<ButtonProps> = ({
  startIcon,
  text,
  endIcon,
  disabled,
  size = ButtonSize.Small,
  variant = ButtonType.Primary,
  link,
  onClick,
  testPrefixId,
  className = "",
  textStyle = "",
  stopThrottle = false,
  isMobile = false,
  isLink = false,
}) => {
  const throttleClickHandler = useRef<
    | null
    | ((
        event:
          | React.MouseEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLButtonElement>
      ) => void)
  >(null);

  useEffect(() => {
    throttleClickHandler.current = throttle((...args: unknown[]) => {
      const event = args[0] as
        | React.MouseEvent<HTMLAnchorElement>
        | React.MouseEvent<HTMLButtonElement>;
      if (typeof onClick === "function") {
        onClick(event);
      }
    }, 5000);
  }, [onClick]);

  const renderIconsAndText = () => {
    return (
      <>
        {!!startIcon && startIcon}

        {!!text && (
          <div className={classNames(styles.buttonText, textStyle)}>{text}</div>
        )}

        {!!endIcon && endIcon}
      </>
    );
  };

  const buttonClickHandler = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (stopThrottle) {
      if (typeof onClick === "function") {
        onClick(event);
      }
    } else {
      if (throttleClickHandler.current) {
        throttleClickHandler.current(event);
      }
    }

    event.stopPropagation();
  };

  return variant === ButtonType.Link && !isMobile ? (
    <a
      href={link}
      className={classNames(
        styles.buttonContainer,
        styles[size],
        styles[variant],
        disabled ?? false ? styles.linkDisableContainer : "",
        isLink ? styles.linkOnlyText : "",
        className
      )}
      data-testid={`${testPrefixId}-anchorTag`}
      onClick={buttonClickHandler}
    >
      {renderIconsAndText()}
    </a>
  ) : (
    <button
      type="button"
      className={classNames(
        styles.buttonContainer,
        styles[size],
        styles[variant],
        className
      )}
      disabled={disabled}
      data-testid={`${testPrefixId}-button`}
      onClick={buttonClickHandler}
    >
      {renderIconsAndText()}
    </button>
  );
};

export default Button;
