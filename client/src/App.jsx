import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <main className="mt-8">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;