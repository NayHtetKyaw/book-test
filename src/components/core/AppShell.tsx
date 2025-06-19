"use client";

import { AppShell, Container } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { HeaderComponent } from "./Header";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShellComponent({ children }: AppShellProps) {
  return (
    <>
      <Notifications position="top-right" />
      <AppShell header={{ height: 70 }} padding="md">
        <AppShell.Header>
          <HeaderComponent />
        </AppShell.Header>
        <AppShell.Main>
          <Container size="xl">{children}</Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
