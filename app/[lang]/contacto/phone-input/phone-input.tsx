"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import { cn } from "./utils";
import { useIsMobile } from "./use-is-mobile";

type PhoneInputProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

export const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value || undefined}
      onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => <Input className={cn("border-l-0", className)} {...props} ref={ref} />,
);
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

interface CountrySelectProps {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
}

// Below 768px the combobox renders in a bottom Drawer instead of a Popover —
// easier to hit-target and dismiss on touch than a small anchored flyout.
function CountrySelect({ disabled, value: selectedCountry, options: countryList, onChange }: CountrySelectProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className="gap-1 border-r-0 px-3 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
      disabled={disabled}
    >
      <FlagComponent country={selectedCountry} countryName={selectedCountry} />
      <ChevronsUpDown className={cn("-mr-1 size-3.5 text-foreground-secondary", disabled && "hidden")} />
    </Button>
  );

  const list = (
    <CountryList
      countryList={countryList}
      selectedCountry={selectedCountry}
      onChange={onChange}
      onSelectComplete={() => setIsOpen(false)}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="pb-[env(safe-area-inset-bottom)]">{list}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={isOpen} modal onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">{list}</PopoverContent>
    </Popover>
  );
}

function CountryList({
  countryList,
  selectedCountry,
  onChange,
  onSelectComplete,
}: {
  countryList: CountryEntry[];
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Command>
      <CommandInput
        value={searchValue}
        onValueChange={(value) => {
          setSearchValue(value);
          setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
            if (viewport) viewport.scrollTop = 0;
          }, 0);
        }}
        placeholder="Search country…"
      />
      <CommandList>
        <ScrollArea ref={scrollAreaRef} className="h-64">
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            {countryList.map(({ value, label }) =>
              value ? (
                <CountrySelectOption
                  key={value}
                  country={value}
                  countryName={label}
                  selectedCountry={selectedCountry}
                  onChange={onChange}
                  onSelectComplete={onSelectComplete}
                />
              ) : null,
            )}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </Command>
  );
}

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

function CountrySelectOption({ country, countryName, selectedCountry, onChange, onSelectComplete }: CountrySelectOptionProps) {
  function handleSelect() {
    onChange(country);
    onSelectComplete();
  }

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground-secondary">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon className={cn("ml-auto size-4 text-accent-strong", country === selectedCountry ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
}

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = flags[country];
  return (
    <span className="flex h-4 w-6 shrink-0 overflow-hidden bg-border [&_svg:not([class*='size-'])]:size-full">
      {Flag ? <Flag title={countryName} /> : null}
    </span>
  );
}
