import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb component
 * @param {Array} items - [{ label, href }] — last item is current (no href)
 * @param {boolean} showHome - prepend home icon
 */
export default function Breadcrumb({ items = [], showHome = true }) {
  const allItems = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {allItems.map((item, idx) => {
        const isLast = idx === allItems.length - 1;
        return (
          <div key={idx} className="breadcrumb-item">
            {idx > 0 && (
              <ChevronRight size={14} className="breadcrumb-separator" aria-hidden="true" />
            )}
            {isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {idx === 0 && showHome ? <Home size={14} /> : item.label}
              </span>
            ) : (
              <Link to={item.href} className="breadcrumb-link">
                {idx === 0 && showHome ? <Home size={14} /> : item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
