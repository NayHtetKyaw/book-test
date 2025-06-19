"use client";

import { Stack, Container, Title, Space } from "@mantine/core";
import { AppShellComponent } from "@/components/core/AppShell";
import { SearchBar } from "@/components/Search/SearchBar";
import { BookGrid } from "@/components/Books/BookGrid";
import { useBooks } from "@/hooks/useBooks";

export default function HomePage() {
  const { books, setSearchQuery } = useBooks();

  return (
    <AppShellComponent>
      <Stack>
        <Container size="sm">
          <Title order={1} ta="center" mb="xl">
            Discover Your Next Great Read
          </Title>
          <SearchBar onSearchAction={setSearchQuery} />
        </Container>

        <Space h="xl" />

        <BookGrid books={books} />
      </Stack>
    </AppShellComponent>
  );
}
