"use client";

import { SimpleGrid, Text, Center } from "@mantine/core";
import { BookCard } from "./BookCard";
import type { Book } from "@/types";

interface BookGridProps {
  books: Book[];
  loading?: boolean;
}

export function BookGrid({ books, loading }: BookGridProps) {
  if (loading) {
    return (
      <Center h={200}>
        <Text>Loading books...</Text>
      </Center>
    );
  }

  if (books.length === 0) {
    return (
      <Center h={200}>
        <Text size="lg" c="dimmed" data-testid="no-books-message">
          No books found. Try adjusting your search or filters.
        </Text>
      </Center>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
      spacing="lg"
      data-testid="books-grid"
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </SimpleGrid>
  );
}
