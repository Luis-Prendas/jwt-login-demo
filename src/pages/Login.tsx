import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;

    const success = await login(username, password);
    if (success) navigate('/dashboard');
  };


  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <section>
        <h1 className="text-5xl font-bold">Login Page</h1>
      </section>

      <section className="text-lg font-bold">
        <ul className="flex flex-col items-center">
          <li>
            <a href="/" className="text-blue-300 hover:underline">Go to Home</a>
          </li>
          <li>
            <a href="/dashboard" className="text-blue-300 hover:underline">Go to Dashboard</a>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 p-4 border border-[#f0f0f0]/20 rounded-lg">
          <input required type="text" name="username" placeholder="Username" className="border border-[#f0f0f0]/20 p-2 rounded-lg" />
          <input required type="password" name="password" placeholder="Password" className="border border-[#f0f0f0]/20 p-2 rounded-lg" />
          <button
            type="submit"
            className={`bg-[#f0f0f0] text-[#333] rounded-lg px-4 py-2 w-full cursor-pointer mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <div className="flex justify-center items-center p-4 border border-red-800 bg-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">⚠️{error}⚠️</p>
          </div>
        )}
      </section>
    </div>
  );
}