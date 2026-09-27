import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Scale } from 'lucide-react'
import { LEGAL as L } from '../lib/legal'
import { PageHeader } from '../components/ui'

function Doc({ toc, children }: { toc: [string, string][]; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr]">
      <nav className="hidden lg:block" aria-label="Contenido">
        <ol className="sticky top-24 space-y-2 border-l-4 border-feather pl-4 text-sm">
          {toc.map(([id, t], i) => (
            <li key={id}><a href={`#${id}`} className="text-ink/70 hover:text-ultra">{i + 1}. {t}</a></li>
          ))}
        </ol>
      </nav>
      <article className="legal max-w-3xl space-y-4 text-ink/85 [&_h2]:h-display [&_h2]:scroll-mt-24 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:text-ultra [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </article>
    </div>
  )
}

export function Terms() {
  const toc: [string, string][] = [
    ['aceptacion', 'Aceptación'], ['servicio', 'Qué es Épico'], ['intermediario', 'Rol de intermediario'], ['cuentas', 'Registro y llaves'],
    ['comunidades', 'Comunidades y contenido'], ['terceros', 'Enlaces y servicios de terceros'], ['eventos', 'Eventos y boletería'], ['pagos', 'Pagos'],
    ['conducta', 'Conducta prohibida'], ['pi', 'Propiedad intelectual'], ['responsabilidad', 'Limitación de responsabilidad'], ['indemnidad', 'Indemnidad'],
    ['suspension', 'Suspensión'], ['cambios', 'Cambios'], ['ley', 'Ley aplicable'], ['contacto', 'Contacto'],
  ]
  return (
    <>
      <PageHeader kicker="legal" title="Términos y condiciones" art={<Scale className="size-28 text-ultra" />}>
        Última actualización: {L.updated}. Léelos con calma: al usar {L.brand} aceptas estas reglas.
      </PageHeader>
      <Doc toc={toc}>
        <h2 id="aceptacion">1. Aceptación</h2>
        <p>
          Estos Términos y condiciones regulan el acceso y uso del sitio web y los servicios de {L.brand} (la “Plataforma”), operada por {L.company}, identificada con NIT {L.nit}, con
          domicilio en {L.city}. Al navegar, registrarte, crear una comunidad, publicar un evento o comprar una boleta, declaras que leíste, entendiste y aceptas estos Términos y la{' '}
          <Link to="/privacidad" className="font-bold underline">Política de tratamiento de datos</Link>. Si no estás de acuerdo, no uses la Plataforma.
        </p>
        <p>Si eres menor de 18 años, debes usar la Plataforma con la autorización y supervisión de tu padre, madre o representante legal.</p>

        <h2 id="servicio">2. Qué es {L.brand}</h2>
        <p>
          {L.brand} es una <strong>plataforma tecnológica</strong> que permite a fans de los musicales encontrarse, crear comunidades y subcomunidades, registrar líderes, enlazar grupos de
          mensajería, publicar eventos y vender o reservar boletas para esos eventos.
        </p>
        <p>
          {L.brand} es un proyecto independiente hecho por fans. <strong>No está afiliado, patrocinado ni respaldado</strong> por los creadores, productores, compañías ni titulares de
          derechos de EPIC: The Musical, Hamilton, SIX, Hadestown, Heathers, Ride the Cyclone ni de ninguna otra obra mencionada. Los nombres se usan solo con fines descriptivos.
        </p>

        <h2 id="intermediario">3. Rol de intermediario</h2>
        <p>
          {L.brand} <strong>no organiza, produce, promueve ni controla</strong> los eventos, comunidades o grupos publicados por usuarios. Actuamos únicamente como un medio que facilita el
          contacto entre organizadores, líderes y asistentes, y como intermediario en la venta de boletas a través de pasarelas de pago de terceros.
        </p>
        <p>
          En consecuencia, cada organizador y cada líder es el <strong>único responsable</strong> de la veracidad de la información que publica, de la realización del evento, del lugar, de
          la seguridad y el aforo, de los permisos y licencias requeridos, del trato a los asistentes y del manejo que dé a los datos de sus miembros.
        </p>

        <h2 id="cuentas">4. Registro y llaves de líder</h2>
        <p>
          Al crear una comunidad o un evento recibes una <strong>llave de líder</strong> que permite administrarlo. Eres responsable de custodiarla y de todo lo que se haga con ella. Si la
          compartes o la pierdes, {L.brand} no responde por el uso que terceros hagan de ella. Si sospechas un uso indebido, escríbenos a {L.supportEmail}.
        </p>

        <h2 id="comunidades">5. Comunidades, líderes y contenido de usuarios</h2>
        <ul>
          <li>El contenido publicado por usuarios (nombres, descripciones, enlaces, datos de líderes, eventos) es responsabilidad exclusiva de quien lo publica.</li>
          <li>Quien registra líderes declara contar con su <strong>autorización previa, expresa e informada</strong> para publicar su nombre, número y correo.</li>
          <li>Los líderes que acceden a los datos de miembros solo pueden usarlos para las finalidades autorizadas por cada miembro y responden por su uso indebido.</li>
          <li>Nos otorgas una licencia gratuita, no exclusiva y mundial para mostrar ese contenido dentro de la Plataforma mientras esté publicado.</li>
          <li>{L.brand} no revisa previamente el contenido, pero puede retirarlo cuando contravenga estos Términos o la ley, o cuando lo ordene una autoridad.</li>
        </ul>

        <h2 id="terceros">6. Enlaces y servicios de terceros</h2>
        <p>
          La Plataforma incluye enlaces a WhatsApp, Discord, Telegram, Instagram, YouTube, mapas y otros servicios de terceros. {L.brand} <strong>no controla ni es responsable</strong>{' '}
          del contenido, la moderación, la seguridad ni las políticas de privacidad de esos servicios, ni de lo que ocurra dentro de los grupos o chats externos. Su uso se rige por los
          términos de cada proveedor.
        </p>

        <h2 id="eventos">7. Eventos y boletería</h2>
        <ul>
          <li>La boleta es un derecho de acceso al evento emitido por cuenta del organizador. Cada código QR es único y puede ser validado una sola vez.</li>
          <li>El organizador es responsable de cumplir la normativa aplicable, incluidos permisos del lugar, seguridad, aforo y, cuando haya comunicación pública de obras musicales o audiovisuales, las <strong>licencias de derechos de autor</strong> (por ejemplo ante las sociedades de gestión colectiva).</li>
          <li>Si un evento se cancela o cambia sustancialmente, el organizador debe reembolsar el valor de las boletas. {L.brand} facilitará el proceso a través de la pasarela de pagos cuando sea posible.</li>
          <li>Las solicitudes de reembolso, retracto o reversión se atenderán conforme al Estatuto del Consumidor (Ley 1480 de 2011) y demás normas aplicables.</li>
          <li>La tarifa de servicio remunera el uso de la Plataforma y solo se reembolsa cuando la ley lo exija o cuando el evento sea cancelado.</li>
        </ul>

        <h2 id="pagos">8. Pagos</h2>
        <p>
          Los pagos se procesan a través de pasarelas de pago de terceros certificadas (por ejemplo Stripe, Wompi, Mercado Pago o PayU). {L.brand} <strong>no almacena</strong> los datos
          completos de tus tarjetas ni tus credenciales bancarias. Las condiciones, tiempos de aprobación y posibles rechazos dependen de la pasarela y de tu entidad financiera.
        </p>

        <h2 id="conducta">9. Conducta prohibida</h2>
        <ul>
          <li>Publicar información falsa, eventos inexistentes o suplantar a otra persona, comunidad o marca.</li>
          <li>Revender boletas con fines especulativos o usar la Plataforma para fraudes o estafas.</li>
          <li>Publicar contenido ilegal, violento, discriminatorio, sexual que involucre menores, o que infrinja derechos de terceros.</li>
          <li>Recolectar datos de otros usuarios sin su autorización, enviar spam o usar los datos para fines distintos a los autorizados.</li>
          <li>Interferir con la seguridad o el funcionamiento de la Plataforma.</li>
        </ul>

        <h2 id="pi">10. Propiedad intelectual</h2>
        <p>
          El diseño, las ilustraciones, el código y la marca {L.brand} pertenecen a {L.company}. Las marcas, títulos y obras de los musicales pertenecen a sus respectivos titulares. Si
          consideras que un contenido infringe tus derechos, escríbenos a {L.supportEmail} con la identificación de la obra, el contenido y tus datos de contacto; lo revisaremos y, si
          procede, lo retiraremos.
        </p>

        <h2 id="responsabilidad">11. Limitación de responsabilidad</h2>
        <p>En la máxima medida permitida por la ley colombiana, {L.brand} no será responsable por:</p>
        <ul>
          <li>La realización, calidad, seguridad, cancelación o cambios de los eventos, ni por lo que ocurra en ellos o en el lugar.</li>
          <li>Los actos u omisiones de organizadores, líderes, miembros o asistentes, ni por el contenido que publiquen.</li>
          <li>Lo que suceda en grupos, chats o servicios externos enlazados.</li>
          <li>Interrupciones, errores o indisponibilidad temporal de la Plataforma o de servicios de terceros.</li>
          <li>Daños indirectos, lucro cesante o pérdida de oportunidad derivados del uso de la Plataforma.</li>
        </ul>
        <p>
          Cuando la ley no permita excluir la responsabilidad, esta se limitará al valor efectivamente pagado a {L.brand} por concepto de tarifa de servicio en la transacción que dio
          origen al reclamo. Nada de lo aquí previsto limita los derechos irrenunciables que te otorga el Estatuto del Consumidor.
        </p>

        <h2 id="indemnidad">12. Indemnidad</h2>
        <p>
          Te comprometes a mantener indemne a {L.brand}, sus administradores y colaboradores frente a reclamaciones de terceros derivadas de tu contenido, tus eventos, tu comunidad, el uso
          que hagas de datos personales o el incumplimiento de estos Términos.
        </p>

        <h2 id="suspension">13. Suspensión y retiro</h2>
        <p>Podemos suspender o eliminar comunidades, eventos o accesos que incumplan estos Términos, sin perjuicio de las acciones legales que correspondan.</p>

        <h2 id="cambios">14. Cambios a los Términos</h2>
        <p>Podemos actualizar estos Términos. Publicaremos la nueva versión con su fecha; si el cambio es sustancial lo informaremos en la Plataforma. El uso posterior implica aceptación.</p>

        <h2 id="ley">15. Ley aplicable</h2>
        <p>Estos Términos se rigen por las leyes de la República de Colombia. Las controversias se someterán a los jueces competentes de Colombia, sin perjuicio de los derechos del consumidor ante la Superintendencia de Industria y Comercio.</p>

        <h2 id="contacto">16. Contacto</h2>
        <p>{L.company} · NIT {L.nit} · {L.address}, {L.city} · {L.supportEmail} · {L.phone}</p>
      </Doc>
    </>
  )
}

export function Privacy() {
  const toc: [string, string][] = [
    ['responsable', 'Responsable'], ['marco', 'Marco legal'], ['datos', 'Datos que tratamos'], ['finalidades', 'Finalidades'], ['autorizacion', 'Autorización'],
    ['menores', 'Menores y datos sensibles'], ['compartir', 'A quién compartimos'], ['derechos', 'Tus derechos'], ['procedimiento', 'Consultas y reclamos'],
    ['seguridad', 'Seguridad y conservación'], ['cookies', 'Almacenamiento local'], ['vigencia', 'Vigencia'],
  ]
  return (
    <>
      <PageHeader kicker="habeas data" title="Política de tratamiento de datos personales" art={<ShieldCheck className="size-28 text-ultra" />}>
        Última actualización: {L.updated}. Así cuidamos la información de fans, líderes y organizadores.
      </PageHeader>
      <Doc toc={toc}>
        <h2 id="responsable">1. Responsable del tratamiento</h2>
        <p>
          {L.company}, NIT {L.nit}, domicilio {L.address}, {L.city}. Correo para asuntos de datos personales: <strong>{L.email}</strong>. Teléfono: {L.phone}.
        </p>

        <h2 id="marco">2. Marco legal</h2>
        <p>
          Esta política se expide en cumplimiento del artículo 15 de la Constitución Política, la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único
          1074 de 2015) y demás normas que las modifiquen o complementen.
        </p>

        <h2 id="datos">3. Datos que tratamos</h2>
        <ul>
          <li><strong>Compradores:</strong> nombre, correo, celular (opcional), boletas adquiridas y registro de la transacción. No almacenamos números completos de tarjeta ni claves bancarias.</li>
          <li><strong>Miembros de comunidades:</strong> nombre, número de celular, correo (opcional), comunidad a la que se unen y fecha de autorización.</li>
          <li><strong>Líderes:</strong> nombre, rol, número y correo registrados por quien crea o administra la comunidad, y la preferencia de mostrar o no su número.</li>
          <li><strong>Organizadores:</strong> nombre, datos de contacto y ubicación del evento.</li>
          <li><strong>Datos técnicos:</strong> información básica de navegación necesaria para el funcionamiento y la seguridad del sitio.</li>
        </ul>

        <h2 id="finalidades">4. Finalidades</h2>
        <ul>
          <li>Gestionar la compra, emisión, envío y validación de boletas, y atender reembolsos o reclamaciones.</li>
          <li>Entregar al organizador del evento los datos del comprador necesarios para el control de acceso.</li>
          <li>Permitir a los líderes de una comunidad contactar a sus miembros sobre actividades de esa comunidad.</li>
          <li>Mostrar públicamente los datos de líderes que así lo autorizaron.</li>
          <li>Prevenir fraude, garantizar la seguridad de la Plataforma y cumplir obligaciones legales, contables y tributarias.</li>
          <li>Enviar información de la Plataforma, solo si lo autorizas; puedes revocarlo en cualquier momento.</li>
        </ul>

        <h2 id="autorizacion">5. Autorización</h2>
        <p>
          Solicitamos tu autorización <strong>previa, expresa e informada</strong> mediante casillas de aceptación que no vienen marcadas por defecto. Conservamos prueba de la autorización
          (fecha y hora) en nuestra base de datos. Quien registra datos de terceros (por ejemplo, de otros líderes) declara contar con la autorización de sus titulares.
        </p>

        <h2 id="menores">6. Menores de edad y datos sensibles</h2>
        <p>
          El tratamiento de datos de niños, niñas y adolescentes respetará su interés superior y requerirá la autorización de su representante legal. No solicitamos datos sensibles; si
          decides compartirlos en un campo libre, no estás obligado a hacerlo.
        </p>

        <h2 id="compartir">7. A quién compartimos tus datos</h2>
        <ul>
          <li><strong>Organizadores</strong> de los eventos a los que compras boletas, para el control de acceso.</li>
          <li><strong>Líderes</strong> de las comunidades a las que te unes.</li>
          <li><strong>Encargados</strong> que nos prestan servicios (pasarelas de pago, alojamiento en la nube, correo), bajo contratos que los obligan a proteger la información. Algunos pueden estar fuera de Colombia; en ese caso se realiza transmisión internacional conforme a la ley.</li>
          <li><strong>Autoridades</strong> cuando lo exija la ley o una orden judicial.</li>
        </ul>
        <p>No vendemos tus datos personales.</p>

        <h2 id="derechos">8. Tus derechos como titular</h2>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.</li>
          <li>Acceder gratuitamente a tus datos personales.</li>
        </ul>

        <h2 id="procedimiento">9. Consultas y reclamos</h2>
        <p>Escribe a <strong>{L.email}</strong> indicando tu nombre, documento, medio de respuesta y la solicitud.</p>
        <ul>
          <li><strong>Consultas:</strong> se responden en máximo 10 días hábiles, prorrogables por 5 días hábiles más informándote el motivo.</li>
          <li><strong>Reclamos</strong> (corrección, actualización, supresión o incumplimiento): se atienden en máximo 15 días hábiles, prorrogables por 8 días hábiles más. Si el reclamo está incompleto, te pediremos completarlo dentro de los 5 días siguientes.</li>
        </ul>
        <p>Solo podrás acudir a la SIC después de agotar este trámite con nosotros.</p>

        <h2 id="seguridad">10. Seguridad y conservación</h2>
        <p>
          Aplicamos medidas técnicas, humanas y administrativas razonables (cifrado en tránsito, control de acceso por llaves, registros de autorización). Conservamos los datos mientras
          sean necesarios para las finalidades descritas y durante los plazos que exija la ley.
        </p>

        <h2 id="cookies">11. Almacenamiento local</h2>
        <p>
          Guardamos en tu navegador tu carrito, tus boletas recientes y tus llaves de líder para que no tengas que ingresarlas cada vez. No usamos cookies publicitarias. Puedes borrar
          estos datos desde la configuración de tu navegador. Los videos de YouTube solo se cargan cuando presionas reproducir.
        </p>

        <h2 id="vigencia">12. Vigencia</h2>
        <p>Esta política rige desde su publicación. Cualquier cambio sustancial será informado en la Plataforma. Las bases de datos se inscribirán en el Registro Nacional de Bases de Datos cuando la ley lo exija.</p>
      </Doc>
    </>
  )
}
