import { cn } from '../../utils/cn';

/**
 * Trust badge grid for research journal logos.
 * Displays grayscale logos that colorize on hover.
 *
 * @param {object} props
 * @param {Array<{src: string, alt: string}>} props.logos
 * @param {string} [props.className]
 */
function TrustBadge({ logos = [], className, ...props }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center',
        className,
      )}
      {...props}
    >
      {logos.map((logo, index) => (
        <div key={index} className="flex items-center justify-center px-2">
          <img
            src={logo.src}
            alt={logo.alt}
            className={cn(
              'max-h-8 w-auto object-contain',
              'grayscale opacity-50',
              'hover:grayscale-0 hover:opacity-100',
              'transition-all duration-300',
            )}
          />
        </div>
      ))}
    </div>
  );
}

TrustBadge.displayName = 'TrustBadge';

export { TrustBadge };
export default TrustBadge;
