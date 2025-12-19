import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/health'),
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          SaaS Analytics Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to your analytics dashboard
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Backend Status
          </h2>
          {isLoading && (
            <p className="text-gray-600">Checking backend connection...</p>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Backend connection failed. Make sure the backend server is running.
              </p>
            </div>
          )}
          {data && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ Backend is connected and running
              </p>
              <pre className="mt-4 text-left bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              React + TypeScript
            </h3>
            <p className="text-gray-600">
              Modern frontend with type safety
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nest.js Backend
            </h3>
            <p className="text-gray-600">
              Scalable API with TypeScript
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              PostgreSQL
            </h3>
            <p className="text-gray-600">
              Robust database solution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
