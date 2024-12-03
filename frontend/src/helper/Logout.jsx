import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();  // Initialize useNavigate to programmatically navigate

  

  return (
    <button onClick={handleLogout} className="text-blue-600 hover:underline">
      Logout
    </button>
  );
};

export default Logout;
