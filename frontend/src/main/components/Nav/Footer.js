import { Container } from "react-bootstrap";

export default function Footer({systemInfo}) {
  return (
    <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5">
      <Container>
        <p data-testid="footer-content">
          HappyCows is a project of <a href="https://devries.chem.ucsb.edu/mattanjah-de-vries">Mattanjah de Vries</a>, 
          Distinguished Professor of Chemistry at UC Santa Barbara. 
          The open source code is <a data-testid="github-href" href={systemInfo?.sourceRepo}>available on GitHub</a>. 
        </p>
        
      </Container>
    </footer>
  );
}