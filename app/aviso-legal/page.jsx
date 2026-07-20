import LegalPage from "../../src/components/LegalPage";

export const metadata = {
  title: "Aviso Legal | TUK TUK Cartagena",
  description: "Aviso legal de TUK TUK Cartagena — MELLADA DPAICO S.L. Términos y condiciones de uso del sitio web.",
  robots: { index: false },
};

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso Legal">
      <p className="legal-intro">
        En cumplimiento de lo establecido en el Art. 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
        Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa de que los datos del titular
        de esta página web y responsable del servicio prestado a través de la misma son:
      </p>

      <ul className="legal-data-list">
        <li><strong>Razón social:</strong> MELLADA DPAICO S.L.</li>
        <li><strong>Domicilio:</strong> Calle Alcalde Amancio Muñoz 54, Cartagena (Murcia) 30203</li>
        <li><strong>Teléfono:</strong> 610 780 798</li>
        <li><strong>Correo electrónico:</strong> <a href="mailto:reservas@tuktukcartagena.com">reservas@tuktukcartagena.com</a></li>
        <li><strong>N.I.F.:</strong> B24803082</li>
      </ul>

      <p>
        Para obtener información adicional, puede contactar llamando al teléfono arriba indicado o enviando
        un correo a <a href="mailto:reservas@tuktukcartagena.com">reservas@tuktukcartagena.com</a>.
      </p>

      <h2>Términos y Condiciones de Uso de la Web</h2>

      <h3>1. Responsabilidad del usuario</h3>
      <p>
        Es responsabilidad de los visitantes, clientes o usuarios de este sitio web la atenta lectura de las
        Condiciones Generales de Uso que se detallan. El uso o acceso al portal implica el conocimiento y la plena
        aceptación de todas y cada una de las advertencias legales y condiciones establecidas.
      </p>

      <h3>2. Condiciones generales de uso</h3>
      <p>
        Nuestro portal web proporciona el acceso a multitud de informaciones, servicios, programas o datos
        (en adelante, «los contenidos») en Internet pertenecientes a MELLADA DPAICO S.L. (en adelante «La
        Empresa») o a sus licenciantes a los que el cliente/usuario pueda tener acceso.
      </p>
      <p>
        El cliente/usuario asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al
        registro que fuese necesario para acceder a determinados servicios o contenidos. En dicho registro el
        cliente/usuario será responsable de aportar información veraz y lícita.
      </p>
      <p>
        El cliente/usuario se compromete a hacer un uso adecuado de los contenidos y servicios que La Empresa
        ofrece a través de su portal y, con carácter enunciativo pero no limitativo, a no emplearlos para: (i)
        incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público; (ii) difundir
        contenidos de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio
        contra los derechos humanos; (iii) provocar daños en los sistemas físicos y lógicos de La Empresa, de
        sus proveedores o de terceras personas; (iv) intentar acceder y, en su caso, utilizar las cuentas de
        correo electrónico de otros usuarios.
      </p>

      <h3>3. Derecho de exclusión</h3>
      <p>
        La Empresa se reserva el derecho a denegar o retirar el acceso al portal y/o los servicios ofrecidos,
        sin necesidad de preaviso, a aquellos usuarios que incumplan las presentes Condiciones Generales de Uso.
      </p>

      <h3>4. Exclusión de garantías y de responsabilidad</h3>
      <p>
        La Empresa no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza
        que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de
        disponibilidad del portal o la transmisión de virus o programas maliciosos en los contenidos, a pesar
        de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
      </p>
      <p>
        Del mismo modo, no se hará responsable de la falta de licitud, calidad, fiabilidad, utilidad y
        disponibilidad de los servicios prestados por terceros y puestos a disposición de los usuarios en este
        sitio web.
      </p>

      <h3>5. Enlaces</h3>
      <p>
        En el caso de que en nuestro portal web se dispusiesen enlaces o hipervínculos hacia otros sitios de
        Internet, La Empresa no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún
        caso La Empresa asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un
        sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud,
        veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de
        dichos hipervínculos u otros sitios de Internet.
      </p>

      <h3>6. Propiedad intelectual</h3>
      <p>
        La Empresa es titular de todos los derechos de propiedad intelectual e industrial de su página web,
        así como de los elementos contenidos en la misma (imágenes, sonido, audio, vídeo, software o textos;
        marcas o logotipos, combinaciones de colores, estructura y diseño, etc.).
      </p>
      <p>
        Queda expresamente prohibida la reproducción, distribución, comunicación pública y transformación de
        los contenidos de esta página web sin el consentimiento expreso y por escrito de La Empresa. El
        cliente/usuario podrá visualizar los elementos del portal e incluso imprimirlos, copiarlos y
        almacenarlos en su dispositivo, siempre y cuando sea única y exclusivamente para su uso personal y
        privado.
      </p>

      <h3>7. Protección de Datos</h3>
      <p>
        Se estará a lo dispuesto en la{" "}
        <a href="/politica-privacidad">Política de Privacidad</a>, disponible en la web.
      </p>
    </LegalPage>
  );
}
