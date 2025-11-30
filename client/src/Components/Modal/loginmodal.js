import React, { useContext, useState } from "react";
import { context } from "../../App";

const LoginModal = () => {
  const { state, dispatch } = useContext(context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot-password form state
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");

  // ---------- LOGIN ----------
  const sendLoginData = async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById("alertBox");

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 404 || !data) {
      alertBox.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
           <strong>Sorry!</strong> Invalid Credentials.
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>`;
      setTimeout(() => {
        alertBox.innerHTML = "";
      }, 3000);
    } else if (response.status === 422) {
      alertBox.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
           <strong>Nah!</strong> Fill all the credentials.
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>`;
      setTimeout(() => {
        alertBox.innerHTML = "";
      }, 3000);
    } else {
      dispatch({ type: "USER", payload: false });
      alertBox.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Bravo!</strong> You have been Signedin Successfully.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`;
      setTimeout(() => {
        alertBox.innerHTML = "";
      }, 3000);
      setEmail("");
      setPassword("");
    }
  };

  // ---------- FORGOT PASSWORD ----------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById("alertBox");

    const response = await fetch("/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: resetEmail,
        password: resetPassword,
        confirmpassword: resetConfirm,
      }),
    });

    const data = await response.json();

    if (response.status === 422 || response.status === 400) {
      alertBox.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
           <strong>Oops!</strong> ${data.error || "Please check your inputs."}
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>`;
    } else if (response.status === 404) {
      alertBox.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
           <strong>Sorry!</strong> ${data.error || "No account found with this email."}
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>`;
    } else if (response.status === 200) {
      alertBox.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
           <strong>Done!</strong> ${data.message || "Password updated successfully."}
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>`;
      setResetEmail("");
      setResetPassword("");
      setResetConfirm("");
    } else {
      alertBox.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
           <strong>Error!</strong> Something went wrong.
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>`;
    }

    setTimeout(() => {
      alertBox.innerHTML = "";
    }, 3000);
  };

  return (
    <>
      {/* LOGIN MODAL */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Login to Step-in
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form method="POST">
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Enter email"
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    id="exampleInputPassword1"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Password"
                  />
                </div>

                {/* Forgot Password link */}
                <div className="form-group text-right">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    data-toggle="modal"
                    data-target="#forgotModal"
                    data-dismiss="modal"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  onClick={sendLoginData}
                  data-dismiss="modal"
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <div
        className="modal fade"
        id="forgotModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="forgotModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="forgotModalLabel">
                Reset Password
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form method="POST">
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="resetEmail">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter the email you registered with"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="resetPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="resetPassword"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="resetConfirm">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="resetConfirm"
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleResetPassword}
                  data-dismiss="modal"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;