export default function SuccessPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <h1 style={{ color: "#e0b422" }}>Payment received</h1>
        <p>Thank you. Jean Limo will confirm your ride shortly.</p>
        <p>
          <a href="/" style={{ color: "#e0b422" }}>
            Back to booking
          </a>
        </p>
      </div>
    </main>
  );
}
