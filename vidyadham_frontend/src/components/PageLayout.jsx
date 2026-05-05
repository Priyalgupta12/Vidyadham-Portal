import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import './PageLayout.css';

function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}

export default PageLayout;
