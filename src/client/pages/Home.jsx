import {Helmet} from "react-helmet";

function Home() {
  return (
      <div className="hero min-h-screen">
          <div className="hero-content text-center">
              <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Welcome!</h1>
                  <p className="py-6">Skingredients is a platform that helps you learn about products and their ingredients more generally.</p>
                  <button className="btn btn-primary">Get Started</button>
              </div>
          </div>
      </div>
  );
}

export default Home;