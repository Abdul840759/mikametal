export default function MikaMascot({ alt = '' }: { alt?: string }) {
  return <img className="mika-mascot-image" src="/images/mika-mascot.png" alt={alt} aria-hidden={alt ? undefined : true} />
}
