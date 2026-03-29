import { cn } from '../../utils/cn';

/**
 * Responsive page wrapper.
 * Max-width: 1280px, centered with responsive padding.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {'default'|'narrow'|'wide'} [props.size='default']
 */

const sizeStyles = {
  narrow: 'max-w-3xl',
  default: 'max-w-[1280px]',
  wide: 'max-w-[1440px]',
};

function PageContainer({ size = 'default', className, children, ...props }) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        'px-5 md:px-8 lg:px-16',
        'py-8 md:py-12 lg:py-16',
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

PageContainer.displayName = 'PageContainer';

export { PageContainer };
export default PageContainer;
