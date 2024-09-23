import { useNavigate } from "react-router-dom";
import './Home.css';



export default function Home() {
  const navigate = useNavigate();

  return (
    <>
    <h1>Welcome to Ezpay!!</h1>
      <div className="card-container">
        <div className="new-user card" onClick={() => navigate("/register")}>
          <h5>New User</h5>
          <h6>Create a new Account</h6>
        </div>

        <div className="existing-user card" onClick={() => navigate("/login")}>
          <h5>Existing User</h5>
          <h6>Proceed for Login</h6>
        </div>
      </div>
    </>
  );
}