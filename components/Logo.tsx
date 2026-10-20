/* eslint-disable @next/next/no-img-element */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="brand">
      <img src={light ? '/rmi-logo-dark.svg' : '/rmi-logo-light.svg'} alt="" width={26} height={32} />
      <span><b>RMI</b>Agentic</span>
    </span>
  );
}
