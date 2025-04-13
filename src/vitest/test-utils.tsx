import type { FC, ReactNode } from "react";
import { render as rtlRender } from "@testing-library/react";

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      {/* Add any additional providers or context here */}
    </>
  );
};

const customRender = (ui: ReactNode, options = {}) => {
  return rtlRender(ui, { wrapper: Providers, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
