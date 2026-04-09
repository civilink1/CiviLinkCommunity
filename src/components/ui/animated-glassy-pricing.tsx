import React from 'react';
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";

// --- Internal Helper --- //

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// --- EXPORTED Building Blocks --- //

export interface PricingCardProps {
  planName: string;
  description: string;
  /** Pass a numeric string like "29" for $29/mo, or any string for custom display */
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
  /** When true, renders price as-is without $ or /mo suffix */
  customPricing?: boolean;
  /** Called when the card's action button is clicked */
  onButtonClick?: () => void;
}

export const PricingCard = ({
  planName,
  description,
  price,
  features,
  buttonText,
  isPopular = false,
  buttonVariant = 'primary',
  customPricing = false,
  onButtonClick,
}: PricingCardProps) => {
  const cardClasses = `
    backdrop-blur-[14px] bg-gradient-to-br rounded-2xl shadow-xl flex-1 w-full px-7 py-8 flex flex-col transition-all duration-300
    from-white/10 to-white/5 border border-white/10 backdrop-brightness-[0.91]
    ${isPopular ? 'relative ring-2 ring-cyan-400/30 from-white/20 to-white/10 border-cyan-400/30 shadow-2xl' : ''}
  `.trim();

  const primaryBtnClasses = "w-full py-2.5 rounded-xl font-semibold text-[14px] transition bg-cyan-400 hover:bg-cyan-300 text-slate-900";
  const secondaryBtnClasses = "w-full py-2.5 rounded-xl font-semibold text-[14px] transition bg-white/10 hover:bg-white/20 text-white border border-white/20";

  return (
    <div className={cardClasses}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-3 py-1 text-[12px] font-semibold rounded-full bg-cyan-400 text-slate-900">
          Most Popular
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-[36px] font-extralight tracking-[-0.03em] text-white">{planName}</h2>
        <p className="text-[14px] text-white/70 mt-1">{description}</p>
      </div>
      <div className="my-5 flex items-baseline gap-2">
        {customPricing ? (
          <span className="text-[40px] font-extralight text-white">{price}</span>
        ) : (
          <>
            <span className="text-[40px] font-extralight text-white">${price}</span>
            <span className="text-[13px] text-white/70">/mo</span>
          </>
        )}
      </div>
      <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <ul className="flex flex-col gap-2 text-[13px] text-white/90 mb-6 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon className="text-cyan-400 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <RippleButton
        className={buttonVariant === 'primary' ? primaryBtnClasses : secondaryBtnClasses}
        onClick={onButtonClick}
      >
        {buttonText}
      </RippleButton>
    </div>
  );
};

// --- EXPORTED Full Page Component --- //

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  /** Kept for API compatibility — no animated background is rendered */
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
}: ModernPricingPageProps) => {
  return (
    <div className="bg-background text-foreground min-h-screen w-full overflow-x-hidden">
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl mx-auto text-center mb-14">
          <h1 className="text-[48px] md:text-[64px] font-extralight leading-tight tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-cyan-500 to-blue-600 dark:from-white dark:via-cyan-300 dark:to-blue-400">
            {title}
          </h1>
          <p className="mt-3 text-[16px] md:text-[20px] text-foreground/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center w-full max-w-4xl">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </main>
    </div>
  );
};
