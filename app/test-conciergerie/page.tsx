'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import translationsData from './translations.json';

// Text run names in the Rive file (must match the Text Run node names in the Rive editor).
const CONCIERGERIE_TEXT_RUNS = [
  'input-placeholder',
  'question-1',
  'advisor',
  'reply-1',
  'reply-2',
  'food-option-1',
  'food-option-2',
] as const;

export type ConciergerieTextRuns = {
  [K in (typeof CONCIERGERIE_TEXT_RUNS)[number]]: string;
};

// Venue sourcing Rive text runs (venue-sourcing-data.riv).
const VENUE_SOURCING_TEXT_RUNS = [
  'location-1',
  'city-1',
  'type-1',
  'location-2',
  'city-2',
  'type-2',
  'location-3',
  'city-3',
  'type-3',
] as const;

export type VenueSourcingTextRuns = {
  [K in (typeof VENUE_SOURCING_TEXT_RUNS)[number]]: string;
};

// Centralized invoices Rive text runs (centralizedinvoices-data.riv).
const CENTRALIZED_INVOICES_TEXT_RUNS = [
  'invoice-1',
  'invoice-2',
  'invoice-3',
  'invoice-4',
  'invoice-new',
] as const;

export type CentralizedInvoicesTextRuns = {
  [K in (typeof CENTRALIZED_INVOICES_TEXT_RUNS)[number]]: string;
};

// Procurement Rive text runs (procurement-data.riv).
const PROCUREMENT_TEXT_RUNS = [
  'policies',
  'budget-approved',
  'policy-compliant',
  'manager',
  'approved',
  'pending',
] as const;

export type ProcurementTextRuns = {
  [K in (typeof PROCUREMENT_TEXT_RUNS)[number]]: string;
};

// Rive files.
const CONCIERGERIE_RIV = '/rive/conciergerie-v2.riv';
const VENUE_SOURCING_RIV = '/rive/venue-sourcing-data.riv';
const CENTRALIZED_INVOICES_RIV = '/rive/centralizedinvoices-data.riv';
const PROCUREMENT_RIV = '/rive/procurement-data.riv';

// Artboard that contains the text runs. Must match the artboard name in your .riv.
const ARTBOARD_NAME = 'main';

const languageLabels: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
  de: 'DE',
};

type Language = keyof typeof translationsData;

const RIVE_HEIGHT = 360;

function applyTextRuns(
  rive: { setTextRunValue: (name: string, value: string) => void },
  texts: ConciergerieTextRuns
): boolean {
  try {
    for (const run of CONCIERGERIE_TEXT_RUNS) {
      rive.setTextRunValue(run, texts[run] ?? '');
    }
    return true;
  } catch {
    return false;
  }
}

function applyVenueSourcingTextRuns(
  rive: { setTextRunValue: (name: string, value: string) => void },
  texts: VenueSourcingTextRuns
): boolean {
  try {
    for (const run of VENUE_SOURCING_TEXT_RUNS) {
      rive.setTextRunValue(run, texts[run] ?? '');
    }
    return true;
  } catch {
    return false;
  }
}

function applyCentralizedInvoicesTextRuns(
  rive: { setTextRunValue: (name: string, value: string) => void },
  texts: CentralizedInvoicesTextRuns
): boolean {
  try {
    for (const run of CENTRALIZED_INVOICES_TEXT_RUNS) {
      rive.setTextRunValue(run, texts[run] ?? '');
    }
    return true;
  } catch {
    return false;
  }
}

function applyProcurementTextRuns(
  rive: { setTextRunValue: (name: string, value: string) => void },
  texts: ProcurementTextRuns
): boolean {
  try {
    for (const run of PROCUREMENT_TEXT_RUNS) {
      rive.setTextRunValue(run, texts[run] ?? '');
    }
    return true;
  } catch {
    return false;
  }
}

function ConciergerieRive({ texts }: { texts: ConciergerieTextRuns }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRunExistsRef = useRef<boolean | null>(null);
  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: CONCIERGERIE_RIV,
      artboard: ARTBOARD_NAME,
      animations: ['on', 'off'],
      autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomRight }),
      onRiveReady: (r) => {
        if (textRunExistsRef.current === false) return;
        textRunExistsRef.current = applyTextRuns(r, texts);
      },
    },
    { shouldResizeCanvasToContainer: true }
  );

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setContainerRef(el);
    },
    [setContainerRef]
  );

  // Update all text runs when language (texts) changes; initial set is done in onRiveReady.
  // Stop + play current state so the animation redraws and the new text is visible without re-hovering.
  useEffect(() => {
    if (!rive || textRunExistsRef.current !== true) return;
    if (applyTextRuns(rive, texts)) {
      rive.stop();
      rive.play('off');
    } else {
      textRunExistsRef.current = false;
    }
  }, [rive, texts]);

  useEffect(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  useEffect(() => {
    if (!rive || !containerRef.current) return;
    const el = containerRef.current;
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (!rive || !el || el.offsetWidth <= 0 || el.offsetHeight <= 0) return;
        rive.resizeDrawingSurfaceToCanvas();
        rive.stop();
        rive.play('off');
      });
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [rive]);

  const playOn = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('on');
  }, [rive]);

  const playOff = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  return (
    <div
      ref={setRef}
      className="relative w-full overflow-hidden block leading-[0] bg-[#F5F6F8] rounded-lg"
      style={{
        height: RIVE_HEIGHT,
        minHeight: RIVE_HEIGHT,
        minWidth: 1,
      }}
      onMouseEnter={playOn}
      onMouseLeave={playOff}
    >
      <RiveComponent />
    </div>
  );
}

function VenueSourcingRive({ texts }: { texts: VenueSourcingTextRuns }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRunExistsRef = useRef<boolean | null>(null);
  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: VENUE_SOURCING_RIV,
      artboard: ARTBOARD_NAME,
      animations: ['on', 'off'],
      autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomRight }),
      onRiveReady: (r) => {
        if (textRunExistsRef.current === false) return;
        textRunExistsRef.current = applyVenueSourcingTextRuns(r, texts);
      },
    },
    { shouldResizeCanvasToContainer: true }
  );

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setContainerRef(el);
    },
    [setContainerRef]
  );

  useEffect(() => {
    if (!rive || textRunExistsRef.current !== true) return;
    if (applyVenueSourcingTextRuns(rive, texts)) {
      rive.stop();
      rive.play('off');
    } else {
      textRunExistsRef.current = false;
    }
  }, [rive, texts]);

  useEffect(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  useEffect(() => {
    if (!rive || !containerRef.current) return;
    const el = containerRef.current;
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (!rive || !el || el.offsetWidth <= 0 || el.offsetHeight <= 0) return;
        rive.resizeDrawingSurfaceToCanvas();
        rive.stop();
        rive.play('off');
      });
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [rive]);

  const playOn = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('on');
  }, [rive]);

  const playOff = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  return (
    <div
      ref={setRef}
      className="relative w-full overflow-hidden block leading-[0] bg-[#F5F6F8] rounded-lg"
      style={{
        height: RIVE_HEIGHT,
        minHeight: RIVE_HEIGHT,
        minWidth: 1,
      }}
      onMouseEnter={playOn}
      onMouseLeave={playOff}
    >
      <RiveComponent />
    </div>
  );
}

function CentralizedInvoicesRive({ texts }: { texts: CentralizedInvoicesTextRuns }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRunExistsRef = useRef<boolean | null>(null);
  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: CENTRALIZED_INVOICES_RIV,
      artboard: ARTBOARD_NAME,
      animations: ['on', 'off'],
      autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomRight }),
      onRiveReady: (r) => {
        if (textRunExistsRef.current === false) return;
        textRunExistsRef.current = applyCentralizedInvoicesTextRuns(r, texts);
      },
    },
    { shouldResizeCanvasToContainer: true }
  );

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setContainerRef(el);
    },
    [setContainerRef]
  );

  useEffect(() => {
    if (!rive || textRunExistsRef.current !== true) return;
    if (applyCentralizedInvoicesTextRuns(rive, texts)) {
      rive.stop();
      rive.play('off');
    } else {
      textRunExistsRef.current = false;
    }
  }, [rive, texts]);

  useEffect(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  useEffect(() => {
    if (!rive || !containerRef.current) return;
    const el = containerRef.current;
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (!rive || !el || el.offsetWidth <= 0 || el.offsetHeight <= 0) return;
        rive.resizeDrawingSurfaceToCanvas();
        rive.stop();
        rive.play('off');
      });
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [rive]);

  const playOn = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('on');
  }, [rive]);

  const playOff = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  return (
    <div
      ref={setRef}
      className="relative w-full overflow-hidden block leading-[0] bg-[#F5F6F8] rounded-lg"
      style={{
        height: RIVE_HEIGHT,
        minHeight: RIVE_HEIGHT,
        minWidth: 1,
      }}
      onMouseEnter={playOn}
      onMouseLeave={playOff}
    >
      <RiveComponent />
    </div>
  );
}

function ProcurementRive({ texts }: { texts: ProcurementTextRuns }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRunExistsRef = useRef<boolean | null>(null);
  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: PROCUREMENT_RIV,
      artboard: ARTBOARD_NAME,
      animations: ['on', 'off'],
      autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomRight }),
      onRiveReady: (r) => {
        if (textRunExistsRef.current === false) return;
        textRunExistsRef.current = applyProcurementTextRuns(r, texts);
      },
    },
    { shouldResizeCanvasToContainer: true }
  );

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setContainerRef(el);
    },
    [setContainerRef]
  );

  useEffect(() => {
    if (!rive || textRunExistsRef.current !== true) return;
    if (applyProcurementTextRuns(rive, texts)) {
      rive.stop();
      rive.play('off');
    } else {
      textRunExistsRef.current = false;
    }
  }, [rive, texts]);

  useEffect(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  useEffect(() => {
    if (!rive || !containerRef.current) return;
    const el = containerRef.current;
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (!rive || !el || el.offsetWidth <= 0 || el.offsetHeight <= 0) return;
        rive.resizeDrawingSurfaceToCanvas();
        rive.stop();
        rive.play('off');
      });
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [rive]);

  const playOn = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('on');
  }, [rive]);

  const playOff = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  return (
    <div
      ref={setRef}
      className="relative w-full overflow-hidden block leading-[0] bg-[#F5F6F8] rounded-lg"
      style={{
        height: RIVE_HEIGHT,
        minHeight: RIVE_HEIGHT,
        minWidth: 1,
      }}
      onMouseEnter={playOn}
      onMouseLeave={playOff}
    >
      <RiveComponent />
    </div>
  );
}

type TranslationsByLanguage = {
  conciergerie: ConciergerieTextRuns;
  venueSourcing: VenueSourcingTextRuns;
  centralizedInvoices: CentralizedInvoicesTextRuns;
  procurement: ProcurementTextRuns;
};

const translations = translationsData as Record<Language, TranslationsByLanguage>;

export default function TestConciergeriePage() {
  const [language, setLanguage] = useState<Language>('en');
  const texts = translations[language] ?? translations.en;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-medium text-[#212721]">Conciergerie</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#737876] mr-1">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-9 px-3 rounded-md border border-black/10 bg-white text-[#212721] text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10"
              aria-label="Select language"
            >
              {(Object.keys(translations) as Language[]).map((lang) => (
                <option key={lang} value={lang}>
                  {languageLabels[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <p className="text-sm text-[#737876] mb-4">
          The text inside the Rive animations updates when you change the language.
        </p>
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#212721] mb-3">Conciergerie</h2>
          <ConciergerieRive texts={texts.conciergerie} />
        </section>
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#212721] mb-3">Venue sourcing</h2>
          <VenueSourcingRive texts={texts.venueSourcing} />
        </section>
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#212721] mb-3">Centralized invoices</h2>
          <CentralizedInvoicesRive texts={texts.centralizedInvoices} />
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#212721] mb-3">Procurement</h2>
          <ProcurementRive texts={texts.procurement} />
        </section>
      </main>
    </div>
  );
}
