import "./Home.css";
function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to ResolveX</h1>
        <p>
          A simple platform to report problems and find solutions.
        </p>

        <button>Get Started</button>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>How ResolveX Helps</h2>

        <div className="feature-list">
          <div className="feature-card">
            <h3>Report Problems</h3>
            <p>Submit an issue that needs to be resolved.</p>
          </div>

          <div className="feature-card">
            <h3>Track Issues</h3>
            <p>Keep track of the problems you have reported.</p>
          </div>

          <div className="feature-card">
            <h3>Find Solutions</h3>
            <p>Get solutions and updates for reported issues.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 ResolveX. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default Home;