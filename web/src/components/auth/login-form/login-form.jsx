import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api-service";
import { useAuth } from "../../../contexts/auth-context";

// LoginForm recibe onSubmit desde LoginPage.
// react-hook-form gestiona el estado de los campos y la validación de forma declarativa.
// No necesitamos useState por cada campo — register conecta el input al formulario.
function LoginForm() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "all" });

  // handleSubmit valida todos los campos antes de llamar a onSubmit.
  // Si onSubmit lanza un error del servidor, usamos setError para mostrarlo
  // en el campo correspondiente sin desmontar el formulario.
  const handleFormSubmit = async (data) => {
    try {
      const response = await login(data);
      const loggedUser = response?.user ?? response;
      setAuthUser(loggedUser);
      navigate("/");
    } catch (error) {

      console.error("Error submitting login form:", error);
      
      const serverErrors = error.response?.data?.errors;

      if (serverErrors) {
        Object.entries(serverErrors).forEach(([field, message]) => {
          setError(field, { message });
        });
      } else {
        setError("root", {
          message: error.response?.data?.message || "Error al iniciar sesión",
        });
      }
    }
  };

  return (
    <div className="login-form__container">
    <form onSubmit={handleSubmit(handleFormSubmit)} className="login-form">
      <div className="login-form__header">
        <h4 className="login-form__title">Login</h4>
      </div>

      <div className="login-form__body">

        <div className="login-form__field">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            // register conecta este input al formulario: gestiona value, onChange y onBlur
            {...register("email", { required: "El email es obligatorio" })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="login-form__email-error">{errors.email.message}</p>
          )}
        </div>

        <div className="login-form__field">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="login-form__password-error">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="login-form__footer">
        <button
          className="login-form__submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </div>
    </form>
    {errors.root && (
    <p className="login-form__global-error">
         {errors.root.message}
    </p>
    )}
    </div>
  );
}

export default LoginForm;
