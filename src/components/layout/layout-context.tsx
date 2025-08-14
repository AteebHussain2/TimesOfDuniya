"use client"

import React, { createContext, useContext, useCallback, useRef } from "react"

interface LayoutContextType {
  toggleMobileSidebar: () => void
  registerMobileSidebarToggle: (toggleFn: () => void) => void
  unregisterMobileSidebarToggle: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const mobileSidebarToggleRef = useRef<(() => void) | null>(null)

  const toggleMobileSidebar = useCallback(() => {
    if (mobileSidebarToggleRef.current) {
      mobileSidebarToggleRef.current()
    }
  }, [])

  const registerMobileSidebarToggle = useCallback((toggleFn: () => void) => {
    mobileSidebarToggleRef.current = toggleFn
  }, [])

  const unregisterMobileSidebarToggle = useCallback(() => {
    mobileSidebarToggleRef.current = null
  }, [])

  const contextValue = React.useMemo(
    () => ({
      toggleMobileSidebar,
      registerMobileSidebarToggle,
      unregisterMobileSidebarToggle,
    }),
    [toggleMobileSidebar, registerMobileSidebarToggle, unregisterMobileSidebarToggle],
  )

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
