export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <section>
        <h1 className="text-5xl font-bold">Home Page</h1>
      </section>

      <section className="text-lg font-bold">
        <ul className="flex flex-col items-center">
          <li>
            <a href="/login" className="text-blue-300 hover:underline">Go to Login</a>
          </li>
          <li>
            <a href="/dashboard" className="text-blue-300 hover:underline">Go to Dashboard</a>
          </li>
        </ul>
      </section>
    </div>
  );
}