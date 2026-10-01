import type { CSSProperties } from "react";

export const authStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "2rem 1rem",
    background:
      "radial-gradient(circle at 8% 0%, rgba(87, 170, 102, .28), transparent 35%), #f4f7f2",
  } satisfies CSSProperties,
  card: {
    width: "min(100%, 480px)",
    background: "#ffffff",
    border: "1px solid #dce8dc",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 18px 50px rgba(24, 76, 39, .12)",
  } satisfies CSSProperties,
  brand: {
    color: "#0b3b22",
    fontSize: "1.55rem",
    fontWeight: 800,
    letterSpacing: ".04em",
  } satisfies CSSProperties,
  muted: { color: "#5b6f60", lineHeight: 1.55 } satisfies CSSProperties,
  label: {
    display: "grid",
    gap: ".4rem",
    color: "#274b31",
    fontWeight: 700,
    fontSize: ".9rem",
  } satisfies CSSProperties,
  input: {
    width: "100%",
    border: "1px solid #c5d7c6",
    borderRadius: "10px",
    padding: ".75rem .85rem",
    color: "#173322",
    background: "#fbfdfb",
  } satisfies CSSProperties,
  primaryButton: {
    width: "100%",
    border: 0,
    borderRadius: "10px",
    padding: ".8rem 1rem",
    color: "#ffffff",
    background: "#17623a",
    fontWeight: 800,
    cursor: "pointer",
  } satisfies CSSProperties,
  secondaryButton: {
    border: 0,
    padding: 0,
    color: "#17623a",
    background: "transparent",
    fontWeight: 700,
    cursor: "pointer",
  } satisfies CSSProperties,
  error: {
    borderRadius: "10px",
    padding: ".75rem",
    color: "#8c2f2f",
    background: "#fff1f1",
    border: "1px solid #f2c6c6",
  } satisfies CSSProperties,
  notice: {
    borderRadius: "10px",
    padding: ".75rem",
    color: "#315b38",
    background: "#eef8ef",
    border: "1px solid #c8e4cb",
  } satisfies CSSProperties,
} as const;

export function AuthBrand(): JSX.Element {
  return <div style={authStyles.brand}>MILENIUM</div>;
}
