// Serverseitig gerendertes JSON-LD. `<` wird escaped, damit ein Wert nie
// das <script>-Tag schließen kann.
export default function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
