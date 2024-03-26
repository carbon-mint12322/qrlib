async function finReportRender(_schemaId: string, data: any): Promise<string> {
  return `
  <html>
    <head>
      <title>Financial Report</title>
    </head>
    <body>
      <pre>
      ${JSON.stringify(data, null, 2)}
      </pre>
    </body>
  </html>
  `;
}

export default finReportRender;
