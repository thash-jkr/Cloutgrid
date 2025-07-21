import NavBar from "../../../common/navBar";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleSendOTP } from "../../../slices/authSlice";

const BasicInfo = ({ nextStep, formData, handleChange, type }) => {
  const dispatch = useDispatch();

  const handleContinue = async (e) => {
    e.preventDefault();

    if (
      !formData.user.name ||
      !formData.user.username ||
      !formData.user.email
    ) {
      toast.error("Please complete all the fields");
      return;
    }

    const data = new FormData();
    data.append("name", formData.user.name);
    data.append("username", formData.user.username);
    data.append("email", formData.user.email);

    const loadingToast = toast.loading("Submitting your information...");

    dispatch(handleSendOTP(data))
      .unwrap()
      .then(() => {
        toast.success("OTP sent to your email!", {
          id: loadingToast,
        });
        nextStep();
      })
      .catch((error) => {
        toast.error(`Failed to send OTP: ${error}`, {
          id: loadingToast,
        });
      });
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(155deg,rgba(255, 255, 255, 1) 0%,rgba(202, 240, 248, 1) 100%",
      }}
    >
      <div className="container h-dvh mx-auto flex justify-center items-center">
        <NavBar />
        <div className="animate__animated animate__flipInY auth-card">
          <Toaster />
          <h1 className="font-bold text-2xl mb-10">
            {type === "creator" ? "Creator" : "Business"} Registration
          </h1>

          <form className="reg-form w-full" onSubmit={handleContinue}>
            <div className="reg-form-container w-full">
              <div className="form-input w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.user.name}
                  onChange={handleChange}
                  placeholder="Name:"
                  required
                />
              </div>

              <div className="form-input w-full">
                <input
                  type="text"
                  name="username"
                  value={formData.user.username}
                  onChange={handleChange}
                  placeholder="Username:"
                  required
                />
              </div>

              <div className="form-input w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.user.email}
                  onChange={handleChange}
                  placeholder="Email:"
                  required
                />
              </div>
            </div>

            <button className="auth-button button-54" type="submit">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
