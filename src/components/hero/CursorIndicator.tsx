/**
 * Tiny animated hint: a cursor gliding across three zone marks.
 * While the visitor is actually hovering the hero, the demo loop stops and
 * the cursor sits on the active zone (driven by `data-zone` on the hero).
 * On touch screens it becomes a soft tap pulse instead.
 */
export default function CursorIndicator() {
  return (
    <span className="cursor-ind" aria-hidden="true">
      <span className="cursor-ind__track">
        <i data-mark="left" />
        <i data-mark="center" />
        <i data-mark="right" />
      </span>
      <span className="cursor-ind__pointer">
        <span className="cursor-ind__ring" />
        <svg viewBox="0 0 14 18" width="12" height="15">
          <path
            d="M1.5 1.2v13.4l3.4-3.3 2.3 5.2 2.4-1.05-2.3-5.15h4.75z"
            fill="currentColor"
            stroke="#fff"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}
