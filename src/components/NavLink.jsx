import Svg from "@/components/Svg";
import UlNavLink from "@/components/UlNavLink";

export default function NavLink({ title, c, children, navSvg }) {
  return (
    <nav className={c}>
      <UlNavLink title={title} c={c}>
        <Svg className="navSvg" title="Request" c={"nav-svg"}>
          {navSvg}
        </Svg>
      </UlNavLink>
      <div className="hidden group-hover:block absolute top-7 pt-5">
        <div className="w-max border-t-2 border-t-stone-900 rounded-b-lg border border-stone-700 bg-stone-50 px-2">
          {children}
        </div>
      </div>
    </nav>
  );
}
