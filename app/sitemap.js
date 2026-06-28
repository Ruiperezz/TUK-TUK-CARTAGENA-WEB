export default function sitemap() {
  const baseUrl = "https://tuktukcartagena.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}?lang=en`,
          de: `${baseUrl}?lang=de`,
          fr: `${baseUrl}?lang=fr`,
        },
      },
    },
  ];
}
