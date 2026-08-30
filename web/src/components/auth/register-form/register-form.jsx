import { useForm } from "react-hook-form";
import * as AuthService from "../../../services/api-service";
import { useNavigate } from "react-router-dom";


function RegisterForm() {
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({ mode: 'all' });
  const navigate = useNavigate();

  const handleUserRegister = async (user) => {
    try {
      await AuthService.signup(user);
      navigate('/login');
    } catch (error) {
      console.error(error);
      console.error(error.response?.data);
      if (error.response?.status === 400) {
        Object.keys(error.response.data.errors)
          .forEach((inputName) => {
            setError(inputName, { type: 'custom', message: error.response.data.errors[inputName] })
          })
      }
    }
  }

  return (
    <div className="register-form__container">
    <form onSubmit={handleSubmit(handleUserRegister)} className="register-form">

      <div className="register-form__header">
        <h4 className="register-form__title">Register</h4>
      </div>

      <div className="register-form__body">

        <div className="register-form__field">
          {/* NAME */}
          <div>
            <input type="text" {...register('name', { required: 'User name is required'})} className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Name" />
            {errors.name && (<p className="register-form__name-error">{errors.name.message}</p>)}
          </div>
        </div>

        <div className="register-form__field">
          {/* USERNAME */}
          <div>
            <input type="text" {...register('username', { required: 'User username is required' })} className={`form-control ${errors.username ? 'is-invalid' : ''}`} placeholder="username" />
            {errors.username && (<p className="register-form__username-error">{errors.username.message}</p>)}
          </div>
        </div>

        <div className="register-form__field">
          {/* EMAIL */}
          <div>
            <input type="email" {...register('email', { required: 'User email is required' })} className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="user@example.org" />
            {errors.email && (<p className="register-form__email-error">{errors.email.message}</p>)}
          </div>
        </div>

        <div className="register-form__field">
          {/* PASSWORD */}
          <div>
            <input type="password" {...register('password', { required: 'User password is required' })} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="***********" />
            {errors.password && (<p className="register-form__password-error">{errors.password.message}</p>)}
          </div>
        </div>

        <div className="register-form__footer">
          <div>
            <button className="register-form__submit-button" type="submit" disabled={!isValid}>Register</button>
          </div>
        </div>
      </div>

    </form>
    </div>
  )
}

export default RegisterForm;