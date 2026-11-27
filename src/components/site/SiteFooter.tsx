import { LINKS } from './links';
import { Container } from './ui';

export default function SiteFooter() {
  const link = 'rounded hover:underline hover:underline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent';
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-wrap justify-between gap-x-5 gap-y-3 py-6 font-label text-xs tracking-[0.03em] text-muted">
        <span>Superhuman Lab</span>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <a className={link} href={LINKS.resultsInstagram} target="_blank" rel="noopener noreferrer">
            @superhumanlab.fit
          </a>
          <a className={link} href={LINKS.satyaInstagram} target="_blank" rel="noopener noreferrer">
            @satyajitkumthekar
          </a>
          <span>superhumanlab.fit</span>
        </span>
      </Container>
    </footer>
  );
}
