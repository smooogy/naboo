'use client';

import { useRouter } from 'next/navigation';
import { Search } from '@/components/ui/Search';
import { BookingCard } from '@/components/BookingCard';

export default function Home() {
  const router = useRouter();

  const handleFieldClick = (fieldId: string) => {
    console.log('Field clicked:', fieldId);
  };

  const handleSearch = () => {
    console.log('Search clicked');
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-background-default flex flex-col items-center justify-center p-8 gap-8">
      <div className="w-full max-w-3xl">
        <h2 className="text-lg font-medium mb-4">With Labels (default)</h2>
        <Search 
          onFieldClick={handleFieldClick}
          onSearch={handleSearch}
          showLabels={true}
        />
      </div>
      <div className="w-full max-w-3xl">
        <h2 className="text-lg font-medium mb-4">Without Labels</h2>
        <Search 
          onFieldClick={handleFieldClick}
          onSearch={handleSearch}
          showLabels={false}
        />
      </div>
      <div className="w-full max-w-3xl">
        <h2 className="text-lg font-medium mb-4">BookingCard Component</h2>
        <BookingCard
          price={25000}
          pricePerPerson={45}
          defaultStayType="Corporate retreat"
          defaultGuests={320}
          defaultDates="Feb 03, 2026 - Feb 21, 2026"
          onQuoteRequest={(data) => {
            console.log('Quote requested:', data);
            alert(`Quote requested:\nStay Type: ${data.stayType}\nGuests: ${data.guests}\nDates: ${data.dates}`);
          }}
        />
      </div>
    </div>
  );
}
