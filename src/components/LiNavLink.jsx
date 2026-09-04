import { Link } from "react-router-dom";

// 1. Membuat komponen Wrapper (Parent)
export default function ChildNavLink({ title, c, url, children }) {
  return (
    <Link className={c} to={url}>
      {children}
      <span className="ml-2 text-base">{title}</span>
    </Link>
  );
}
