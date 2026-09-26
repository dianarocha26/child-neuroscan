// Curated external links for the Resources and Community screens.
// `flagged` marks links the owner marked with a warning sign in the source list.

export interface SupportLink {
  name: string;
  url: string;
  flagged?: boolean;
}

export interface LinkGroup {
  title: string;
  en: SupportLink[];
  es: SupportLink[];
}

export const RESOURCE_GROUPS: LinkGroup[] = [
  {
    title: 'Autism Spectrum Disorder',
    en: [
      { name: 'Autism Society', url: 'https://autismsociety.org' },
      { name: 'Autistic Self Advocacy Network (ASAN)', url: 'https://autisticadvocacy.org' },
    ],
    es: [
      { name: 'Organization for Autism Research: recursos en español', url: 'https://researchautism.org/families/spanish-language-resources/' },
      { name: 'Duke Center for Autism: recursos en español', url: 'https://autismcenter.duke.edu/resources/recursos-en-espanol' },
      { name: 'Autismo España', url: 'https://autismo.org.es/' },
    ],
  },
  {
    title: 'ADHD',
    en: [
      { name: 'CHADD', url: 'https://chadd.org' },
      { name: 'ADDitude', url: 'https://www.additudemag.com' },
    ],
    es: [
      { name: 'CHADD en español', url: 'https://chadd.org/understanding-adhd/recursos-en-espanol/' },
      { name: 'Understood: familias hispanas', url: 'https://www.understood.org/es-mx/topics/familias-hispanas' },
      { name: 'Fundación CADAH: guías para padres', url: 'https://www.fundacioncadah.org/web/' },
    ],
  },
  {
    title: 'Speech & Language Delay',
    en: [{ name: 'ASHA', url: 'https://www.asha.org' }],
    es: [
      { name: 'ASHA en español', url: 'https://www.asha.org/public/espanol/' },
      { name: 'ASHA: intervención temprana', url: 'https://www.asha.org/public/speech/spanish/servicios-de-intervencion-temprana/' },
    ],
  },
  {
    title: 'Developmental Delay',
    en: [
      { name: 'CDC: Learn the Signs. Act Early.', url: 'https://www.cdc.gov/act-early/index.html' },
      { name: 'Florida Early Steps (ages 0–3, free)', url: 'https://floridaearlysteps.com/about/' },
    ],
    es: [
      { name: 'CDC: Aprenda los signos. Reaccione pronto.', url: 'https://www.cdc.gov/act-early/es/index.html' },
      { name: 'App gratis "Sigamos el Desarrollo"', url: 'https://www.cdc.gov/act-early/es/milestones-app/index.html' },
    ],
  },
  {
    title: 'Learning Disorders',
    en: [
      { name: 'International Dyslexia Association', url: 'https://dyslexiaida.org' },
      { name: 'Understood', url: 'https://www.understood.org' },
    ],
    es: [{ name: 'IDA: hojas informativas', url: 'https://dyslexiaida.org/hojas-informativas/' }],
  },
  {
    title: 'Sensory Processing Disorder',
    en: [
      { name: 'STAR Institute', url: 'https://sensoryhealth.org/' },
      { name: 'STAR Institute: resources for parents', url: 'https://sensoryhealth.org/basic/resources-for-parents-and-professionals' },
    ],
    es: [],
  },
  {
    title: 'Tourette Syndrome',
    en: [{ name: 'Tourette Association of America', url: 'https://tourette.org' }],
    es: [
      { name: 'Tourette Association en español', url: 'https://tourette.org/about-tourette/overview/espanol/' },
      { name: 'Viviendo con Tourette', url: 'https://tourette.org/about-tourette/overview/espanol/viviendo-con-tourette/' },
    ],
  },
  {
    title: 'Epilepsy',
    en: [{ name: 'Epilepsy Foundation', url: 'https://www.epilepsy.com' }],
    es: [
      { name: 'Epilepsy Foundation en español', url: 'https://www.epilepsy.com/espanol' },
      { name: 'Epilepsy Foundation: más información y recursos', url: 'https://www.epilepsy.com/espanol/mas-informacion-y-recursos' },
    ],
  },
  {
    title: 'Cerebral Palsy',
    en: [
      { name: 'Cerebral Palsy Foundation', url: 'https://www.cerebralpalsyfoundation.org' },
      { name: 'CP Family Network', url: 'https://cpfamilynetwork.org' },
    ],
    es: [
      { name: 'CDC: tratamientos para la parálisis cerebral', url: 'https://www.cdc.gov/cerebral-palsy/es/treatment/tratamientos-e-intervenciones-para-la-paralisis-cerebral-infantil.html' },
      { name: 'NIH (NICHD): recursos para familias', url: 'https://espanol.nichd.nih.gov/salud/temas/cerebral-palsy/recursos/pacientes' },
      { name: "Shriners Children's", url: 'https://www.shrinerschildrens.org/es/pediatric-care/cerebral-palsy' },
    ],
  },
  {
    title: 'Intellectual Developmental Disorder',
    en: [{ name: 'The Arc', url: 'https://thearc.org' }],
    es: [{ name: 'The Arc of Texas: recursos en español', url: 'https://www.thearcoftexas.org/resources/' }],
  },
];

export const LOCAL_RESOURCES: { title: string; links: SupportLink[] } = {
  title: 'Local resources in Miami',
  links: [
    { name: 'UM-NSU CARD (free for families with autism)', url: 'https://www.card.miami.edu/' },
    { name: 'Family Network on Disabilities', url: 'https://fndusa.org/' },
    { name: 'Shake-A-Leg Miami', url: 'https://www.shakealegmiami.org' },
  ],
};

export const COMMUNITY_GROUPS: LinkGroup[] = [
  {
    title: 'Autism Spectrum Disorder',
    en: [
      { name: 'r/Autism_Parenting (for parents)', url: 'https://www.reddit.com/r/Autism_Parenting/' },
      { name: 'r/autism (autistic people)', url: 'https://www.reddit.com/r/autism/' },
    ],
    es: [],
  },
  {
    title: 'ADHD',
    en: [
      { name: 'r/ADHDparenting (for parents)', url: 'https://www.reddit.com/r/ADHDparenting/' },
      { name: 'r/ADHD', url: 'https://www.reddit.com/r/ADHD/' },
    ],
    es: [{ name: 'r/TDAH', url: 'https://www.reddit.com/r/TDAH/', flagged: true }],
  },
  {
    title: 'Speech & Language Delay',
    en: [{ name: 'r/speechdelay (for parents)', url: 'https://www.reddit.com/r/speechdelay/', flagged: true }],
    es: [],
  },
  {
    title: 'Developmental Delay',
    en: [{ name: 'r/specialneedsparenting (for parents)', url: 'https://www.reddit.com/r/specialneedsparenting/', flagged: true }],
    es: [],
  },
  {
    title: 'Learning Disorders',
    en: [
      { name: 'r/Dyslexia', url: 'https://www.reddit.com/r/Dyslexia/' },
      { name: 'r/dyscalculia', url: 'https://www.reddit.com/r/dyscalculia/' },
    ],
    es: [],
  },
  {
    title: 'Sensory Processing Disorder',
    en: [{ name: 'r/SensoryProcessingDisorder', url: 'https://www.reddit.com/r/SensoryProcessingDisorder/', flagged: true }],
    es: [],
  },
  {
    title: 'Tourette Syndrome',
    en: [{ name: 'r/Tourettes', url: 'https://www.reddit.com/r/Tourettes/' }],
    es: [],
  },
  {
    title: 'Epilepsy',
    en: [{ name: 'r/Epilepsy', url: 'https://www.reddit.com/r/Epilepsy/' }],
    es: [],
  },
  {
    title: 'Cerebral Palsy',
    en: [{ name: 'r/CerebralPalsy', url: 'https://www.reddit.com/r/CerebralPalsy/' }],
    es: [],
  },
  {
    title: 'Intellectual Developmental Disorder',
    en: [
      { name: 'r/DownSyndrome', url: 'https://www.reddit.com/r/DownSyndrome/' },
      { name: 'r/IntellectualDisability', url: 'https://www.reddit.com/r/IntellectualDisability/', flagged: true },
    ],
    es: [],
  },
  {
    title: 'All conditions',
    en: [
      { name: 'r/disability', url: 'https://www.reddit.com/r/disability/' },
      { name: 'r/specialed', url: 'https://www.reddit.com/r/specialed/' },
    ],
    es: [],
  },
];

export const LINKS_DISCLAIMER = {
  en: 'These are independent organizations and communities. Child NeuroScan is not affiliated with them, and they do not replace professional medical advice.',
  es: 'Estas son organizaciones y comunidades independientes. Child NeuroScan no está afiliado a ellas y no sustituyen el consejo médico profesional.',
};
