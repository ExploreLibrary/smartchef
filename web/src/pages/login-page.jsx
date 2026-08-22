import { PageLayout } from "../layouts";
import { LoginForm } from "../components/auth";


function LoginPage() {
    return (
        <PageLayout>
            <h1>Welcome to SmartChef</h1>
            <LoginForm />
        </PageLayout>
    );
}

export default LoginPage;