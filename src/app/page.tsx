import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Next Fullstack Learning</h1>

      <nav>
        <Link href={"/dashboard"}>Dashboard</Link>
        <br />
        <Link href={"/profile"}>Profile</Link>
      </nav>
    </main>
  );
}
