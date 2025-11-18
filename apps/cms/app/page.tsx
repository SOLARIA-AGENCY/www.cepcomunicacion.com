export default function HomePage() {
  return (
    <html>
      <body>
        <h1>CEP CMS - Funcionando!</h1>
        <p>Timestamp: {new Date().toISOString()}</p>
        <nav>
          <ul>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/payload/admin">Payload Admin</a>
            </li>
          </ul>
        </nav>
      </body>
    </html>
  );
}
