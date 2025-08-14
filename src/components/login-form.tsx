import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "./mode-toggle"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.loginUsername.value;
    const password = form.loginPassword.value;

    const success = await login(username, password);
    if (success) navigate('/dashboard');

    toast("Error al iniciar sesión", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Cerrar",
        onClick: () => { }
      },
    })
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Bienvenido</h1>
                  <p className="text-muted-foreground text-balance">
                    Inicie sesión en su cuenta Luis.Dev
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="loginUsername">Nombre de usuario</Label>
                  <Input
                    name="loginUsername"
                    id="loginUsername"
                    type="text"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="loginPassword">Contraseña</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input id="loginPassword" name="loginPassword" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
                <div className="text-center text-sm">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Regístrate
                  </Link>
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <div className="absolute top-4 right-4 z-10">
                <ModeToggle />
              </div>
              <img
                src="/background-login-page.jpg"
                alt="background-login-page"
                className="absolute inset-0 h-full w-full object-cover brightness-[0.6]"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Al hacer clic en «Continuar», aceptas nuestros <a href="#">Términos de servicio</a>{" "}
          y nuestra <a href="#"> Política de privacidad</a>.
        </div>
      </div>
    </main>
  )
}
