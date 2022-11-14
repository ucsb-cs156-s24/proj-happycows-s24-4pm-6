// based in part on this SO answer: https://codereview.stackexchange.com/a/211511

export default function Plaintext({text}) {
  const [firstLine, ...rest] = text.split('\n')
  return (
    <pre>
      <span>{ firstLine }</span>
      {
        rest.map((line) => (
          <>
            <br />
            <span>{ line }</span>
          </>
        ))
      }
    </pre>
  );
}