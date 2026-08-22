import { PageLayout } from "../layouts";
import { LoginForm } from "../components/auth";


function LoginPage() {
    return (
        <PageLayout>
            <h1 className="welcome">Welcome to SmartChef</h1>
            <LoginForm />
        </PageLayout>
    );
}

export default LoginPage;