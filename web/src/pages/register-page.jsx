import { PageLayout } from "../layouts";
import { RegisterForm } from "../components/auth";


function RegisterPage() {
    return (
        <PageLayout>
            <h1 className="welcome">Register Page</h1>
            <RegisterForm />
        </PageLayout>
    );
}

export default RegisterPage;