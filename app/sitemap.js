export default function sitemap() {
  const baseUrl = "https://tuktukcartagena.com";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "es-ES": baseUrl,
          "en-GB": `${baseUrl}?lang=en`,
          "de-DE": `${baseUrl}?lang=de`,
          "fr-FR": `${baseUrl}?lang=fr`,
          "x-default": baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}?lang=en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}?lang=de`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}?lang=fr`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
