// based in part on this SO answer: https://codereview.stackexchange.com/a/211511

export default function Plaintext({text, dataTestId}) {
  console.log("text=", text);
  const [firstLine, ...rest] = text.split('\n')
  return (
    <pre data-testid={dataTestId}>
      { firstLine }
      {
        rest.map(line => (
          <>
            <br />
            { line }
          </>
        ))
      }
    </pre>
  );
}