// TODO: write documentation for colors and palette in own markdown file and add links from here

// const palette = {
//   neutral100: "#FFFFFF",
//   neutral200: "#F4F2F1",
//   neutral300: "#D7CEC9",
//   neutral400: "#B6ACA6",
//   neutral500: "#978F8A",
//   neutral600: "#564E4A",
//   neutral700: "#3C3836",
//   neutral800: "#191015",
//   neutral900: "#000000",
//
//   primary100: "#F4E0D9",
//   primary200: "#E8C1B4",
//   primary300: "#DDA28E",
//   primary400: "#D28468",
//   primary500: "#C76542",
//   primary600: "#A54F31",
//
//   secondary100: "#DCDDE9",
//   secondary200: "#BCC0D6",
//   secondary300: "#9196B9",
//   secondary400: "#626894",
//   secondary500: "#41476E",
//
//   accent100: "#FFEED4",
//   accent200: "#FFE1B2",
//   accent300: "#FDD495",
//   accent400: "#FBC878",
//   accent500: "#FFBB50",
//
//   angry100: "#F2D6CD",
//   angry500: "#C03403",
//
//   overlay20: "rgba(25, 16, 21, 0.2)",
//   overlay50: "rgba(25, 16, 21, 0.5)",
// } as const

const palette = {
  // Neutral colors
  neutral100: "#FFFFFF",
  neutral200: "#F4F6FA",
  neutral300: "#E0E5F0",
  neutral400: "#B8C4D9",
  neutral500: "#8D9CBF",
  neutral600: "#6985C0",
  neutral700: "#4A638F",
  neutral800: "#2C3E5E",
  neutral900: "#1A2437",

  // Primary colors (based on your text gradient)
  primary100: "#EEF3FF",
  primary200: "#D4DFFF", // Your accent color
  primary300: "#B3C7FF",
  primary400: "#80B3FF", // End of your gradient
  primary500: "#6985C0", // Start of your gradient
  primary600: "#4E6696",

  // Secondary colors (complementary to primary)
  secondary100: "#FFF0E6",
  secondary200: "#FFD9B8",
  secondary300: "#FFC28A",
  secondary400: "#FFAB5C",
  secondary500: "#FF942E",

  // Accent color
  accent100: "#F0F4FF",
  accent200: "#D4DFFF", // Your accent color
  accent300: "#B3C7FF",
  accent400: "#80B3FF",
  accent500: "#6985C0",

  // Alert colors
  success100: "#E6F9F1",
  success500: "#00C853",
  warning100: "#FFF8E1",
  warning500: "#FFA000",
  error100: "#FDECEA",
  error500: "#B00020",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  // Overlay colors
  overlay20: "rgba(26, 36, 55, 0.2)",
  overlay50: "rgba(26, 36, 55, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
