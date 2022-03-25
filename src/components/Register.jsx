import { AuthForm } from "./AuthForm";

export const Register = () => {
  return (
    <AuthForm
      title="Регистрация"
      buttonLabel="Зарегистрироваться"
      onSubmit={() => {}}
      hint={<p className="authform__hint">Уже зарегистрированы? Войти</p>}
    />
  );
};
