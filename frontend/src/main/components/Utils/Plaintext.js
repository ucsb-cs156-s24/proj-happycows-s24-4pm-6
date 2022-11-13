// based in part on this SO answer: https://codereview.stackexchange.com/a/211511

export default function Plaintext({text}) {
  const [firstLine, ...rest] = text.split('\n')
  return (
    <pre>
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