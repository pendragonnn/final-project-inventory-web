import SignIn from "./auth/signin/page";
export const metadata = {
  title: "TailAdmin | Next.js E-commerce Dashboard Template",
  description: "This is Home Blog page for TailAdmin Next.js",
  // other metadata
};
export default function Home() {
  return (
    <>
      <SignIn />
    </>
  );
}
