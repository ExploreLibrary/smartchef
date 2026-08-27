import { Navbar } from "../../components/ui";


function PageLayout({ children }) {
  return (
    <div className="container">
        <Navbar />
        <div className="main-content">
            {children}
        </div>
    </div>
  );
}

export default PageLayout;