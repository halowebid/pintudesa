"use client"

import * as React from "react"
import {
  Combobox as ComboboxPrimitive,
  useListCollection,
} from "@ark-ui/react/combobox"
import { useFilter } from "@ark-ui/react/locale"
import { Portal } from "@ark-ui/react/portal"
import { Icon } from "@yopem-ui/react-icons"
import { cn } from "@yopem-ui/utils"

import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface Item {
  label: string
  value: string
}

export interface ComboboxBaseProps
  extends Omit<
    React.ComponentProps<typeof ComboboxPrimitive.Root>,
    | "children"
    | "onValueChange"
    | "collection"
    | "onInputValueChange"
    | "value"
    | "inputValue"
  > {
  items: Item[]
  placeholder?: string
  groupLabel?: string
  onValueChange?: (item: Item) => void
  className?: string
  mode?: "portal" | "inline"
  onInputValueChange?: (value: string) => void
  inputValue?: string
  value?: string[]
}

export interface ComboboxBaseHandle {
  clear: () => void
}

export const ComboboxBase = React.forwardRef<
  ComboboxBaseHandle,
  ComboboxBaseProps
>(
  (
    {
      items,
      placeholder = "Search...",
      groupLabel = "Suggestions",
      className,
      mode = "portal",
      ...props
    },
    ref,
  ) => {
    const { contains } = useFilter({ sensitivity: "base" })

    const { collection, filter, clear } = useListCollection<Item>({
      initialItems: items,
      filter: contains,
    })

    React.useImperativeHandle(
      ref,
      () => ({
        clear,
      }),
      [clear],
    )

    const Content = (
      <ComboboxPrimitive.Content>
        {collection.items.length > 0 ? (
          <ComboboxPrimitive.ItemGroup>
            <ComboboxPrimitive.ItemGroupLabel className="text-muted-foreground px-3 py-1 text-xs font-medium">
              {groupLabel}
            </ComboboxPrimitive.ItemGroupLabel>
            {collection.items.map((item) => (
              <ComboboxPrimitive.Item
                key={item.value}
                item={item}
                className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm"
              >
                <ComboboxPrimitive.ItemText>
                  {item.label}
                </ComboboxPrimitive.ItemText>
                <ComboboxPrimitive.ItemIndicator asChild>
                  <Icon name="Check" className="size-4" />
                </ComboboxPrimitive.ItemIndicator>
              </ComboboxPrimitive.Item>
            ))}
          </ComboboxPrimitive.ItemGroup>
        ) : (
          <div className="text-muted-foreground px-3 py-4 text-center text-sm">
            No results found.
          </div>
        )}
      </ComboboxPrimitive.Content>
    )

    return (
      <ComboboxPrimitive.Root
        {...props}
        value={props.value}
        inputValue={props.inputValue}
        onInputValueChange={({ inputValue }) => {
          filter(inputValue)
          props.onInputValueChange?.(inputValue)
        }}
        onValueChange={({ value }) => {
          const selected = items.find((item) => item.value === value[0])
          if (selected) {
            props.onValueChange?.(selected)
          }
        }}
        collection={collection}
        className={cn("overflow-hidden rounded-md border", className)}
      >
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Icon name="Search" className="text-muted-foreground size-4" />
          <ComboboxPrimitive.Input
            placeholder={placeholder}
            className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
          />
          <ComboboxPrimitive.ClearTrigger
            className="text-muted-foreground hover:text-muted-foreground/80"
            asChild
          >
            <Icon name="X" className="size-4" />
          </ComboboxPrimitive.ClearTrigger>
        </div>

        {mode === "portal" ? (
          <ComboboxPrimitive.Positioner>
            <Portal>{Content}</Portal>
          </ComboboxPrimitive.Positioner>
        ) : (
          Content
        )}
      </ComboboxPrimitive.Root>
    )
  },
)

ComboboxBase.displayName = "ComboboxBase"
export interface ComboboxPopoverProps {
  value?: string
  onValueChange?: (value: string) => void
  onInputValueChange?: (value: string) => void
  items: Item[]
  placeholder?: string
  onClear?: () => void
  isClearable?: boolean
  popoverClassName?: string
  className?: string
  groupLabel?: string
  selectedLabel?: string
}

export const ComboboxPopover = ({
  value,
  onValueChange,
  items,
  placeholder,
  popoverClassName,
  className,
  groupLabel,
  onInputValueChange,
  isClearable,
  onClear,
  selectedLabel,
}: ComboboxPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const comboboxRef = React.useRef<ComboboxBaseHandle>(null)

  const label = React.useMemo(() => {
    return selectedLabel ?? placeholder ?? "Pilih opsi"
  }, [selectedLabel])

  const handleClear = () => {
    onClear?.()
    setInputValue("")
    comboboxRef.current?.clear()
  }

  React.useEffect(() => {
    if (isOpen) {
      comboboxRef.current?.clear()
    }
  }, [isOpen])

  return (
    <Popover open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <div
        className={cn(
          "border-input bg-background ring-offset-background focus-within:ring-ring flex h-10 w-full items-center rounded-md border px-3 text-sm focus-within:ring-2 focus-within:ring-offset-2",
          className,
        )}
      >
        <PopoverTrigger asChild>
          <div className="flex flex-grow cursor-pointer items-center justify-between">
            <span
              className={cn("truncate pr-2", {
                "text-muted-foreground": !value,
              })}
            >
              {label}
            </span>
            <Icon
              name="ChevronsUpDown"
              className="size-4 shrink-0 opacity-50"
            />
          </div>
        </PopoverTrigger>
        {isClearable && value && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={handleClear}
            className="z-10 ml-2 flex-shrink-0 cursor-default rounded-sm p-0.5 opacity-50 transition-opacity hover:opacity-100"
          >
            <Icon name="X" className="size-4" />
          </button>
        )}
      </div>

      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          popoverClassName,
        )}
      >
        <ComboboxBase
          ref={comboboxRef}
          mode="inline"
          items={items}
          value={value ? [value] : []}
          inputValue={inputValue}
          onInputValueChange={(val) => {
            setInputValue(val)
            onInputValueChange?.(val)
          }}
          onValueChange={(item) => {
            setIsOpen(false)
            setInputValue(item.label)
            onValueChange?.(item.value)
          }}
          placeholder={placeholder}
          groupLabel={groupLabel}
        />
      </PopoverContent>
    </Popover>
  )
}
