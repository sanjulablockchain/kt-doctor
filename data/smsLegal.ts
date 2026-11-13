import type { LegalDocument, LegalLink } from "./legal";

// SMS Privacy Policy and SMS Terms and Conditions, supplied by KTMG on
// 2026-11-13 for the SMS messaging program (carrier registration needs both
// pages live at /sms-privacy-policy and /sms-terms-and-conditions).
// Spanish translations added for parity with the rest of the bilingual site.
// Note: no em dashes anywhere (site style, enforced by data/legal.test.ts).

const WEBSITE_LINK: LegalLink = {
  href: "/",
  text: "www.ktdoctor.com",
  textEs: "www.ktdoctor.com",
};

const SMS_PRIVACY_LINK: LegalLink = {
  href: "/sms-privacy-policy",
  text: "www.ktdoctor.com/sms-privacy-policy",
  textEs: "www.ktdoctor.com/sms-privacy-policy",
};

export const smsPrivacyPolicy: LegalDocument = {
  effectiveDate: "2026-11-12",
  sections: [
    {
      heading: "1. Introduction",
      headingEs: "1. Introducción",
      blocks: [
        {
          type: "paragraph",
          text: 'Kids & Teens Medical Group ("KTMG," "we," "us," or "our") respects your privacy and is committed to protecting your personal information.',
          textEs:
            'Kids & Teens Medical Group ("KTMG", "nosotros" o "nuestro") respeta su privacidad y se compromete a proteger su información personal.',
        },
        {
          type: "paragraph",
          text: "This SMS Privacy Policy explains how we collect, use, protect, and manage information associated with our text messaging services.",
          textEs:
            "Esta Política de Privacidad de SMS explica cómo recopilamos, usamos, protegemos y administramos la información asociada con nuestros servicios de mensajes de texto.",
        },
      ],
    },
    {
      heading: "2. Information We Collect",
      headingEs: "2. Información que Recopilamos",
      blocks: [
        {
          type: "paragraph",
          text: "When you consent to receive SMS communications from Kids & Teens Medical Group, we may collect the following information:",
          textEs:
            "Cuando usted da su consentimiento para recibir comunicaciones por SMS de Kids & Teens Medical Group, podemos recopilar la siguiente información:",
        },
        {
          type: "list",
          items: [
            { text: "Your name", textEs: "Su nombre" },
            { text: "Your mobile phone number", textEs: "Su número de teléfono móvil" },
            {
              text: "Your preferred communication language",
              textEs: "Su idioma de comunicación preferido",
            },
            {
              text: "Your SMS communication preferences",
              textEs: "Sus preferencias de comunicación por SMS",
            },
            {
              text: "Your consent and opt-in records",
              textEs: "Sus registros de consentimiento y suscripción",
            },
            {
              text: "Your SMS communication history",
              textEs: "Su historial de comunicaciones por SMS",
            },
          ],
        },
        {
          type: "paragraph",
          text: "We collect this information when you voluntarily provide it through our patient registration forms, appointment scheduling process, website forms, or other authorized communication channels.",
          textEs:
            "Recopilamos esta información cuando usted la proporciona voluntariamente a través de nuestros formularios de registro de pacientes, el proceso de programación de citas, los formularios del sitio web u otros canales de comunicación autorizados.",
        },
      ],
    },
    {
      heading: "3. How We Use Your Information",
      headingEs: "3. Cómo Usamos su Información",
      blocks: [
        {
          type: "paragraph",
          text: "We use your information to provide relevant communications, including:",
          textEs: "Usamos su información para enviarle comunicaciones relevantes, que incluyen:",
        },
        {
          type: "list",
          items: [
            {
              text: "Appointment confirmations and reminders",
              textEs: "Confirmaciones y recordatorios de citas",
            },
            {
              text: "Appointment scheduling updates",
              textEs: "Actualizaciones sobre la programación de citas",
            },
            {
              text: "Clinic operating hours and service notifications",
              textEs: "Horarios de atención de la clínica y avisos de servicio",
            },
            {
              text: "Patient communication and follow-up requests",
              textEs: "Comunicaciones con pacientes y solicitudes de seguimiento",
            },
            {
              text: "Responses to patient inquiries",
              textEs: "Respuestas a consultas de pacientes",
            },
            {
              text: "Promotional or informational messages when you have separately consented to receive them",
              textEs:
                "Mensajes promocionales o informativos cuando usted haya dado su consentimiento por separado para recibirlos",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Messages may be sent in English or Spanish depending on your communication preferences.",
          textEs:
            "Los mensajes pueden enviarse en inglés o en español, según sus preferencias de comunicación.",
        },
      ],
    },
    {
      heading: "4. SMS Consent and Information Sharing",
      headingEs: "4. Consentimiento de SMS y Divulgación de Información",
      blocks: [
        {
          type: "paragraph",
          text: "Kids & Teens Medical Group respects your right to control how your personal information is used.",
          textEs:
            "Kids & Teens Medical Group respeta su derecho a controlar cómo se usa su información personal.",
        },
        {
          type: "paragraph",
          text: "We do not sell, rent, or share your mobile phone number, SMS opt-in information, or SMS consent records with third parties or affiliates for marketing or promotional purposes.",
          textEs:
            "No vendemos, alquilamos ni compartimos su número de teléfono móvil, su información de suscripción a SMS ni sus registros de consentimiento de SMS con terceros ni con empresas afiliadas para fines de mercadeo o promocionales.",
        },
        {
          type: "paragraph",
          text: "SMS consent information is used only for the purposes authorized by the individual.",
          textEs:
            "La información de consentimiento de SMS se usa únicamente para los fines autorizados por la persona.",
        },
        {
          type: "paragraph",
          text: "We may use authorized service providers to facilitate SMS delivery and related operations, subject to appropriate confidentiality, privacy, and security safeguards.",
          textEs:
            "Podemos recurrir a proveedores de servicios autorizados para facilitar el envío de SMS y las operaciones relacionadas, sujetos a las medidas adecuadas de confidencialidad, privacidad y seguridad.",
        },
      ],
    },
    {
      heading: "5. SMS Message Frequency",
      headingEs: "5. Frecuencia de los Mensajes SMS",
      blocks: [
        {
          type: "paragraph",
          text: "Message frequency varies depending on your appointments, healthcare-related communications, and the messaging services you have agreed to receive.",
          textEs:
            "La frecuencia de los mensajes varía según sus citas, las comunicaciones relacionadas con su atención médica y los servicios de mensajería que haya aceptado recibir.",
        },
        {
          type: "paragraph",
          text: "Message and data rates may apply according to your mobile carrier's service plan.",
          textEs:
            "Pueden aplicarse tarifas de mensajes y datos según el plan de servicio de su operador de telefonía móvil.",
        },
      ],
    },
    {
      heading: "6. Opting Out of SMS Communications",
      headingEs: "6. Cómo Darse de Baja de las Comunicaciones por SMS",
      blocks: [
        {
          type: "paragraph",
          text: "You may opt out of SMS communications at any time by replying STOP to any SMS message received from Kids & Teens Medical Group.",
          textEs:
            "Puede darse de baja de las comunicaciones por SMS en cualquier momento respondiendo STOP a cualquier mensaje SMS que reciba de Kids & Teens Medical Group.",
        },
        {
          type: "paragraph",
          text: "After your opt-out request is processed, you will no longer receive messages from the applicable SMS program, except for a confirmation of your opt-out where permitted.",
          textEs:
            "Una vez procesada su solicitud de baja, ya no recibirá mensajes del programa de SMS correspondiente, salvo una confirmación de su baja cuando esté permitido.",
        },
        {
          type: "paragraph",
          text: "To request assistance, reply HELP or contact our office through our official website.",
          textEs:
            "Para solicitar ayuda, responda HELP o comuníquese con nuestra oficina a través de nuestro sitio web oficial.",
        },
      ],
    },
    {
      heading: "7. Data Security",
      headingEs: "7. Seguridad de los Datos",
      blocks: [
        {
          type: "paragraph",
          text: "We implement reasonable administrative, technical, and organizational safeguards to protect your information against unauthorized access, disclosure, alteration, or misuse.",
          textEs:
            "Aplicamos medidas de seguridad administrativas, técnicas y organizativas razonables para proteger su información contra el acceso, la divulgación, la alteración o el uso indebido no autorizados.",
        },
        {
          type: "paragraph",
          text: "SMS messaging may not always be a secure method of communication. We encourage patients not to send sensitive medical information, financial information, or confidential personal details through standard text messages.",
          textEs:
            "Los mensajes SMS no siempre son un medio de comunicación seguro. Recomendamos a los pacientes no enviar información médica delicada, información financiera ni datos personales confidenciales por mensajes de texto estándar.",
        },
      ],
    },
    {
      heading: "8. Your Privacy Choices",
      headingEs: "8. Sus Opciones de Privacidad",
      blocks: [
        {
          type: "paragraph",
          text: "You may request information about your SMS communication preferences, update your contact information, or withdraw your consent by contacting Kids & Teens Medical Group.",
          textEs:
            "Puede solicitar información sobre sus preferencias de comunicación por SMS, actualizar sus datos de contacto o retirar su consentimiento comunicándose con Kids & Teens Medical Group.",
        },
        {
          type: "paragraph",
          text: "Withdrawing SMS consent does not prevent you from receiving healthcare services.",
          textEs:
            "Retirar su consentimiento de SMS no le impide recibir servicios de atención médica.",
        },
      ],
    },
    {
      heading: "9. Changes to This Policy",
      headingEs: "9. Cambios a esta Política",
      blocks: [
        {
          type: "paragraph",
          text: "We may update this SMS Privacy Policy periodically to reflect changes in our messaging practices, legal requirements, or operational procedures.",
          textEs:
            "Podemos actualizar esta Política de Privacidad de SMS periódicamente para reflejar cambios en nuestras prácticas de mensajería, requisitos legales o procedimientos operativos.",
        },
        {
          type: "paragraph",
          text: "Any updates will be published on our official website with a revised effective date.",
          textEs:
            "Cualquier actualización se publicará en nuestro sitio web oficial con una fecha de vigencia revisada.",
        },
      ],
    },
    {
      heading: "10. Contact Information",
      headingEs: "10. Información de Contacto",
      blocks: [
        {
          type: "paragraph",
          text: "Kids & Teens Medical Group",
          textEs: "Kids & Teens Medical Group",
        },
        { type: "paragraph", text: "Website:", textEs: "Sitio web:", link: WEBSITE_LINK },
        {
          type: "paragraph",
          text: "For questions about SMS communications or privacy practices, please contact us through our official website.",
          textEs:
            "Si tiene preguntas sobre las comunicaciones por SMS o nuestras prácticas de privacidad, comuníquese con nosotros a través de nuestro sitio web oficial.",
        },
      ],
    },
  ],
};

export const smsTermsAndConditions: LegalDocument = {
  effectiveDate: "2026-11-12",
  sections: [
    {
      heading: "1. SMS Program Overview",
      headingEs: "1. Descripción del Programa de SMS",
      blocks: [
        {
          type: "paragraph",
          text: 'Kids & Teens Medical Group ("KTMG") provides SMS messaging services to communicate with patients and their authorized representatives regarding appointments, scheduling, clinic notifications, and other relevant services.',
          textEs:
            'Kids & Teens Medical Group ("KTMG") ofrece servicios de mensajería SMS para comunicarse con los pacientes y sus representantes autorizados sobre citas, programación, avisos de la clínica y otros servicios relevantes.',
        },
        {
          type: "paragraph",
          text: "By opting in to our SMS messaging program, you agree to receive text messages from Kids & Teens Medical Group at the mobile number you provide.",
          textEs:
            "Al suscribirse a nuestro programa de mensajería SMS, usted acepta recibir mensajes de texto de Kids & Teens Medical Group en el número móvil que proporcione.",
        },
      ],
    },
    {
      heading: "2. Types of SMS Messages",
      headingEs: "2. Tipos de Mensajes SMS",
      blocks: [
        {
          type: "paragraph",
          text: "Depending on your consent and communication preferences, you may receive:",
          textEs: "Según su consentimiento y sus preferencias de comunicación, puede recibir:",
        },
        {
          type: "list",
          items: [
            {
              text: "Appointment reminders and confirmations",
              textEs: "Recordatorios y confirmaciones de citas",
            },
            {
              text: "Appointment cancellations or scheduling changes",
              textEs: "Cancelaciones de citas o cambios en la programación",
            },
            {
              text: "Patient service notifications",
              textEs: "Avisos de servicio para pacientes",
            },
            {
              text: "Clinic announcements and operational updates",
              textEs: "Anuncios de la clínica y actualizaciones operativas",
            },
            {
              text: "Responses to patient inquiries",
              textEs: "Respuestas a consultas de pacientes",
            },
            {
              text: "Promotional and marketing communications, if you have separately opted in to receive them",
              textEs:
                "Comunicaciones promocionales y de mercadeo, si se ha suscrito por separado para recibirlas",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Messages may be delivered in English or Spanish.",
          textEs: "Los mensajes pueden enviarse en inglés o en español.",
        },
      ],
    },
    {
      heading: "3. Consent to Receive SMS Messages",
      headingEs: "3. Consentimiento para Recibir Mensajes SMS",
      blocks: [
        {
          type: "paragraph",
          text: "By voluntarily opting in to our SMS messaging program, you authorize Kids & Teens Medical Group to send text messages to your provided mobile number for the purposes described in your consent.",
          textEs:
            "Al suscribirse voluntariamente a nuestro programa de mensajería SMS, usted autoriza a Kids & Teens Medical Group a enviar mensajes de texto al número móvil que proporcionó para los fines descritos en su consentimiento.",
        },
        {
          type: "paragraph",
          text: "Consent to receive promotional or marketing SMS messages is optional and is not a condition of receiving healthcare services.",
          textEs:
            "El consentimiento para recibir mensajes SMS promocionales o de mercadeo es opcional y no es una condición para recibir servicios de atención médica.",
        },
        {
          type: "paragraph",
          text: "You may withdraw your consent at any time.",
          textEs: "Puede retirar su consentimiento en cualquier momento.",
        },
      ],
    },
    {
      heading: "4. Message Frequency",
      headingEs: "4. Frecuencia de los Mensajes",
      blocks: [
        {
          type: "paragraph",
          text: "Message frequency varies based on your appointments, requested services, and communication preferences.",
          textEs:
            "La frecuencia de los mensajes varía según sus citas, los servicios solicitados y sus preferencias de comunicación.",
        },
      ],
    },
    {
      heading: "5. Message and Data Rates",
      headingEs: "5. Tarifas de Mensajes y Datos",
      blocks: [
        {
          type: "paragraph",
          text: "Message and data rates may apply depending on your mobile carrier and service plan.",
          textEs:
            "Pueden aplicarse tarifas de mensajes y datos según su operador de telefonía móvil y su plan de servicio.",
        },
        {
          type: "paragraph",
          text: "Kids & Teens Medical Group is not responsible for charges imposed by your mobile service provider.",
          textEs:
            "Kids & Teens Medical Group no se hace responsable de los cargos que imponga su proveedor de servicio móvil.",
        },
      ],
    },
    {
      heading: "6. Opt-Out Instructions",
      headingEs: "6. Instrucciones para Darse de Baja",
      blocks: [
        {
          type: "paragraph",
          text: "You can cancel the SMS service at any time by replying STOP to any text message from Kids & Teens Medical Group.",
          textEs:
            "Puede cancelar el servicio de SMS en cualquier momento respondiendo STOP a cualquier mensaje de texto de Kids & Teens Medical Group.",
        },
        {
          type: "paragraph",
          text: "After your opt-out request is processed, you may receive a final confirmation message. No further messages will be sent through the applicable SMS program unless you opt in again.",
          textEs:
            "Una vez procesada su solicitud de baja, es posible que reciba un último mensaje de confirmación. No se le enviarán más mensajes a través del programa de SMS correspondiente, a menos que vuelva a suscribirse.",
        },
      ],
    },
    {
      heading: "7. Help and Support",
      headingEs: "7. Ayuda y Soporte",
      blocks: [
        {
          type: "paragraph",
          text: "For assistance, reply HELP to any SMS message received from Kids & Teens Medical Group.",
          textEs:
            "Para obtener ayuda, responda HELP a cualquier mensaje SMS que reciba de Kids & Teens Medical Group.",
        },
        {
          type: "paragraph",
          text: "You may also visit our website at:",
          textEs: "También puede visitar nuestro sitio web en:",
          link: WEBSITE_LINK,
        },
      ],
    },
    {
      heading: "8. Privacy and Data Protection",
      headingEs: "8. Privacidad y Protección de Datos",
      blocks: [
        {
          type: "paragraph",
          text: "We respect your privacy and protect your personal information in accordance with our applicable privacy policies.",
          textEs:
            "Respetamos su privacidad y protegemos su información personal de acuerdo con nuestras políticas de privacidad aplicables.",
        },
        {
          type: "paragraph",
          text: "Mobile information and SMS opt-in consent will not be sold or shared with third parties or affiliates for marketing or promotional purposes.",
          textEs:
            "La información móvil y el consentimiento de suscripción a SMS no se venderán ni se compartirán con terceros ni con empresas afiliadas para fines de mercadeo o promocionales.",
        },
        {
          type: "paragraph",
          text: "For more information, please review our SMS Privacy Policy:",
          textEs: "Para obtener más información, consulte nuestra Política de Privacidad de SMS:",
          link: SMS_PRIVACY_LINK,
        },
      ],
    },
    {
      heading: "9. Message Delivery",
      headingEs: "9. Entrega de los Mensajes",
      blocks: [
        {
          type: "paragraph",
          text: "SMS delivery is subject to mobile carrier availability, network conditions, and other technical factors.",
          textEs:
            "La entrega de los SMS está sujeta a la disponibilidad del operador de telefonía móvil, las condiciones de la red y otros factores técnicos.",
        },
        {
          type: "paragraph",
          text: "Mobile carriers are not liable for delayed or undelivered messages.",
          textEs:
            "Los operadores de telefonía móvil no son responsables de los mensajes retrasados o no entregados.",
        },
        {
          type: "paragraph",
          text: "Kids & Teens Medical Group does not guarantee uninterrupted or error-free delivery of SMS communications.",
          textEs:
            "Kids & Teens Medical Group no garantiza la entrega ininterrumpida ni libre de errores de las comunicaciones por SMS.",
        },
      ],
    },
    {
      heading: "10. Medical Emergencies",
      headingEs: "10. Emergencias Médicas",
      blocks: [
        {
          type: "paragraph",
          text: "Our SMS messaging service is not intended for emergency medical communication.",
          textEs:
            "Nuestro servicio de mensajería SMS no está destinado a comunicaciones de emergencias médicas.",
        },
        {
          type: "paragraph",
          text: "If you are experiencing a medical emergency, call 911 immediately.",
          textEs: "Si tiene una emergencia médica, llame al 911 de inmediato.",
        },
        {
          type: "paragraph",
          text: "Do not use SMS messaging to communicate urgent medical concerns or emergencies.",
          textEs:
            "No use los mensajes SMS para comunicar problemas médicos urgentes ni emergencias.",
        },
      ],
    },
    {
      heading: "11. Changes to SMS Terms",
      headingEs: "11. Cambios a los Términos de SMS",
      blocks: [
        {
          type: "paragraph",
          text: "Kids & Teens Medical Group reserves the right to update these SMS Terms and Conditions as necessary.",
          textEs:
            "Kids & Teens Medical Group se reserva el derecho de actualizar estos Términos y Condiciones de SMS cuando sea necesario.",
        },
        {
          type: "paragraph",
          text: "Revised terms will be published on our official website with an updated effective date.",
          textEs:
            "Los términos revisados se publicarán en nuestro sitio web oficial con una fecha de vigencia actualizada.",
        },
      ],
    },
    {
      heading: "12. Contact Information",
      headingEs: "12. Información de Contacto",
      blocks: [
        {
          type: "paragraph",
          text: "Kids & Teens Medical Group",
          textEs: "Kids & Teens Medical Group",
        },
        { type: "paragraph", text: "Website:", textEs: "Sitio web:", link: WEBSITE_LINK },
        {
          type: "paragraph",
          text: "For SMS-related questions or assistance, please contact us through our official website.",
          textEs:
            "Si tiene preguntas o necesita ayuda relacionada con los SMS, comuníquese con nosotros a través de nuestro sitio web oficial.",
        },
      ],
    },
  ],
};
