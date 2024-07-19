import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#faf3ef] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#faf3ef] @[480px]:rounded-xl min-h-80"
              style={{
                backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/b72f9abd-5a1e-4f9e-b281-bb88e55e4d29.png")',
              }}
            >
              <div className="flex p-4">
                <p className="text-white tracking-light text-[28px] font-bold leading-tight">Auto Vision V2</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex justify-center space-x-4 mt-4">
          <Link to="/" className="text-[#ae6032] hover:text-[#201109]">Home</Link>
          <Link to="/garage" className="text-[#ae6032] hover:text-[#201109]">Garage</Link>
          <Link to="/dtc-codes" className="text-[#ae6032] hover:text-[#201109]">DTC Codes</Link>
          <Link to="/add-vehicle" className="text-[#ae6032] hover:text-[#201109]">Add Vehicle</Link>
          <Link to="/login" className="text-[#ae6032] hover:text-[#201109]">Account</Link>
        </nav>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
            <Link
              to="/login"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#da560a] text-[#faf3ef] text-base font-bold leading-normal tracking-[0.015em] w-full"
            >
              <span className="truncate">Login</span>
            </Link>
            <Link
              to="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#f5e5db] text-[#201109] text-base font-bold leading-normal tracking-[0.015em] w-full"
            >
              <span className="truncate">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;