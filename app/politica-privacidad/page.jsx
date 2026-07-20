import LegalPage from "../../src/components/LegalPage";

export const metadata = {
  title: "Política de Privacidad | TUK TUK Cartagena",
  description: "Política de privacidad de TUK TUK Cartagena — MELLADA DPAICO S.L. Información sobre el tratamiento de datos personales conforme al RGPD.",
  robots: { index: false },
};

export default function PoliticaPrivacidad() {
  return (
    <LegalPage title="Política de Privacidad">
      <p className="legal-intro">
        En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y de la Ley Orgánica 3/2018 de Protección
        de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos sobre el
        tratamiento de sus datos personales.
      </p>

      <h2>Responsable del tratamiento</h2>
      <ul className="legal-data-list">
        <li><strong>Razón social:</strong> MELLADA DPAICO S.L.</li>
        <li><strong>NIF:</strong> B24803082</li>
        <li><strong>Domicilio:</strong> Calle Alcalde Amancio Muñoz 54, Cartagena (Murcia) 30203</li>
        <li><strong>Correo electrónico:</strong> <a href="mailto:reservas@tuktukcartagena.com">reservas@tuktukcartagena.com</a></li>
      </ul>

      <h2>Finalidades del tratamiento</h2>
      <p>En esta organización tratamos sus datos de carácter personal para las siguientes finalidades:</p>
      <ul>
        <li>Gestión de las peticiones de información recibidas sobre nuestros productos o servicios.</li>
        <li>Llevar a cabo la venta o prestación del servicio contratado (reservas de tours).</li>
        <li>Envío de información comercial y/o publicitaria mediante correo electrónico, con su consentimiento expreso.</li>
        <li>Gestión contable, fiscal y laboral propia.</li>
        <li>Cumplimiento de obligaciones legales.</li>
        <li>Gestión de incidencias y/o violaciones de seguridad.</li>
        <li>Mantenimiento de los sistemas informáticos.</li>
      </ul>

      <p>
        Los datos personales proporcionados se conservarán mientras dure la relación contractual o,
        en su caso, mientras no ejerza su derecho de oposición o retire el consentimiento otorgado.
      </p>

      <h2>Legitimación</h2>
      <p>El tratamiento de sus datos personales se realiza en base a:</p>
      <ul>
        <li>Su <strong>consentimiento inequívoco, informado y expreso</strong>, en aquellos supuestos en que sea legalmente exigible.</li>
        <li>La <strong>ejecución del contrato</strong> de prestación de servicios suscrito por usted (gestión de reservas).</li>
        <li>Una <strong>obligación legal</strong> del responsable del tratamiento.</li>
        <li>El <strong>interés legítimo</strong> del responsable, debidamente ponderado conforme a la normativa aplicable.</li>
      </ul>

      <h2>Destinatarios</h2>
      <p>Sus datos personales podrán comunicarse a las siguientes entidades cuando sea legalmente exigible:</p>
      <ul>
        <li>Agencia Tributaria</li>
        <li>Servicio Público de Empleo Estatal</li>
        <li>Tesorería General de la Seguridad Social</li>
        <li>Agencia Española de Protección de Datos</li>
        <li>Entidades bancarias</li>
      </ul>
      <p>Sus datos personales <strong>no se transferirán a ningún tercer país</strong> u organización internacional.</p>

      <h2>Procedencia de los datos</h2>
      <p>
        Los datos personales que tratamos proceden exclusivamente del <strong>propio interesado</strong>, quien
        los facilita a través de los formularios de reserva o contacto disponibles en la web.
      </p>

      <h2>Derechos del interesado</h2>
      <p>Usted tiene derecho a:</p>
      <ul>
        <li><strong>Acceso:</strong> Obtener confirmación sobre si tratamos sus datos y acceder a los mismos.</li>
        <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
        <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios para las finalidades descritas.</li>
        <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos por motivos relacionados con su situación particular.</li>
        <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento en determinadas circunstancias.</li>
        <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso común, o solicitar su transmisión a otro responsable.</li>
        <li><strong>Retirada del consentimiento:</strong> Retirar su consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento anterior.</li>
      </ul>

      <p>
        Estos derechos pueden ejercerse gratuitamente mediante solicitud escrita dirigida a{" "}
        <a href="mailto:reservas@tuktukcartagena.com">reservas@tuktukcartagena.com</a> o al domicilio
        social indicado anteriormente.
      </p>

      <p>
        Asimismo, tiene derecho a presentar una reclamación ante la{" "}
        <strong>Agencia Española de Protección de Datos</strong> (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
      </p>

      <h2>Medidas de seguridad</h2>
      <p>
        MELLADA DPAICO S.L. ha adoptado las medidas técnicas y organizativas necesarias para garantizar
        la seguridad de sus datos personales y evitar su alteración, pérdida, tratamiento o acceso no
        autorizado, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y
        los riesgos a que están expuestos.
      </p>

      <p className="legal-date">
        Última actualización: julio de 2026 · MELLADA DPAICO S.L.
      </p>
    </LegalPage>
  );
}
