import LegalPage from "../../src/components/LegalPage";

export const metadata = {
  title: "Política de Cookies | TUK TUK Cartagena",
  description: "Política de cookies de TUK TUK Cartagena. Información sobre el uso de cookies en el sitio web.",
  robots: { index: false },
};

export default function PoliticaCookies() {
  return (
    <LegalPage title="Política de Cookies">
      <p className="legal-intro">
        Este portal web únicamente utiliza cookies propias con finalidad técnica, no recaba ni cede
        datos de carácter personal de los usuarios sin su conocimiento.
      </p>

      <h2>¿Qué es una cookie?</h2>
      <p>
        Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web.
        Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre
        los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que
        contengan y de la forma en que se utilice su equipo, pueden utilizarse para reconocer al usuario.
        El navegador memoriza las cookies en el disco duro únicamente durante la sesión actual, ocupando
        un espacio de memoria mínimo y sin perjudicar al ordenador. Las cookies no contienen ninguna clase
        de información personal específica.
      </p>

      <h2>¿Qué tipos de cookies utiliza esta web?</h2>

      <h3>Según la entidad que las gestiona</h3>
      <ul>
        <li><strong>Cookies propias:</strong> Son aquellas que se envían desde nuestros propios equipos o dominio.</li>
      </ul>
      <p>
        Esta web <strong>no utiliza cookies de terceros</strong> con finalidad publicitaria ni de seguimiento.
      </p>

      <h3>Según el plazo de tiempo que permanecen activas</h3>
      <ul>
        <li>
          <strong>Cookies de sesión:</strong> Cookies temporales que permanecen en su navegador hasta
          que abandona la página web. Se utilizan para garantizar el correcto funcionamiento técnico
          del sitio.
        </li>
      </ul>

      <h3>Según su finalidad</h3>
      <ul>
        <li>
          <strong>Cookies técnicas:</strong> Son las estrictamente necesarias para la prestación del
          servicio solicitado por el usuario. Permiten controlar el tráfico y la comunicación de datos,
          acceder a áreas del sitio y utilizar los elementos de seguridad. Sin estas cookies, el sitio
          web no funcionaría correctamente.
        </li>
      </ul>

      <h2>Tabla de cookies utilizadas</h2>
      <div className="legal-table-wrapper">
        <table className="legal-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Finalidad</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>cookie_consent</td>
              <td>Propia · Técnica</td>
              <td>Registra la aceptación del aviso de cookies por parte del usuario</td>
              <td>1 año</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Esta web <strong>no instala cookies de análisis, publicidad ni redes sociales</strong>. El proceso
        de pago se realiza en la plataforma externa Stripe (stripe.com), que gestiona sus propias cookies
        conforme a su política de privacidad, fuera del ámbito de este sitio web.
      </p>

      <h2>Cómo gestionar o desactivar las cookies</h2>
      <p>
        Puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración
        de las opciones de su navegador:
      </p>
      <ul>
        <li>
          <strong>Chrome:</strong>{" "}
          <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer">
            support.google.com/chrome/answer/95647
          </a>
        </li>
        <li>
          <strong>Firefox:</strong>{" "}
          <a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer">
            support.mozilla.org/es/kb/Borrar cookies
          </a>
        </li>
        <li>
          <strong>Safari:</strong>{" "}
          <a href="https://www.apple.com/es/privacy/use-of-cookies/" target="_blank" rel="noopener noreferrer">
            apple.com/es/privacy/use-of-cookies
          </a>
        </li>
        <li>
          <strong>Microsoft Edge:</strong>{" "}
          <a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">
            support.microsoft.com (cookies Edge)
          </a>
        </li>
        <li>
          <strong>Opera:</strong>{" "}
          <a href="http://help.opera.com/Windows/12.00/es-ES/cookies.html" target="_blank" rel="noopener noreferrer">
            help.opera.com/cookies
          </a>
        </li>
      </ul>
      <p>
        Si bloquea todas las cookies, es posible que algunas funciones del sitio web no estén disponibles
        o que la experiencia de navegación sea menos satisfactoria.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tiene dudas sobre esta política de cookies, puede contactar con nosotros enviando un email a{" "}
        <a href="mailto:reservas@tuktukcartagena.com">reservas@tuktukcartagena.com</a>.
      </p>

      <p className="legal-date">
        Última actualización: julio de 2026 · MELLADA DPAICO S.L.
      </p>
    </LegalPage>
  );
}
