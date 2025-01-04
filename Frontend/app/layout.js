
export const metadata = {
    title: 'Automated - SCADA',
    description: 'Projeto Desenvolvido para o Projeto Integrador do SENAI SANTOS',
  }

export default function RootLayout({ children }) {
    return (
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="%REACT_APP_URL%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#17c1e8" />
    <link rel="apple-touch-icon" sizes="76x76" href="%REACT_APP_URL%/apple-icon.png" />
    <link rel="manifest" href="%REACT_APP_URL%/manifest.json" />
    <title>Automated - SCADA</title>

  </head>

    <body>
        <div id="root">{children}</div>
    </body>


</html>

    )
  }