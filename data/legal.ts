import { MAIN_PHONE, TEXT_PHONE, GENERAL_EMAIL } from "@/lib/constants";

// Content transcribed from the live site:
//   https://www.ktdoctor.com/privacy-policy-2/
//   https://www.ktdoctor.com/terms_and_conditions-2/
// Spanish translations added for parity with the rest of the bilingual site.
// Contact details reference lib/constants.ts so they can't drift.
// Note: no em dashes anywhere (site style, enforced by data/legal.test.ts).

export type LegalListItem = {
  label?: string;
  labelEs?: string;
  text: string;
  textEs: string;
};

export type LegalBlock =
  | { type: "paragraph"; text: string; textEs: string }
  | { type: "list"; items: LegalListItem[] };

export type LegalSection = {
  heading: string;
  headingEs: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  effectiveDate: string; // ISO date
  intro: { text: string; textEs: string };
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument = {
  effectiveDate: "2026-07-18",
  intro: {
    text: "At Kids and Teens Medical Group (KT Doctor), your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you visit our website, www.ktdoctor.com, or interact with our services.",
    textEs:
      "En Kids and Teens Medical Group (KT Doctor), su privacidad es importante para nosotros. Esta Política de Privacidad describe cómo recopilamos, usamos, divulgamos y protegemos su información personal cuando visita nuestro sitio web, www.ktdoctor.com, o interactúa con nuestros servicios.",
  },
  sections: [
    {
      heading: "1. Information We Collect",
      headingEs: "1. Información que Recopilamos",
      blocks: [
        {
          type: "list",
          items: [
            {
              label: "Personal Information:",
              labelEs: "Información Personal:",
              text: "We may collect personal details such as your name, email address, phone number, and other information you provide when booking appointments, registering, or interacting with our services.",
              textEs:
                "Podemos recopilar datos personales como su nombre, dirección de correo electrónico, número de teléfono y otra información que usted proporcione al reservar citas, registrarse o interactuar con nuestros servicios.",
            },
            {
              label: "Health Information:",
              labelEs: "Información de Salud:",
              text: "As a healthcare provider, we may collect medical information about your child, including medical history, treatment details, and health-related data necessary for care.",
              textEs:
                "Como proveedor de atención médica, podemos recopilar información médica sobre su hijo, incluyendo historial médico, detalles del tratamiento y datos relacionados con la salud necesarios para su atención.",
            },
            {
              label: "Automatic Data Collection:",
              labelEs: "Recopilación Automática de Datos:",
              text: "We may collect information automatically when you visit our website, such as your IP address, browser type, and pages visited. This helps us improve your experience on the site.",
              textEs:
                "Podemos recopilar información automáticamente cuando visita nuestro sitio web, como su dirección IP, tipo de navegador y páginas visitadas. Esto nos ayuda a mejorar su experiencia en el sitio.",
            },
          ],
        },
      ],
    },
    {
      heading: "2. How We Use Your Information",
      headingEs: "2. Cómo Usamos su Información",
      blocks: [
        {
          type: "list",
          items: [
            {
              label: "Medical Care:",
              labelEs: "Atención Médica:",
              text: "We use personal and health information to provide medical services, appointments, and treatment to your child.",
              textEs:
                "Usamos la información personal y de salud para brindar servicios médicos, citas y tratamiento a su hijo.",
            },
            {
              label: "Communication:",
              labelEs: "Comunicación:",
              text: "We may use your contact details to send appointment reminders, health-related updates, or other important information. We may also communicate with you about your account or service-related matters.",
              textEs:
                "Podemos usar sus datos de contacto para enviar recordatorios de citas, actualizaciones relacionadas con la salud u otra información importante. También podemos comunicarnos con usted sobre su cuenta o asuntos relacionados con el servicio.",
            },
            {
              label: "Website Analytics:",
              labelEs: "Análisis del Sitio Web:",
              text: "We use collected data to analyze how visitors interact with our website and to improve its functionality and user experience.",
              textEs:
                "Usamos los datos recopilados para analizar cómo los visitantes interactúan con nuestro sitio web y para mejorar su funcionalidad y experiencia de usuario.",
            },
          ],
        },
      ],
    },
    {
      heading: "3. How We Protect Your Information",
      headingEs: "3. Cómo Protegemos su Información",
      blocks: [
        {
          type: "paragraph",
          text: "We take reasonable measures to safeguard your personal and health information from unauthorized access, use, or disclosure. This includes encryption and secure server technology for online transactions. However, please note that no method of electronic transmission is completely secure, and we cannot guarantee absolute security.",
          textEs:
            "Tomamos medidas razonables para proteger su información personal y de salud contra el acceso, uso o divulgación no autorizados. Esto incluye cifrado y tecnología de servidores seguros para las transacciones en línea. Sin embargo, tenga en cuenta que ningún método de transmisión electrónica es completamente seguro, y no podemos garantizar una seguridad absoluta.",
        },
      ],
    },
    {
      heading: "4. Disclosure of Your Information",
      headingEs: "4. Divulgación de su Información",
      blocks: [
        {
          type: "list",
          items: [
            {
              label: "Third-Party Service Providers:",
              labelEs: "Proveedores de Servicios Externos:",
              text: "We may share your information with trusted third-party vendors who assist in providing services such as payment processing, appointment scheduling, or communication. These providers are bound by confidentiality agreements and can only use your information for the specified purpose.",
              textEs:
                "Podemos compartir su información con proveedores externos de confianza que ayudan a brindar servicios como el procesamiento de pagos, la programación de citas o la comunicación. Estos proveedores están sujetos a acuerdos de confidencialidad y solo pueden usar su información para el propósito especificado.",
            },
            {
              label: "Legal Requirements:",
              labelEs: "Requisitos Legales:",
              text: "We may disclose your information if required to do so by law or in response to a legal request, such as a subpoena or court order.",
              textEs:
                "Podemos divulgar su información si la ley así lo exige o en respuesta a una solicitud legal, como una citación u orden judicial.",
            },
            {
              label: "No Sharing for Marketing Purposes:",
              labelEs: "Sin Compartir con Fines de Marketing:",
              text: "We do not share your personal information with third parties for marketing purposes.",
              textEs:
                "No compartimos su información personal con terceros con fines de marketing.",
            },
            {
              label: "Commitment to Data Protection:",
              labelEs: "Compromiso con la Protección de Datos:",
              text: "We commit not to transfer your personal data to any external organizations except for trusted service providers who are bound by confidentiality agreements and only for the purpose of providing our services. We take all necessary measures to prevent unauthorized sharing of your data.",
              textEs:
                "Nos comprometemos a no transferir sus datos personales a ninguna organización externa, salvo a proveedores de servicios de confianza que estén sujetos a acuerdos de confidencialidad y únicamente con el fin de brindar nuestros servicios. Tomamos todas las medidas necesarias para evitar el intercambio no autorizado de sus datos.",
            },
          ],
        },
      ],
    },
    {
      heading: "5. SMS Text Policy",
      headingEs: "5. Política de Mensajes de Texto SMS",
      blocks: [
        {
          type: "paragraph",
          text: 'By providing your phone number, you consent to receive text messages regarding your child\'s care, including appointment reminders and health-related communication. You may opt-out of these messages at any time by replying with "STOP" or following the instructions provided in the message.',
          textEs:
            'Al proporcionar su número de teléfono, usted consiente en recibir mensajes de texto relacionados con la atención de su hijo, incluyendo recordatorios de citas y comunicación relacionada con la salud. Puede cancelar estos mensajes en cualquier momento respondiendo con "STOP" o siguiendo las instrucciones incluidas en el mensaje.',
        },
      ],
    },
    {
      heading: "6. Your Rights and Choices",
      headingEs: "6. Sus Derechos y Opciones",
      blocks: [
        {
          type: "list",
          items: [
            {
              label: "Access to Information:",
              labelEs: "Acceso a la Información:",
              text: "You may request access to your personal and health information that we have on file. Please contact us at the details provided below to make such a request.",
              textEs:
                "Puede solicitar acceso a la información personal y de salud que tenemos registrada. Comuníquese con nosotros a través de los datos que se proporcionan a continuación para hacer dicha solicitud.",
            },
            {
              label: "Correction of Information:",
              labelEs: "Corrección de la Información:",
              text: "If you believe any of the information we have about you is incorrect or incomplete, you may request corrections.",
              textEs:
                "Si cree que alguna de la información que tenemos sobre usted es incorrecta o incompleta, puede solicitar correcciones.",
            },
            {
              label: "Opting Out of Communications:",
              labelEs: "Cancelación de Comunicaciones:",
              text: "You can opt out of receiving marketing communications from us by following the unsubscribe instructions in emails or by contacting us directly.",
              textEs:
                "Puede optar por no recibir comunicaciones de marketing de nuestra parte siguiendo las instrucciones para cancelar la suscripción en los correos electrónicos o comunicándose directamente con nosotros.",
            },
          ],
        },
      ],
    },
    {
      heading: "7. Contact Us for Privacy-Related Inquiries",
      headingEs: "7. Contáctenos para Consultas de Privacidad",
      blocks: [
        {
          type: "paragraph",
          text: "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at:",
          textEs:
            "Si tiene alguna pregunta, inquietud o solicitud con respecto a esta Política de Privacidad o a su información personal, comuníquese con nosotros a través de:",
        },
        {
          type: "list",
          items: [
            {
              label: "Email:",
              labelEs: "Correo electrónico:",
              text: GENERAL_EMAIL,
              textEs: GENERAL_EMAIL,
            },
            {
              label: "Phone:",
              labelEs: "Teléfono:",
              text: MAIN_PHONE,
              textEs: MAIN_PHONE,
            },
            {
              label: "Mailing Address:",
              labelEs: "Dirección postal:",
              text: "504 S Sierra Madre Blvd, Pasadena, CA 91107",
              textEs: "504 S Sierra Madre Blvd, Pasadena, CA 91107",
            },
          ],
        },
      ],
    },
    {
      heading: "8. Changes to the Privacy Policy",
      headingEs: "8. Cambios en la Política de Privacidad",
      blocks: [
        {
          type: "paragraph",
          text: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date." We encourage you to review this policy periodically to stay informed about how we protect your information.',
          textEs:
            'Podemos actualizar esta Política de Privacidad periódicamente. Cualquier cambio se publicará en esta página con una "Fecha de Vigencia" actualizada. Le recomendamos revisar esta política de forma periódica para mantenerse informado sobre cómo protegemos su información.',
        },
      ],
    },
    {
      heading: "9. Governing Law",
      headingEs: "9. Ley Aplicable",
      blocks: [
        {
          type: "paragraph",
          text: "This Privacy Policy is governed by the laws of the State of California.",
          textEs:
            "Esta Política de Privacidad se rige por las leyes del Estado de California.",
        },
      ],
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  effectiveDate: "2026-07-18",
  intro: {
    text: "Welcome to www.ktdoctor.com, the official website of Kids and Teens Medical Group. By accessing or using this website, you agree to be bound by these Terms and Conditions, as well as our Privacy Policy.",
    textEs:
      "Bienvenido a www.ktdoctor.com, el sitio web oficial de Kids and Teens Medical Group. Al acceder o utilizar este sitio web, usted acepta quedar sujeto a estos Términos y Condiciones, así como a nuestra Política de Privacidad.",
  },
  sections: [
    {
      heading: "1. Use of the Website",
      headingEs: "1. Uso del Sitio Web",
      blocks: [
        {
          type: "paragraph",
          text: "ktdoctor.com is intended to provide information about our pediatric services, health resources, and general educational content related to children and teen healthcare. You agree to use this website solely for lawful purposes and in accordance with all applicable local, state, and national laws.",
          textEs:
            "ktdoctor.com tiene como propósito brindar información sobre nuestros servicios pediátricos, recursos de salud y contenido educativo general relacionado con la atención médica de niños y adolescentes. Usted acepta utilizar este sitio web únicamente con fines lícitos y de conformidad con todas las leyes locales, estatales y nacionales aplicables.",
        },
      ],
    },
    {
      heading: "2. Medical Information Disclaimer",
      headingEs: "2. Aviso sobre la Información Médica",
      blocks: [
        {
          type: "paragraph",
          text: "The content on this website is for informational purposes only and should not be considered medical advice. The information provided through this site is not intended to replace professional medical care, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding medical conditions. In case of emergency, call your doctor or 911 immediately.",
          textEs:
            "El contenido de este sitio web tiene únicamente fines informativos y no debe considerarse como consejo médico. La información proporcionada a través de este sitio no pretende reemplazar la atención, el diagnóstico o el tratamiento médico profesional. Busque siempre el consejo de su médico u otro proveedor de salud calificado ante cualquier pregunta que pueda tener sobre condiciones médicas. En caso de emergencia, llame a su médico o al 911 de inmediato.",
        },
      ],
    },
    {
      heading: "3. User Accounts and Security",
      headingEs: "3. Cuentas de Usuario y Seguridad",
      blocks: [
        {
          type: "paragraph",
          text: "If any part of the site requires you to register or create an account, you agree to provide accurate, current, and complete information and to maintain the security of your account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
          textEs:
            "Si alguna parte del sitio requiere que se registre o cree una cuenta, usted acepta proporcionar información precisa, actual y completa, y mantener la seguridad de su cuenta. Usted es responsable de mantener la confidencialidad de la información de su cuenta y de todas las actividades que ocurran bajo su cuenta.",
        },
      ],
    },
    {
      heading: "4. Intellectual Property",
      headingEs: "4. Propiedad Intelectual",
      blocks: [
        {
          type: "paragraph",
          text: "All content, features, and functionality on this site, including but not limited to text, graphics, logos, images, and software, are the property of Kids and Teens Medical Group or its licensors and are protected by copyright and other intellectual property laws. You may not reproduce, distribute, modify, or otherwise use any content from this site without our prior written consent.",
          textEs:
            "Todo el contenido, las funciones y la funcionalidad de este sitio, incluyendo, entre otros, texto, gráficos, logotipos, imágenes y software, son propiedad de Kids and Teens Medical Group o de sus licenciantes y están protegidos por las leyes de derechos de autor y otras leyes de propiedad intelectual. No puede reproducir, distribuir, modificar ni utilizar de ningún otro modo el contenido de este sitio sin nuestro consentimiento previo por escrito.",
        },
      ],
    },
    {
      heading: "5. Third-Party Links",
      headingEs: "5. Enlaces a Terceros",
      blocks: [
        {
          type: "paragraph",
          text: "Our website may contain links to third-party websites or resources. We do not control and are not responsible for the content, privacy policies, or practices of these third-party sites. By using this website, you acknowledge and agree that Kids and Teens Medical Group is not liable for any damage or losses caused by your use of any third-party websites.",
          textEs:
            "Nuestro sitio web puede contener enlaces a sitios web o recursos de terceros. No controlamos ni somos responsables del contenido, las políticas de privacidad ni las prácticas de estos sitios de terceros. Al utilizar este sitio web, usted reconoce y acepta que Kids and Teens Medical Group no es responsable de ningún daño o pérdida causados por su uso de sitios web de terceros.",
        },
      ],
    },
    {
      heading: "6. Limitation of Liability",
      headingEs: "6. Limitación de Responsabilidad",
      blocks: [
        {
          type: "paragraph",
          text: "To the fullest extent permitted by law, Kids and Teens Medical Group shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the website or any services provided through this site. This includes, without limitation, damages for loss of data, loss of profits, or any other damage.",
          textEs:
            "En la máxima medida permitida por la ley, Kids and Teens Medical Group no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo que surja de o en relación con su uso del sitio web o de cualquier servicio proporcionado a través de este sitio. Esto incluye, sin limitación, los daños por pérdida de datos, pérdida de ganancias o cualquier otro daño.",
        },
      ],
    },
    {
      heading: "7. Privacy Policy",
      headingEs: "7. Política de Privacidad",
      blocks: [
        {
          type: "paragraph",
          text: "By using our website, you consent to our collection and use of your data in accordance with our Privacy Policy. Please read our Privacy Policy carefully to understand how we collect, use, and protect your personal information.",
          textEs:
            "Al utilizar nuestro sitio web, usted consiente en la recopilación y el uso de sus datos de conformidad con nuestra Política de Privacidad. Lea atentamente nuestra Política de Privacidad para comprender cómo recopilamos, usamos y protegemos su información personal.",
        },
      ],
    },
    {
      heading: "8. SMS Text Policy",
      headingEs: "8. Política de Mensajes de Texto SMS",
      blocks: [
        {
          type: "paragraph",
          text: "By providing your phone number to Kids and Teens Medical Group, you consent to receive text messages from us regarding appointment reminders, health-related communications, and other important notifications related to your child's care. You understand that these messages may be sent via automated systems, and that message and data rates may apply.",
          textEs:
            "Al proporcionar su número de teléfono a Kids and Teens Medical Group, usted consiente en recibir mensajes de texto de nuestra parte relacionados con recordatorios de citas, comunicaciones relacionadas con la salud y otras notificaciones importantes sobre la atención de su hijo. Usted comprende que estos mensajes pueden enviarse mediante sistemas automatizados y que pueden aplicarse tarifas de mensajes y datos.",
        },
        {
          type: "list",
          items: [
            {
              label: "Opt-In:",
              labelEs: "Aceptación (Opt-In):",
              text: "By providing your phone number, you opt-in to receive text messages from us.",
              textEs:
                "Al proporcionar su número de teléfono, usted acepta recibir mensajes de texto de nuestra parte.",
            },
            {
              label: "Opt-Out:",
              labelEs: "Cancelación (Opt-Out):",
              text: 'If you no longer wish to receive SMS communications from us, you can reply to any text message with the word "STOPALL" or follow the instructions provided in the text message.',
              textEs:
                'Si ya no desea recibir comunicaciones SMS de nuestra parte, puede responder a cualquier mensaje de texto con la palabra "STOPALL" o seguir las instrucciones incluidas en el mensaje de texto.',
            },
            {
              label: "Message Frequency:",
              labelEs: "Frecuencia de Mensajes:",
              text: "The frequency of messages may vary depending on your care and communication preferences.",
              textEs:
                "La frecuencia de los mensajes puede variar según su atención y sus preferencias de comunicación.",
            },
            {
              label: "No Charge for Messages:",
              labelEs: "Sin Cargo por los Mensajes:",
              text: "There is no charge from us to receive text messages; however, standard message and data rates from your mobile provider may apply.",
              textEs:
                "No cobramos por recibir mensajes de texto; sin embargo, pueden aplicarse las tarifas estándar de mensajes y datos de su proveedor de telefonía móvil.",
            },
            {
              label: "Help:",
              labelEs: "Ayuda:",
              text: `If you need assistance or have questions regarding the SMS communications, text "HELP" to ${TEXT_PHONE} for help.`,
              textEs: `Si necesita ayuda o tiene preguntas sobre las comunicaciones SMS, envíe la palabra "HELP" al ${TEXT_PHONE} para obtener ayuda.`,
            },
          ],
        },
        {
          type: "paragraph",
          text: "By consenting to this SMS text policy, you acknowledge that you have read and understood the information above.",
          textEs:
            "Al consentir esta política de mensajes de texto SMS, usted reconoce que ha leído y comprendido la información anterior.",
        },
      ],
    },
    {
      heading: "9. Customer Support",
      headingEs: "9. Atención al Cliente",
      blocks: [
        {
          type: "paragraph",
          text: "If you need help or have any questions regarding these Terms and Conditions or any other aspect of our services, please contact us at:",
          textEs:
            "Si necesita ayuda o tiene alguna pregunta sobre estos Términos y Condiciones o cualquier otro aspecto de nuestros servicios, comuníquese con nosotros a través de:",
        },
        {
          type: "list",
          items: [
            {
              label: "Phone:",
              labelEs: "Teléfono:",
              text: MAIN_PHONE,
              textEs: MAIN_PHONE,
            },
          ],
        },
        {
          type: "paragraph",
          text: "We are happy to assist you!",
          textEs: "¡Con gusto le ayudaremos!",
        },
      ],
    },
    {
      heading: "10. Changes to the Terms",
      headingEs: "10. Cambios en los Términos",
      blocks: [
        {
          type: "paragraph",
          text: 'We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page with an updated "Last Updated" date. It is your responsibility to review these Terms regularly to stay informed of any changes. Your continued use of the site after any changes constitutes your acceptance of the new terms.',
          textEs:
            'Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio se publicará en esta página con una fecha de "Última Actualización" actualizada. Es su responsabilidad revisar estos Términos periódicamente para mantenerse informado de cualquier cambio. Su uso continuado del sitio después de cualquier cambio constituye su aceptación de los nuevos términos.',
        },
      ],
    },
    {
      heading: "11. Governing Law",
      headingEs: "11. Ley Aplicable",
      blocks: [
        {
          type: "paragraph",
          text: "These Terms and Conditions are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.",
          textEs:
            "Estos Términos y Condiciones se rigen e interpretan de conformidad con las leyes del Estado de California, sin tener en cuenta sus principios sobre conflictos de leyes.",
        },
      ],
    },
  ],
};
