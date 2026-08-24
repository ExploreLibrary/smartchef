import { useForm } from "react-hook-form";
import * as AuthService from "../../../services/api-service";
import { useNavigate } from "react-router";


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
    <form onSubmit={handleSubmit(handleUserRegister)}>

      {/* NAME */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-user fa-fw"></i></span>
        <input type="text" {...register('name', { required: 'User name is required'})} className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Name" />
        {errors.name && (<div className="invalid-feedback">{errors.name.message}</div>)}
      </div>

      {/* USERNAME */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-tag fa-fw"></i></span>
        <input type="text" {...register('username', { required: 'User username is required' })} className={`form-control ${errors.username ? 'is-invalid' : ''}`} placeholder="username" />
        {errors.username && (<div className="invalid-feedback">{errors.username.message}</div>)}

      </div>

      {/* EMAIL */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-envelope-o fa-fw"></i></span>
        <input type="email" {...register('email', { required: 'User email is required' })} className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="user@example.org" />
        {errors.email && (<div className="invalid-feedback">{errors.email.message}</div>)}
      </div>

      {/* PASSWORD */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="fa fa-lock fa-fw"></i></span>
        <input type="password" {...register('password', { required: 'User password is required' })} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="***********" />
        {errors.password && (<div className="invalid-feedback">{errors.password.message}</div>)}
      </div>

      <div className="d-grid gap-2">
        <button className="btn btn-primary" type="submit" disabled={!isValid}>Register</button>
        <hr className="m-0"/>
        <button className="btn btn-secondary">Login</button>
      </div>
    </form>
  )
}

export default RegisterForm;