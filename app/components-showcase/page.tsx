'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search } from '@/components/ui/Search';
import { colors, typography, spacing, shadows } from '@/tokens';

export default function ComponentsShowcase() {
  return (
    <div className="min-h-screen bg-background-default p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-medium mb-2 tracking-tighter">Naboo Component Library</h1>
          <p className="text-grey text-lg">Design system showcase and iteration space</p>
        </div>

        {/* Design Tokens Section */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Design Tokens</h2>
          
          {/* Colors */}
          <Card className="mb-6">
            <h3 className="text-xl font-medium mb-4">Colors</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-grey mb-3">Primary</h4>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-24 h-24 rounded border" style={{ backgroundColor: colors.primary.DEFAULT }} />
                  <p className="text-xs mt-2 font-medium">Primary</p>
                  <p className="text-xs text-grey">{colors.primary.DEFAULT}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded border" style={{ backgroundColor: colors.primary.light }} />
                  <p className="text-xs mt-2 font-medium">Light</p>
                  <p className="text-xs text-grey">{colors.primary.light}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded border" style={{ backgroundColor: colors.primary.lighter }} />
                  <p className="text-xs mt-2 font-medium">Lighter</p>
                  <p className="text-xs text-grey">{colors.primary.lighter}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-grey mb-3">Neutrals</h4>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-24 h-24 rounded border border-border" style={{ backgroundColor: colors.black }} />
                  <p className="text-xs mt-2 font-medium">Black</p>
                  <p className="text-xs text-grey">{colors.black}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded border border-border" style={{ backgroundColor: colors.white }} />
                  <p className="text-xs mt-2 font-medium">White</p>
                  <p className="text-xs text-grey">{colors.white}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded border" style={{ backgroundColor: colors.grey.DEFAULT }} />
                  <p className="text-xs mt-2 font-medium">Grey</p>
                  <p className="text-xs text-grey">{colors.grey.DEFAULT}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded border" style={{ backgroundColor: colors.grey.light }} />
                  <p className="text-xs mt-2 font-medium">Grey Light</p>
                  <p className="text-xs text-grey">{colors.grey.light}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card>
            <h3 className="text-xl font-medium mb-4">Typography</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-grey mb-2">Font Families</p>
                <div className="space-y-2">
                  <p className="font-sans">TWK Lausanne (Sans)</p>
                  <p className="font-display">TT Hoves Pro Trial Variable (Display)</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-grey mb-2">Font Sizes</p>
                <div className="space-y-3">
                  {Object.entries(typography.fontSize).map(([key, value]) => (
                    <div key={key}>
                      <p style={{ fontSize: value }} className="mb-1">
                        {key}: {value} - The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-grey mb-2">Font Weights</p>
                <div className="space-y-2">
                  <p className="font-normal">Normal (400)</p>
                  <p className="font-medium">Medium (500)</p>
                  <p className="font-semibold">Semibold (550)</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Spacing */}
          <Card className="mt-6">
            <h3 className="text-xl font-medium mb-4">Spacing</h3>
            <div className="space-y-2">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-grey">{key}</div>
                  <div className="flex-1 h-4 bg-primary-lighter rounded" style={{ width: value }} />
                  <div className="text-xs text-grey">{value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shadows */}
          <Card className="mt-6">
            <h3 className="text-xl font-medium mb-4">Shadows</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(shadows).map(([key, value]) => (
                <div key={key} className="p-6 bg-white rounded border border-border" style={{ boxShadow: value }}>
                  <p className="text-sm font-medium mb-1">{key}</p>
                  <p className="text-xs text-grey break-all">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Buttons</h2>
          <Card>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button isLoading>Loading</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <span>Submit a brief</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Inputs</h2>
          <Card>
            <div className="space-y-6 max-w-md">
              <Input label="Default Input" placeholder="Enter text..." />
              <Input label="With Value" defaultValue="Some value" />
              <Input label="Error State" error="This field is required" />
              <Input label="Disabled" disabled placeholder="Disabled input" />
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default">
              <h3 className="font-medium mb-2">Default Card</h3>
              <p className="text-grey text-sm">This is a default card with border and shadow</p>
            </Card>
            <Card variant="elevated">
              <h3 className="font-medium mb-2">Elevated Card</h3>
              <p className="text-grey text-sm">This card has a stronger shadow</p>
            </Card>
            <Card variant="outlined">
              <h3 className="font-medium mb-2">Outlined Card</h3>
              <p className="text-grey text-sm">This card has a thicker border</p>
            </Card>
          </div>
        </section>

        {/* Typography Examples */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Typography Examples</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl font-normal mb-2">Heading 1 - 58px</h1>
                <p className="text-grey text-sm">Font: TWK Lausanne, Weight: 400</p>
              </div>
              <div>
                <h2 className="text-4xl font-normal mb-2">Heading 2 - 44px</h2>
                <p className="text-grey text-sm">Font: TWK Lausanne, Weight: 400</p>
              </div>
              <div>
                <h3 className="text-3xl font-normal mb-2">Heading 3 - 28px</h3>
                <p className="text-grey text-sm">Font: TWK Lausanne, Weight: 400</p>
              </div>
              <div>
                <p className="text-base mb-2">Body text - 15px</p>
                <p className="text-grey text-sm">Font: TWK Lausanne, Weight: 400</p>
              </div>
              <div>
                <p className="text-sm mb-2">Small text - 14px</p>
                <p className="text-grey text-sm">Font: TWK Lausanne, Weight: 400</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Search Component Section */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Search Component</h2>
          <Card>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">With Labels (default)</h3>
                <Search 
                  showLabels={true}
                  onFieldClick={(fieldId) => console.log('Field clicked:', fieldId)}
                  onSearch={() => console.log('Search clicked')}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">Without Labels</h3>
                <Search 
                  showLabels={false}
                  onFieldClick={(fieldId) => console.log('Field clicked:', fieldId)}
                  onSearch={() => console.log('Search clicked')}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">With Custom Values (with labels)</h3>
                <Search
                  showLabels={true}
                  defaultFields={{
                    stayType: 'Team building',
                    location: 'Paris, France',
                    dates: 'Mar 15 - Mar 20',
                  }}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4 text-grey">With Custom Values (without labels)</h3>
                <Search
                  showLabels={false}
                  defaultFields={{
                    stayType: 'Team building',
                    location: 'Paris, France',
                    dates: 'Mar 15 - Mar 20',
                  }}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Interactive Examples */}
        <section>
          <h2 className="text-3xl font-medium mb-6 tracking-tight">Interactive Examples</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Button Interactions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" className="hover:scale-105 transition-transform">
                    Hover me
                  </Button>
                  <Button variant="secondary" className="active:scale-95 transition-transform">
                    Click me
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

