import { useNavigate } from "react-router";
import { IoAlertCircleOutline } from "react-icons/io5";
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
        <h1 className="text-5xl font-bold">Iniciar sesión</h1>
      </section>

      <section className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-4 border border-white/10 bg-[#303030] rounded-lg">
          <input required type="text" name="username" placeholder="Nombre de usuario" className="border-b shadow-lg bg-[#2b2b2b] border-white/10 p-2 rounded-lg" />
          <input required type="password" name="password" placeholder="Contraseña" className="border-b shadow-lg bg-[#2b2b2b] border-white/10 p-2 rounded-lg" />
          <div className="flex gap-2 w-full">
            <button
              type="submit"
              className={`main_btn w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            {/* <InfoButton /> */}
          </div>
        </form>

        {error && (
          <div className="rounded-lg relative bg-[#303030] shadow-lg max-w-[230px] p-4 gap-2 flex items-center justify-center border border-white/10">
            <IoAlertCircleOutline className="text-8xl text-yellow-700/20 absolute" />
            <p className="text-yellow-500 font-semibold text-balance text-center">
              Las credenciales son incorrectas o el usuario no existe.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}