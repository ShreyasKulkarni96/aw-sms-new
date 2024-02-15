import { useNavigate } from 'react-router-dom';

const Error = () => {
  const history = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">404 Error - Page Not Found 😭</h2>
          </div>
          <div className="text-center">
            <button 
              onClick={() => history('/')} 
              type="button" 
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Redirect to Login Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
