// Home.tsx — redirects to Dashboard (handled by App.tsx routing)
import { Redirect } from "wouter";
export default function Home() {
  return <Redirect to="/" />;
}
