async function qrRender(_schemaId: string, data: any): Promise<string> {
  return `
  <html>
    <body>
      <pre>
      ${JSON.stringify(data, null, 2)}
      </pre>
    </body>
  </html>
  `;
}

export default qrRender;
