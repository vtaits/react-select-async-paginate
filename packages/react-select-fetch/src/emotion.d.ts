/* eslint-disable */
/**
 * Fix
 * error TS2307: Cannot find module '@emotion/serialize' or its corresponding type declarations.
 * 
 * TO DO: remove this file after upgade @emotion/core in storybook
 */
declare module '@emotion/serialize' {
  export type ArrayInterpolation<foo> = any;
  export type CSSObject<foo = any> = any;
  export type CSSInterpolation = any;
  export type FunctionInterpolation = any;
  export type Interpolation<foo> = any;
  export type SerializedStyles = any;
  export type Keyframes = any;
  export type ComponentSelector = any;
}
