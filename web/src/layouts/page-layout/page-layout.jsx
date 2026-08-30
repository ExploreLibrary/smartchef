import { Navbar } from "../../components/ui";


function PageLayout({ children }) {
  return (
    <div className="container">
        <Navbar />
        {children}
    </div>
  );
}

export default PageLayout;